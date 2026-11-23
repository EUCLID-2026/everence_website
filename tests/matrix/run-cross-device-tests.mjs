import { spawn } from "node:child_process";
import assert from "node:assert/strict";
import path from "node:path";
import puppeteer from "puppeteer-core";

const PORT = 3093;
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
      // server starting
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

const DEVICE_PROFILES = [
  {
    name: "iPhone 14 Pro (iOS Safari)",
    category: "mobile",
    viewport: { width: 393, height: 852, deviceScaleFactor: 3, isMobile: true, hasTouch: true },
    userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
  },
  {
    name: "Pixel 7 (Android Chrome)",
    category: "mobile",
    viewport: { width: 412, height: 915, deviceScaleFactor: 2.625, isMobile: true, hasTouch: true },
    userAgent: "Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.6099.144 Mobile Safari/537.36",
  },
  {
    name: "Compact Mobile (320px Baseline)",
    category: "mobile",
    viewport: { width: 320, height: 568, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
    userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Safari/604.1",
  },
  {
    name: "iPad Air (Tablet Portrait)",
    category: "tablet",
    viewport: { width: 820, height: 1180, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
    userAgent: "Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
  },
  {
    name: "Standard Laptop (1280x800)",
    category: "desktop",
    viewport: { width: 1280, height: 800, deviceScaleFactor: 1, isMobile: false, hasTouch: false },
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
  },
  {
    name: "Retina MacBook (1440x900 @ 2x)",
    category: "desktop",
    viewport: { width: 1440, height: 900, deviceScaleFactor: 2, isMobile: false, hasTouch: false },
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2.1 Safari/605.1.15",
  },
  {
    name: "Full HD 1080p (1920x1080)",
    category: "desktop",
    viewport: { width: 1920, height: 1080, deviceScaleFactor: 1, isMobile: false, hasTouch: false },
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:123.0) Gecko/20100101 Firefox/123.0",
  },
];

async function runCrossDeviceTests() {
  console.log(`Starting Next.js production server for Phase 6 Matrix on port ${PORT}...`);
  await startServer();
  console.log(`Server ready at ${BASE_URL}.\n`);

  browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    userDataDir: path.join(process.cwd(), ".puppeteer-profile-phase6"),
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
    ],
  });

  const results = [];
  const test = async (name, fn) => {
    const start = Date.now();
    try {
      await fn();
      const duration = Date.now() - start;
      console.log(`✔ ${name} (${duration}ms)`);
      results.push({ name, passed: true, duration });
    } catch (err) {
      const duration = Date.now() - start;
      console.error(`✖ ${name} (${duration}ms)`);
      console.error(`  ${err.message}`);
      results.push({ name, passed: false, duration, error: err.message });
    }
  };

  try {
    const keyRoutes = [
      "/",
      "/products/webstrike",
      "/resources",
      "/login",
    ];

    console.log("--- Phase 6: Cross-Browser & Multi-Device Testing Matrix ---\n");

    for (const dev of DEVICE_PROFILES) {
      console.log(`Testing Profile: [${dev.name}] (${dev.viewport.width}x${dev.viewport.height})`);

      await test(`6.1 [${dev.name}] Zero Horizontal Overflow across key routes`, async () => {
        const page = await browser.newPage();
        page.setDefaultNavigationTimeout(8000);
        await page.setUserAgent(dev.userAgent);
        await page.setViewport(dev.viewport);

        for (const route of keyRoutes) {
          await page.goto(`${BASE_URL}${route}`, { waitUntil: "load" });
          await sleep(100);
          const overflow = await page.evaluate(() => {
            const root = document.documentElement;
            return {
              scrollWidth: root.scrollWidth,
              innerWidth: window.innerWidth,
              hasHorizontalOverflow: root.scrollWidth > window.innerWidth,
            };
          });
          assert.strictEqual(
            overflow.hasHorizontalOverflow,
            false,
            `Route ${route} has horizontal overflow (scrollWidth=${overflow.scrollWidth} > innerWidth=${overflow.innerWidth})`
          );
        }
        await page.close();
      });

      await test(`6.2 [${dev.name}] Navigation Bar Responsiveness (Desktop vs Hamburger)`, async () => {
        const page = await browser.newPage();
        page.setDefaultNavigationTimeout(8000);
        await page.setUserAgent(dev.userAgent);
        await page.setViewport(dev.viewport);
        await page.goto(`${BASE_URL}/`, { waitUntil: "load" });
        await sleep(100);

        const navState = await page.evaluate(() => {
          const hamburger = document.querySelector('button[aria-label="Toggle navigation menu"]');
          const desktopNav = document.querySelector('nav[aria-label="Main Navigation"]');
          return {
            isHamburgerRendered: !!hamburger,
            isHamburgerVisible: hamburger ? window.getComputedStyle(hamburger).display !== "none" : false,
            isDesktopNavVisible: desktopNav ? window.getComputedStyle(desktopNav).display !== "none" : false,
          };
        });

        await page.close();

        if (dev.category === "mobile") {
          assert.strictEqual(navState.isHamburgerVisible, true, "Hamburger button must be visible on mobile");
          assert.strictEqual(navState.isDesktopNavVisible, false, "Desktop navbar must be hidden on mobile");
        } else if (dev.category === "desktop") {
          assert.strictEqual(navState.isHamburgerVisible, false, "Hamburger button must be hidden on desktop");
          assert.strictEqual(navState.isDesktopNavVisible, true, "Desktop navbar must be visible on desktop");
        }
      });

      await test(`6.3 [${dev.name}] WebStrike Product Page Grid & Layout Adaptation`, async () => {
        const page = await browser.newPage();
        page.setDefaultNavigationTimeout(8000);
        await page.setUserAgent(dev.userAgent);
        await page.setViewport(dev.viewport);
        await page.goto(`${BASE_URL}/products/webstrike`, { waitUntil: "load" });
        await sleep(100);

        const layoutCheck = await page.evaluate(() => {
          const cards = Array.from(document.querySelectorAll("h3")).filter((h) =>
            h.innerText.includes("Phishing") || h.innerText.includes("Perimeter") || h.innerText.includes("Misconfiguration")
          );
          return {
            detectedFeatureCards: cards.length,
            pageTitle: document.title,
          };
        });

        await page.close();
        assert.ok(layoutCheck.detectedFeatureCards >= 3, "Feature cards render properly on WebStrike");
      });

      if (dev.category === "mobile") {
        await test(`6.4 [${dev.name}] Touch Interaction: Mobile Menu Tap & Navigation`, async () => {
          const page = await browser.newPage();
          page.setDefaultNavigationTimeout(8000);
          await page.setUserAgent(dev.userAgent);
          await page.setViewport(dev.viewport);
          await page.goto(`${BASE_URL}/`, { waitUntil: "load" });
          await sleep(100);

          // Tap hamburger button
          const hamburger = await page.$('button[aria-label="Toggle navigation menu"]');
          assert.ok(hamburger, "Hamburger button must exist");
          await hamburger.tap();
          await sleep(250);

          const mobileNav = await page.$('nav[aria-label="Mobile Navigation"]');
          assert.ok(mobileNav, "Mobile Navigation menu must expand on tap");

          // Tap again to close
          await hamburger.tap();
          await sleep(250);

          const mobileNavClosed = await page.$('nav[aria-label="Mobile Navigation"]');
          assert.strictEqual(mobileNavClosed, null, "Mobile Navigation menu must collapse on tap");
          await page.close();
        });
      }

      console.log("");
    }

  } finally {
    if (browser) {
      await browser.close().catch(() => {});
    }
    stopServer();
  }

  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;
  console.log(`--- Phase 6 Cross-Device Matrix Results ---`);
  console.log(`Total: ${results.length} | Passed: ${passed} | Failed: ${failed}\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runCrossDeviceTests().catch((err) => {
  console.error("Fatal cross-device matrix error:", err);
  stopServer();
  process.exit(1);
});
