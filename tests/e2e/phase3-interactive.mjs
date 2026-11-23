import { spawn } from "node:child_process";
import assert from "node:assert/strict";
import puppeteer from "puppeteer-core";

const PORT = 3097;
const BASE_URL = `http://localhost:${PORT}`;
const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

let serverProcess = null;
let browser = null;

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForServer(maxAttempts = 50) {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const res = await fetch(`${BASE_URL}/api/auth/me`);
      if (res.status === 401 || res.status === 200) {
        return true;
      }
    } catch {
      // Server not ready yet
    }
    await sleep(250);
  }
  return false;
}

function startServer() {
  return new Promise((resolve, reject) => {
    serverProcess = spawn(
      process.execPath,
      ["node_modules/next/dist/bin/next", "start", "-p", String(PORT)],
      {
        cwd: process.cwd(),
        env: { ...process.env, NODE_ENV: "production", PORT: String(PORT) },
        stdio: "inherit",
      }
    );

    serverProcess.on("error", (err) => {
      reject(err);
    });

    serverProcess.on("exit", (code) => {
      if (code !== null && code !== 0) {
        reject(new Error(`Next.js process exited early with code ${code}`));
      }
    });

    waitForServer()
      .then((ready) => {
        if (ready) resolve();
        else reject(new Error("Next.js server failed to respond within timeout."));
      })
      .catch(reject);
  });
}

function stopServer() {
  if (serverProcess) {
    try {
      spawn("taskkill", ["/pid", String(serverProcess.pid), "/f", "/t"]);
    } catch {
      serverProcess.kill();
    }
  }
}

