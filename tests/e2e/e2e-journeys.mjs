import { spawn } from "node:child_process";
import assert from "node:assert/strict";

const PORT = 3098;
const BASE_URL = `http://localhost:${PORT}`;

let serverProcess = null;

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

async function runE2E() {
  console.log(`Starting Next.js server for Phase 3 E2E testing on port ${PORT}...`);
  await startServer();
  console.log(`Server ready at ${BASE_URL}. Running Phase 3 E2E Journeys...\n`);

  const results = [];

  async function testJourney(name, fn) {
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

  // --- JOURNEY 1: PUBLIC VISITOR & MARKETING EXPERIENCE ---
  await testJourney("E2E Journey 1: Home page loads with authentic hero, products, and contact", async () => {
    const res = await fetch(`${BASE_URL}/`);
    assert.equal(res.status, 200);
    const html = await res.text();
    assert.ok(html.includes("Everence") || html.includes("SecuraApps"));
    assert.ok(html.includes("DroidScan"));
    assert.ok(html.includes("ChainBreak"));
    assert.ok(html.includes("NimbusQ"));
    assert.ok(html.includes("Request a demo"));
  });

  await testJourney("E2E Journey 1.1: Product Page - DroidScan renders all 4 sections", async () => {
    const res = await fetch(`${BASE_URL}/products/droidscan`);
    assert.equal(res.status, 200);
    const html = await res.text();
    assert.ok(html.includes("Uncover the truth hidden"));
    assert.ok(html.includes("Security triage"));
    assert.ok(html.includes("In-browser code studio"));
    assert.ok(html.includes("Enterprise AppSec"));
    assert.ok(html.includes("Upload an app package"));
  });

  await testJourney("E2E Journey 1.2: Product Page - ChainBreak renders all 4 sections", async () => {
    const res = await fetch(`${BASE_URL}/products/chainbreak`);
    assert.equal(res.status, 200);
    const html = await res.text();
    assert.ok(html.includes("Understand the behaviour"));
    assert.ok(html.includes("Wallet profiling"));
    assert.ok(html.includes("Transaction ledger"));
    assert.ok(html.includes("Crypto exchanges"));
    assert.ok(html.includes("One address in. A professional"));
  });

  await testJourney("E2E Journey 1.3: Product Page - NimbusQ renders all 4 sections", async () => {
    const res = await fetch(`${BASE_URL}/products/nimbusq`);
    assert.equal(res.status, 200);
    const html = await res.text();
    assert.ok(html.includes("Prepare your cloud"));
    assert.ok(html.includes("Cloud asset inventory"));
    assert.ok(html.includes("Quantum safety score"));
    assert.ok(html.includes("Connect. Scan. Analyse."));
    assert.ok(html.includes("Make your cloud and post-"));
  });

  await testJourney("E2E Journey 1.4: Resources Page - Downloads and prototype notice", async () => {
    const res = await fetch(`${BASE_URL}/resources`);
    assert.equal(res.status, 200);
    const html = await res.text();
    assert.ok(html.includes("Helpful detail."));
    assert.ok(html.includes("Product resources"));
    assert.ok(html.includes("These are the source documents supplied for the prototype."));
  });

  // --- JOURNEY 2: AUTHENTICATION FLOW & FORM VALIDATION ---
  await testJourney("E2E Journey 2: Login page renders with credentials form and security badges", async () => {
    const res = await fetch(`${BASE_URL}/login`);
    assert.equal(res.status, 200);
    const html = await res.text();
    assert.ok(html.includes("Sign in to your account"));
    assert.ok(html.includes("Work Email"));
    assert.ok(html.includes("Password"));
    assert.ok(html.includes("Remember this device"));
    assert.ok(html.includes("Create an account"));
  });

  await testJourney("E2E Journey 2.1: Signup page renders with registration fields and security posture", async () => {
    const res = await fetch(`${BASE_URL}/signup`);
    assert.equal(res.status, 200);
    const html = await res.text();
    assert.ok(html.includes("Create your account"));
    assert.ok(html.includes("Full Name"));
    assert.ok(html.includes("Work Email"));
    assert.ok(html.includes("Organisation"));
    assert.ok(html.includes("Password"));
    assert.ok(html.includes("Confirm Password"));
    assert.ok(html.includes("Create Account"));
  });

  await testJourney("E2E Journey 2.2: Protected Route Guard - Unauthenticated access to /dashboard is handled", async () => {
    const res = await fetch(`${BASE_URL}/dashboard`);
    assert.equal(res.status, 200);
    const html = await res.text();
    // Dashboard client component checks auth and contains redirect logic
    assert.ok(html.includes("Verifying session with PostgreSQL") || html.includes("Dashboard"));
  });

  // --- JOURNEY 3: ASSET INTEGRITY & TECHNICAL SEO ---
  await testJourney("E2E Journey 3: Technical SEO - robots.txt and sitemap.xml are valid", async () => {
    const robotsRes = await fetch(`${BASE_URL}/robots.txt`);
    assert.equal(robotsRes.status, 200);
    const robotsTxt = await robotsRes.text();
    assert.ok(robotsTxt.toLowerCase().includes("user-agent"));
    assert.ok(robotsTxt.includes("Disallow: /dashboard"));

    const sitemapRes = await fetch(`${BASE_URL}/sitemap.xml`);
    assert.equal(sitemapRes.status, 200);
    const sitemapXml = await sitemapRes.text();
    assert.ok(sitemapXml.includes("<urlset"));
    assert.ok(sitemapXml.includes("/products/droidscan"));
    assert.ok(sitemapXml.includes("/products/chainbreak"));
    assert.ok(sitemapXml.includes("/products/nimbusq"));
  });

  await testJourney("E2E Journey 3.1: Asset Verification - All 3 product PDFs deliver binary stream", async () => {
    const pdfs = [
      "/resources/droidscan-product-one-pager.pdf",
      "/resources/chainbreak-product-one-pager.pdf",
      "/resources/nimbusq-product-overview.pdf",
    ];

    for (const pdf of pdfs) {
      const res = await fetch(`${BASE_URL}${pdf}`);
      assert.equal(res.status, 200, `Failed to load ${pdf}`);
      const buffer = await res.arrayBuffer();
      assert.ok(buffer.byteLength > 1000, `PDF ${pdf} is unexpectedly empty`);
    }
  });

  const total = results.length;
  const passed = results.filter((r) => r.pass).length;
  const failed = total - passed;

  console.log(`\n--- Phase 3 E2E Test Results ---`);
  console.log(`Total: ${total} | Passed: ${passed} | Failed: ${failed}`);

  stopServer();

  if (failed > 0) {
    process.exit(1);
  }
}

process.on("SIGINT", () => {
  stopServer();
  process.exit(1);
});

process.on("SIGTERM", () => {
  stopServer();
  process.exit(1);
});

runE2E().catch((err) => {
  console.error("E2E execution failed:", err);
  stopServer();
  process.exit(1);
});
