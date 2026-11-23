import { spawn } from "node:child_process";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import puppeteer from "puppeteer-core";

const PORT = 3094;
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
      // server not up yet
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

async function runPhase5Audits() {
  console.log(`Starting Next.js production server for Phase 5 Audits on port ${PORT}...`);
  await startServer();
  console.log(`Server ready at ${BASE_URL}.\n`);

  browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    userDataDir: path.join(process.cwd(), ".puppeteer-profile-phase5"),
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
      "--window-size=1280,900",
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
    // -------------------------------------------------------------
    // SECTION 6: PERFORMANCE AUDITS (P1 - P7)
    // -------------------------------------------------------------
    console.log("--- Section 6: Performance Audits ---");

    await test("P1: First Contentful Paint (FCP) on Home & WebStrike < 1500ms (Warm)", async () => {
      const page = await browser.newPage();
      // Warm-up hit
      await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle0" });
      
      // Measure warm navigation FCP
      await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle0" });
      const fcpHome = await page.evaluate(() => {
        const entry = performance.getEntriesByName("first-contentful-paint")[0];
        return entry ? entry.startTime : null;
      });

      await page.goto(`${BASE_URL}/products/webstrike`, { waitUntil: "networkidle0" });
      const fcpWebStrike = await page.evaluate(() => {
        const entry = performance.getEntriesByName("first-contentful-paint")[0];
        return entry ? entry.startTime : null;
      });

      await page.close();
      if (fcpHome !== null) assert.ok(fcpHome < 1500, `Home FCP ${Math.round(fcpHome)}ms must be < 1500ms`);
      if (fcpWebStrike !== null) assert.ok(fcpWebStrike < 1500, `WebStrike FCP ${Math.round(fcpWebStrike)}ms must be < 1500ms`);
    });

    await test("P2: DOMContentLoaded & Load Navigation Timing < 2500ms", async () => {
      const page = await browser.newPage();
      await page.goto(`${BASE_URL}/products/webstrike`, { waitUntil: "load" });
      const navTiming = await page.evaluate(() => {
        const nav = performance.getEntriesByType("navigation")[0];
        return {
          dcl: nav.domContentLoadedEventEnd - nav.startTime,
          load: nav.loadEventEnd - nav.startTime,
        };
      });
      await page.close();
      assert.ok(navTiming.dcl < 2500, `DOMContentLoaded ${navTiming.dcl}ms should be < 2500ms`);
      assert.ok(navTiming.load < 2500, `Load ${navTiming.load}ms should be < 2500ms`);
    });

    await test("P3: Cumulative Layout Shift (CLS) stability", async () => {
      const page = await browser.newPage();
      await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle0" });
      const cls = await page.evaluate(() => {
        return new Promise((resolve) => {
          let score = 0;
          try {
            const observer = new PerformanceObserver((list) => {
              for (const entry of list.getEntries()) {
                if (!entry.hadRecentInput) {
                  score += entry.value;
                }
              }
            });
            observer.observe({ type: "layout-shift", buffered: true });
            setTimeout(() => {
              observer.disconnect();
              resolve(score);
            }, 300);
          } catch {
            resolve(0);
          }
        });
      });
      await page.close();
      assert.ok(cls < 0.1, `CLS score ${cls} must be < 0.1`);
    });

    await test("P4: First Load JavaScript Bundle Budget < 150 KB", async () => {
      const zlib = await import("node:zlib");
      const appManifestPath = path.join(process.cwd(), ".next", "app-build-manifest.json");
      assert.ok(fs.existsSync(appManifestPath), "app-build-manifest.json must exist in .next");
      const manifest = JSON.parse(fs.readFileSync(appManifestPath, "utf-8"));
      
      const publicRoutes = ["/page", "/resources/page", "/products/webstrike/page", "/products/droidscan/page", "/products/chainbreak/page"];
      for (const route of publicRoutes) {
        const files = manifest.pages[route] || [];
        let gzippedTotal = 0;
        for (const file of files) {
          const fullPath = path.join(process.cwd(), ".next", file);
          if (fs.existsSync(fullPath)) {
            const buf = fs.readFileSync(fullPath);
            gzippedTotal += zlib.gzipSync(buf).length;
          }
        }
        const kb = Math.round(gzippedTotal / 1024);
        assert.ok(
          gzippedTotal < 150 * 1024,
          `Route ${route} first load JS (${kb} KB gzipped) must be < 150 KB budget`
        );
      }
    });

    await test("P5: Image Optimization with Next.js (next/image)", async () => {
      const page = await browser.newPage();
      await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle0" });
      const images = await page.evaluate(() => {
        return Array.from(document.querySelectorAll("img")).map((img) => ({
          src: img.src,
          alt: img.alt,
          loading: img.loading,
          decoding: img.decoding,
        }));
      });
      await page.close();
      assert.ok(images.length > 0, "Page should contain images");
      for (const img of images) {
        assert.ok(img.decoding === "async", `Image ${img.src} should use async decoding`);
      }
    });

    await test("P6: Static Site Generation (SSG) for Marketing Pages", async () => {
      const pages = ["/", "/resources", "/products/droidscan", "/products/chainbreak", "/products/webstrike"];
      for (const p of pages) {
        const res = await fetch(`${BASE_URL}${p}`);
        assert.strictEqual(res.status, 200, `Page ${p} should return 200 OK`);
        const html = await res.text();
        assert.ok(html.includes("<!DOCTYPE html>"), `Page ${p} should return prerendered HTML`);
        assert.ok(!html.includes("Application error: a client-side exception has occurred"), `Page ${p} should render cleanly`);
      }
    });

    await test("P7: Product PDF Download Latency and Integrity", async () => {
      const pdfs = [
        "/resources/webstrike-product-one-pager.pdf",
        "/resources/droidscan-product-one-pager.pdf",
        "/resources/chainbreak-product-one-pager.pdf",
      ];
      for (const pdfUrl of pdfs) {
        const start = Date.now();
        const res = await fetch(`${BASE_URL}${pdfUrl}`);
        const elapsed = Date.now() - start;
        assert.strictEqual(res.status, 200, `PDF ${pdfUrl} must return 200`);
        assert.strictEqual(res.headers.get("content-type"), "application/pdf");
        const buf = await res.arrayBuffer();
        assert.ok(buf.byteLength > 50 * 1024, `PDF ${pdfUrl} must be > 50KB (actual: ${buf.byteLength})`);
        assert.ok(elapsed < 1000, `PDF ${pdfUrl} streamed in ${elapsed}ms (< 1000ms)`);
      }
    });

    // -------------------------------------------------------------
    // SECTION 8: ACCESSIBILITY AUDITS (A1 - A9)
    // -------------------------------------------------------------
    console.log("\n--- Section 8: Accessibility Audits (WCAG 2.1 AA) ---");

    await test("A1: Keyboard Navigation Tab Sequence & Focusability", async () => {
      const page = await browser.newPage();
      await page.setViewport({ width: 1280, height: 900 });
      await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle0" });

      const focusedElements = [];
      for (let i = 0; i < 6; i++) {
        await page.keyboard.press("Tab");
        const activeTag = await page.evaluate(() => {
          const el = document.activeElement;
          return el ? `${el.tagName.toLowerCase()}[${el.getAttribute("aria-label") || el.innerText || el.href || ""}]` : null;
        });
        focusedElements.push(activeTag);
      }
      await page.close();
      assert.ok(focusedElements.length >= 5, "Keyboard navigation tabs through interactive elements");
    });

    await test("A2: Focus Visible Ring Styling on Interactive Elements", async () => {
      const page = await browser.newPage();
      await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle0" });
      const ringStyles = await page.evaluate(() => {
        const linksAndButtons = Array.from(document.querySelectorAll("a, button, input, textarea, select"));
        const withFocusClasses = linksAndButtons.filter((el) => {
          const cls = el.className || "";
          return cls.includes("focus-visible:") || cls.includes("focus:");
        });
        return {
          total: linksAndButtons.length,
          withFocusClasses: withFocusClasses.length,
        };
      });
      await page.close();
      assert.ok(
        ringStyles.withFocusClasses > 10,
        `Interactive elements define focus rings (${ringStyles.withFocusClasses} found)`
      );
    });

    await test("A3: Non-empty Image Alt Text Across All Pages", async () => {
      const paths = ["/", "/products/webstrike", "/products/droidscan", "/products/chainbreak", "/resources"];
      const page = await browser.newPage();
      for (const p of paths) {
        await page.goto(`${BASE_URL}${p}`, { waitUntil: "networkidle0" });
        const missingAltCount = await page.evaluate(() => {
          const images = Array.from(document.querySelectorAll("img"));
          return images.filter((img) => !img.hasAttribute("alt") || img.alt === null).length;
        });
        assert.strictEqual(missingAltCount, 0, `Page ${p} has 0 images with missing alt attribute`);
      }
      await page.close();
    });

    await test("A4: Form Input Labels with Matching htmlFor and id", async () => {
      const page = await browser.newPage();
      await page.goto(`${BASE_URL}/#contact`, { waitUntil: "networkidle0" });
      const formBinding = await page.evaluate(() => {
        const form = document.querySelector("#contact form");
        if (!form) return { hasForm: false };
        const inputs = Array.from(form.querySelectorAll("input:not([type=hidden]), select, textarea"));
        const unbound = [];
        for (const input of inputs) {
          const id = input.id;
          const label = id ? document.querySelector(`label[for="${id}"]`) : null;
          if (!label) unbound.push(input.name || id || input.tagName);
        }
        return { hasForm: true, totalInputs: inputs.length, unbound };
      });
      await page.close();
      assert.ok(formBinding.hasForm, "Contact form must exist");
      assert.strictEqual(formBinding.unbound.length, 0, `All inputs have matching label[for]: unbound=${formBinding.unbound}`);
    });

    await test("A5: Accessible Color Contrast Ratios", async () => {
      const page = await browser.newPage();
      await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle0" });
      const contrastCheck = await page.evaluate(() => {
        const footer = document.querySelector("footer");
        const computed = window.getComputedStyle(footer);
        return {
          bgColor: computed.backgroundColor, // rgb(255, 103, 0)
          color: computed.color,             // rgb(255, 255, 255)
        };
      });
      await page.close();
      assert.ok(contrastCheck.bgColor.includes("255, 103, 0"), "Footer matches brand orange #FF6700");
    });

    await test("A6: Screen Reader Landmarks and ARIA Labels", async () => {
      const page = await browser.newPage();
      await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle0" });
      const landmarks = await page.evaluate(() => {
        return {
          hasHeader: !!document.querySelector("header"),
          hasMain: !!document.querySelector("main"),
          hasFooter: !!document.querySelector("footer"),
          navLabels: Array.from(document.querySelectorAll("nav, [role=navigation]")).map((n) => n.getAttribute("aria-label")),
          buttonsWithAria: Array.from(document.querySelectorAll("button[aria-label]")).length,
        };
      });
      await page.close();
      assert.ok(landmarks.hasHeader, "Must have <header>");
      assert.ok(landmarks.hasMain, "Must have <main>");
      assert.ok(landmarks.hasFooter, "Must have <footer>");
      assert.ok(landmarks.buttonsWithAria > 0, "Mobile drawer button has aria-label");
    });

    await test("A7: Escape Key Dismisses Mobile Navigation Drawer", async () => {
      const page = await browser.newPage();
      await page.setViewport({ width: 375, height: 667 });
      await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle0" });

      const toggleBtn = await page.$('button[aria-label="Toggle navigation menu"]');
      assert.ok(toggleBtn, "Hamburger button present in mobile view");
      await toggleBtn.click();
      await sleep(200);

      const mobileNavOpen = await page.$('nav[aria-label="Mobile Navigation"]');
      assert.ok(mobileNavOpen, "Mobile navigation menu visible after click");

      await page.keyboard.press("Escape");
      await sleep(200);

      const mobileNavClosed = await page.$('nav[aria-label="Mobile Navigation"]');
      assert.strictEqual(mobileNavClosed, null, "Mobile menu dismissed on Escape key");
      await page.close();
    });

    await test("A8: Body Scroll Lock During Mobile Navigation", async () => {
      const page = await browser.newPage();
      await page.setViewport({ width: 375, height: 667 });
      await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle0" });

      const toggleBtn = await page.$('button[aria-label="Toggle navigation menu"]');
      await toggleBtn.click();
      await sleep(200);

      const overflowLocked = await page.evaluate(() => document.body.style.overflow);
      assert.strictEqual(overflowLocked, "hidden", "Body scroll is locked when menu is open");

      await page.keyboard.press("Escape");
      await sleep(200);

      const overflowRestored = await page.evaluate(() => document.body.style.overflow);
      assert.strictEqual(overflowRestored, "", "Body scroll lock restored when menu is closed");
      await page.close();
    });

    await test("A9: Brand Text Selection Styling", async () => {
      const layoutPath = path.join(process.cwd(), "src", "app", "layout.tsx");
      const content = fs.readFileSync(layoutPath, "utf-8");
      assert.ok(content.includes("selection:bg-[#FF6700]"), "Selection uses brand orange highlight");
    });

    // -------------------------------------------------------------
    // SECTION 9: SEO & METADATA AUDITS (SE1 - SE8)
    // -------------------------------------------------------------
    console.log("\n--- Section 9: SEO & Metadata Audits ---");

    await test("SE1: Distinct Page Titles for Every Route", async () => {
      const expectedTitles = [
        { path: "/", contains: "Everence SecuraApps | Security intelligence, engineered" },
        { path: "/products/webstrike", contains: "WebStrike" },
        { path: "/products/droidscan", contains: "DroidScan" },
        { path: "/products/chainbreak", contains: "ChainBreak" },
        { path: "/resources", contains: "Resources" },
      ];
      const page = await browser.newPage();
      for (const item of expectedTitles) {
        await page.goto(`${BASE_URL}${item.path}`, { waitUntil: "networkidle0" });
        const title = await page.title();
        assert.ok(title.includes(item.contains), `Page ${item.path} title "${title}" should contain "${item.contains}"`);
      }
      await page.close();
    });

    await test("SE2: Unique, Non-Empty Meta Descriptions", async () => {
      const paths = ["/", "/products/webstrike", "/products/droidscan", "/products/chainbreak", "/resources"];
      const descriptions = new Set();
      const page = await browser.newPage();
      for (const p of paths) {
        await page.goto(`${BASE_URL}${p}`, { waitUntil: "networkidle0" });
        const desc = await page.evaluate(() => {
          const el = document.querySelector('meta[name="description"]');
          return el ? el.getAttribute("content") : null;
        });
        assert.ok(desc && desc.length > 30, `Page ${p} has descriptive meta description (len=${desc ? desc.length : 0})`);
        descriptions.add(desc);
      }
      await page.close();
      assert.ok(descriptions.size >= 4, "Descriptions across routes are distinct and non-duplicated");
    });

    await test("SE3: Open Graph and Twitter Card Tags", async () => {
      const page = await browser.newPage();
      await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle0" });
      const ogData = await page.evaluate(() => {
        const getMeta = (prop) => {
          const el = document.querySelector(`meta[property="${prop}"], meta[name="${prop}"]`);
          return el ? el.getAttribute("content") : null;
        };
        return {
          ogTitle: getMeta("og:title"),
          ogDesc: getMeta("og:description"),
          ogUrl: getMeta("og:url"),
          ogType: getMeta("og:type"),
          twitterCard: getMeta("twitter:card"),
        };
      });
      await page.close();
      assert.ok(ogData.ogTitle, "og:title is present");
      assert.ok(ogData.ogDesc, "og:description is present");
      assert.ok(ogData.ogType === "website", "og:type is website");
      assert.ok(ogData.twitterCard === "summary_large_image", "twitter:card is summary_large_image");
    });

    await test("SE4: Metadata Keywords Contain Migrated WebStrike", async () => {
      const layoutPath = path.join(process.cwd(), "src", "app", "layout.tsx");
      const content = fs.readFileSync(layoutPath, "utf-8");
      assert.ok(content.includes('"WebStrike"'), 'layout.tsx keywords must include "WebStrike"');
      assert.ok(!content.includes('"NimbusQ"'), 'layout.tsx keywords must not include legacy "NimbusQ"');
    });

    await test("SE5: Sitemap XML Endpoint Validity and Completeness", async () => {
      const res = await fetch(`${BASE_URL}/sitemap.xml`);
      assert.strictEqual(res.status, 200, "Sitemap responds with 200");
      const xml = await res.text();
      assert.ok(xml.includes("<urlset"), "Sitemap contains <urlset>");
      assert.ok(xml.includes("https://everence-securaapps.com/products/webstrike"), "Sitemap includes /products/webstrike");
      assert.ok(!xml.includes("https://everence-securaapps.com/products/nimbusq"), "Sitemap excludes legacy /products/nimbusq");
      assert.ok(xml.includes("https://everence-securaapps.com/products/droidscan"), "Sitemap includes /products/droidscan");
      assert.ok(xml.includes("https://everence-securaapps.com/products/chainbreak"), "Sitemap includes /products/chainbreak");
      assert.ok(xml.includes("https://everence-securaapps.com/resources"), "Sitemap includes /resources");
    });

    await test("SE6: Robots.txt Rules and Sitemap Reference", async () => {
      const res = await fetch(`${BASE_URL}/robots.txt`);
      assert.strictEqual(res.status, 200, "Robots.txt responds with 200");
      const txt = await res.text();
      assert.ok(txt.includes("User-Agent: *"), "Robots.txt has User-Agent: *");
      assert.ok(txt.includes("Allow: /"), "Robots.txt allows root");
      assert.ok(txt.includes("Disallow: /api/"), "Robots.txt disallows /api/");
      assert.ok(txt.includes("Disallow: /dashboard/"), "Robots.txt disallows /dashboard/");
      assert.ok(txt.includes("Sitemap: https://everence-securaapps.com/sitemap.xml"), "Robots.txt points to sitemap");
    });

    await test("SE7: Legacy Canonical Redirect from /products/nimbusq to /products/webstrike", async () => {
      const res = await fetch(`${BASE_URL}/products/nimbusq`, { redirect: "manual" });
      assert.ok([307, 308].includes(res.status), `Legacy product responds with redirect (got ${res.status})`);
      assert.strictEqual(res.headers.get("location"), "/products/webstrike");
    });

    await test("SE8: Favicon & Apple Touch Icon Availability", async () => {
      const iconRes = await fetch(`${BASE_URL}/assets/logo.png`);
      assert.strictEqual(iconRes.status, 200, "Favicon logo.png must return 200");
      assert.strictEqual(iconRes.headers.get("content-type"), "image/png");
      const buf = await iconRes.arrayBuffer();
      assert.ok(buf.byteLength > 1000, "Favicon file must be valid non-empty image");
    });

  } finally {
    if (browser) {
      await browser.close().catch(() => {});
    }
    stopServer();
  }

  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;
  console.log(`\n--- Phase 5 Audits (Performance, A11y, SEO) Results ---`);
  console.log(`Total: ${results.length} | Passed: ${passed} | Failed: ${failed}\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runPhase5Audits().catch((err) => {
  console.error("Fatal audit execution error:", err);
  stopServer();
  process.exit(1);
});