async function runPhase3Tests() {
  console.log(`Starting Next.js production server on port ${PORT}...`);
  await startServer();
  console.log(`Server ready at ${BASE_URL}.\n`);

  console.log(`Launching headless Chrome from ${CHROME_PATH}...`);
  browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
  });
  console.log("Chrome launched successfully. Running Phase 3 interactive test suite...\n");

  const results = [];

  async function testCase(name, fn) {
    const start = performance.now();
    try {
      await fn();
      const duration = (performance.now() - start).toFixed(2);
      console.log(`✔ ${name} (${duration}ms)`);
      results.push({ name, pass: true });
    } catch (err) {
      const duration = (performance.now() - start).toFixed(2);
      console.error(`✖ ${name} (${duration}ms):`, err.message);
      results.push({ name, pass: false, error: err.message });
    }
  }

  // --- 1. MARKETING NAVIGATION & ANCHOR SCROLLING ---
  await testCase("3.1 Desktop Navigation - Anchor links and WebStrike product routing", async () => {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle0" });

    // Check title
    const title = await page.title();
    assert.ok(title.includes("Everence") || title.includes("SecuraApps"));

    // Check header logo presence
    const headerLogo = await page.$("header img[alt='Everence SecuraApps logo']");
    assert.ok(headerLogo, "Header logo must be present");

    // Click 'Explore our products' button in hero
    const exploreBtn = await page.$("a[href='/#products']");
    assert.ok(exploreBtn, "Explore products button must exist in hero");
    await exploreBtn.click();
    await sleep(400);

    // Verify products section is present and visible
    const productsSection = await page.$("#products");
    assert.ok(productsSection, "#products section must exist");

    // Click 'Explore WebStrike' link
    const webstrikeLink = await page.$("a[href='/products/webstrike']");
    assert.ok(webstrikeLink, "WebStrike product card link must exist");
    await Promise.all([
      page.waitForNavigation({ waitUntil: "networkidle0" }),
      webstrikeLink.click(),
    ]);

    // Verify WebStrike page loaded
    const currentUrl = page.url();
    assert.ok(currentUrl.includes("/products/webstrike"), `Expected URL to include /products/webstrike, got ${currentUrl}`);
    const pageHeading = await page.$eval("h1", (el) => el.innerText);
    assert.ok(pageHeading.includes("Understand the security"), "WebStrike heading must be rendered");

    // Verify PDF download button exists with download attribute
    const downloadBtn = await page.$("a[href='/resources/webstrike-product-one-pager.pdf']");
    assert.ok(downloadBtn, "WebStrike PDF download button must be present");
    const hasDownloadAttr = await page.$eval(
      "a[href='/resources/webstrike-product-one-pager.pdf']",
      (el) => el.hasAttribute("download")
    );
    assert.equal(hasDownloadAttr, true, "PDF link must have download attribute");

    await page.close();
  });

  // --- 2. CONTACT FORM CLIENT-SIDE INTERACTION ---
  await testCase("3.2 Contact Form - Validation, fields entry, and interactive submission", async () => {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 900 });

    await page.goto(`${BASE_URL}/#contact`, { waitUntil: "networkidle0" });

    // Form inputs presence
    const nameInput = await page.$("#contact-name");
    const emailInput = await page.$("#contact-email");
    const orgInput = await page.$("#contact-organisation");
    const productSelect = await page.$("#contact-product");
    const messageInput = await page.$("#contact-message");
    const submitBtn = await page.$("button[type='submit']");

    assert.ok(nameInput && emailInput && productSelect && messageInput && submitBtn, "All contact form controls must exist");

    // Verify WebStrike option exists in dropdown
    const hasWebStrikeOption = await page.$eval("#contact-product", (select) =>
      Array.from(select.options).some((opt) => opt.value === "WebStrike")
    );
    assert.equal(hasWebStrikeOption, true, "Product dropdown must include WebStrike");

    // Fill form fields
    await nameInput.type("Priya Sharma");
    await emailInput.type("priya.sharma@techdefense.io");
    await orgInput.type("TechDefense Systems");
    await productSelect.select("WebStrike");
    await messageInput.type("We would like an architectural walkthrough of WebStrike's perimeter monitoring.");

    // Wait 2 seconds to satisfy human velocity threshold (> 1800ms)
    await sleep(2000);

    // Submit form
    await submitBtn.click();

    // Wait for success toast / confirmation
    await page.waitForFunction(
      () => document.body.innerText.includes("Thank you for contacting Everence SecuraApps") ||
            document.body.innerText.includes("Your enquiry has been received"),
      { timeout: 8000 }
    );

    const bodyText = await page.$eval("body", (el) => el.innerText);
    assert.ok(
      bodyText.includes("Thank you for contacting Everence SecuraApps") ||
      bodyText.includes("Your enquiry has been received"),
      "Success feedback message must be visible on submission"
    );

    await page.close();
  });

  // --- 3. MOBILE RESPONSIVE NAVIGATION & BODY SCROLL LOCK ---
  await testCase("3.3 Mobile Navigation - Hamburger menu toggle, body scroll lock, and ESC key dismissal", async () => {
    const page = await browser.newPage();
    // iPhone 14/15 Viewport
    await page.setViewport({ width: 390, height: 844 });

    await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle0" });

    // Verify desktop navigation is hidden
    const desktopNavDisplay = await page.$eval("nav[aria-label='Main Navigation']", (el) =>
      window.getComputedStyle(el).display
    );
    assert.equal(desktopNavDisplay, "none", "Desktop nav must be hidden on mobile viewport");

    // Find and click hamburger menu button
    const menuBtn = await page.$("button[aria-label='Toggle navigation menu'], header button");
    assert.ok(menuBtn, "Mobile menu toggle button must exist");
    await menuBtn.click();
    await sleep(300);

    // Verify body scroll lock: document.body.style.overflow should be 'hidden'
    const bodyOverflowLocked = await page.evaluate(() => document.body.style.overflow);
    assert.equal(bodyOverflowLocked, "hidden", "Opening mobile menu must lock body scroll (overflow: hidden)");

    // Press Escape key
    await page.keyboard.press("Escape");
    await sleep(300);

    // Verify body scroll lock released: document.body.style.overflow should be ''
    const bodyOverflowUnlocked = await page.evaluate(() => document.body.style.overflow);
    assert.equal(bodyOverflowUnlocked, "", "Pressing Escape must close menu and unlock body scroll");

    await page.close();
  });

  // --- 4. LEGACY ROUTE SEAMLESS BROWSER REDIRECT ---
  await testCase("3.4 Browser Navigation - /products/nimbusq seamlessly redirects to /products/webstrike", async () => {
    const page = await browser.newPage();
    await page.goto(`${BASE_URL}/products/nimbusq`, { waitUntil: "networkidle0" });

    const finalUrl = page.url();
    assert.ok(finalUrl.includes("/products/webstrike"), `Expected URL to be /products/webstrike, got ${finalUrl}`);

    const h1Text = await page.$eval("h1", (el) => el.innerText);
    assert.ok(h1Text.includes("Understand the security"), "Redirected page must render WebStrike content");

    await page.close();
  });

  // --- 5. CUSTOM 404 NOT-FOUND PAGE ---
  await testCase("3.5 Custom 404 Not Found Page - Renders branded 404 with tunnel background and home link", async () => {
    const page = await browser.newPage();
    const response = await page.goto(`${BASE_URL}/non-existent-route-999888`, { waitUntil: "networkidle0" });

    // Verify 404 status code
    assert.equal(response.status(), 404, "Invalid route must return HTTP 404");

    // Verify 404 page elements
    const pageContent = await page.$eval("body", (el) => el.innerText);
    assert.ok(
      pageContent.includes("404") || pageContent.includes("Page not found") || pageContent.includes("Return Home"),
      "Custom 404 page content must be rendered"
    );

    // Verify home link exists and works
    const homeLink = await page.$("a[href='/']");
    assert.ok(homeLink, "Return home link must exist on 404 page");
    await Promise.all([
      page.waitForNavigation({ waitUntil: "networkidle0" }),
      homeLink.click(),
    ]);

    assert.equal(page.url(), `${BASE_URL}/`, "Clicking home link from 404 must navigate back to home");

    await page.close();
  });

  // Summary
  const total = results.length;
  const passed = results.filter((r) => r.pass).length;
  const failed = total - passed;

  console.log(`\n--- Phase 3 Interactive UI Test Results ---`);
  console.log(`Total: ${total} | Passed: ${passed} | Failed: ${failed}`);

  if (browser) await browser.close();
  stopServer();

  if (failed > 0) {
    process.exit(1);
  }
}

process.on("SIGINT", () => {
  if (browser) browser.close();
  stopServer();
  process.exit(1);
});

process.on("SIGTERM", () => {
  if (browser) browser.close();
  stopServer();
  process.exit(1);
});

runPhase3Tests().catch((err) => {
  console.error("Phase 3 test execution failed:", err);
  if (browser) browser.close();
  stopServer();
  process.exit(1);
});
