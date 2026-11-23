import { spawn } from "node:child_process";
import assert from "node:assert/strict";

const PORT = 3099;
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
      // Server socket not ready yet
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

    // Wait until server HTTP socket actually responds
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

async function runTests() {
  console.log(`Starting Next.js server for API integration tests on port ${PORT}...`);
  await startServer();
  console.log(`Server ready at ${BASE_URL}. Running tests...\n`);

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

  let ipCounter = 1;
  const getNextIp = () => `10.42.0.${ipCounter++}`;

  // 1. Contact Form API - Valid Submission
  await testCase("POST /api/contact - Valid submission returns 200", async () => {
    const res = await fetch(`${BASE_URL}/api/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-forwarded-for": getNextIp() },
      body: JSON.stringify({
        name: "Security Lead Alice",
        email: "alice@security-testing.com",
        message: "Integration test enquiry regarding DroidScan package analysis.",
        product: "DroidScan",
        honeypot: "",
        formLoadedAt: Date.now() - 3000, // 3 seconds ago to pass velocity check
      }),
    });
    const data = await res.json();
    assert.equal(res.status, 200);
    assert.equal(data.success, true);
  });

  // 2. Contact Form API - Honeypot Bot Stealth Trap
  await testCase("POST /api/contact - Bot submission with honeypot triggers stealth trap (200 without delivery)", async () => {
    const res = await fetch(`${BASE_URL}/api/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-forwarded-for": getNextIp() },
      body: JSON.stringify({
        name: "Spam Bot",
        email: "bot@spam.com",
        message: "Spam payload here",
        honeypot: "http://malicious-link.com",
      }),
    });
    const data = await res.json();
    assert.equal(res.status, 200);
    assert.equal(data.success, true);
    assert.equal(data.message, "Your enquiry has been received.");
  });

  // 3. Contact Form API - Invalid Email Format
  await testCase("POST /api/contact - Invalid email format returns 400", async () => {
    const res = await fetch(`${BASE_URL}/api/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-forwarded-for": getNextIp() },
      body: JSON.stringify({
        name: "Alice",
        email: "invalid-email-no-at",
        product: "WebStrike",
        message: "Message with sufficient length.",
      }),
    });
    assert.equal(res.status, 400);
    const data = await res.json();
    assert.equal(data.error, "Please provide a valid work email address.");
  });

  // 3.1. Contact Form API - Missing Name Returns 400
  await testCase("POST /api/contact - Missing name returns 400", async () => {
    const res = await fetch(`${BASE_URL}/api/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-forwarded-for": getNextIp() },
      body: JSON.stringify({
        name: "",
        email: "alice@valid.com",
        product: "WebStrike",
        message: "Valid message content.",
        formLoadedAt: Date.now() - 3000,
      }),
    });
    assert.equal(res.status, 400);
    const data = await res.json();
    assert.equal(data.error, "Please provide your full name (between 2 and 100 characters).");
  });

  // 3.2. Contact Form API - Name Boundaries (< 2 and > 100 chars) Return 400
  await testCase("POST /api/contact - Name boundary violations return 400", async () => {
    // Too short (< 2)
    const shortRes = await fetch(`${BASE_URL}/api/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-forwarded-for": getNextIp() },
      body: JSON.stringify({
        name: "A",
        email: "alice@valid.com",
        product: "WebStrike",
        message: "Valid message content.",
        formLoadedAt: Date.now() - 3000,
      }),
    });
    assert.equal(shortRes.status, 400);

    // Too long (> 100)
    const longRes = await fetch(`${BASE_URL}/api/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-forwarded-for": getNextIp() },
      body: JSON.stringify({
        name: "A".repeat(101),
        email: "alice@valid.com",
        product: "WebStrike",
        message: "Valid message content.",
        formLoadedAt: Date.now() - 3000,
      }),
    });
    assert.equal(longRes.status, 400);
  });

  // 3.3. Contact Form API - Invalid / Placeholder Product Returns 400
  await testCase("POST /api/contact - Invalid product selection returns 400", async () => {
    // Placeholder option
    const placeholderRes = await fetch(`${BASE_URL}/api/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-forwarded-for": getNextIp() },
      body: JSON.stringify({
        name: "Valid Name",
        email: "alice@valid.com",
        product: "Choose a product",
        message: "Valid message content.",
        formLoadedAt: Date.now() - 3000,
      }),
    });
    assert.equal(placeholderRes.status, 400);
    const placeholderData = await placeholderRes.json();
    assert.equal(placeholderData.error, "Please select a valid product of interest.");

    // Unknown product
    const unknownRes = await fetch(`${BASE_URL}/api/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-forwarded-for": getNextIp() },
      body: JSON.stringify({
        name: "Valid Name",
        email: "alice@valid.com",
        product: "UnknownProduct",
        message: "Valid message content.",
        formLoadedAt: Date.now() - 3000,
      }),
    });
    assert.equal(unknownRes.status, 400);
  });

  // 3.4. Contact Form API - Submission Velocity Bot Detection (< 1800ms)
  await testCase("POST /api/contact - Bot velocity submission (< 1.8s) triggers stealth 200 response", async () => {
    const res = await fetch(`${BASE_URL}/api/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-forwarded-for": getNextIp() },
      body: JSON.stringify({
        name: "Fast Bot Submitter",
        email: "fastbot@spam.com",
        product: "WebStrike",
        message: "Instant automated bot submission.",
        formLoadedAt: Date.now() - 400, // Loaded only 400ms ago
      }),
    });
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.success, true);
    assert.equal(data.message, "Your enquiry has been received.");
  });

  // 3.5. Contact Form API - Live Rate Limiting (6th request returns 429)
  await testCase("POST /api/contact - Rate limit saturation (6th request returns 429 with Retry-After)", async () => {
    const rateLimitIp = "198.51.100.77";
    const payload = {
      name: "Rate Test User",
      email: "ratetest@example.com",
      product: "WebStrike",
      message: "Rate limit test message content.",
      formLoadedAt: Date.now() - 3000,
    };

    // Requests 1 through 5 must succeed (status 200)
    for (let i = 1; i <= 5; i++) {
      const res = await fetch(`${BASE_URL}/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-forwarded-for": rateLimitIp,
        },
        body: JSON.stringify(payload),
      });
      assert.equal(res.status, 200, `Request ${i} should return 200`);
    }

    // Request 6 must be blocked with 429 Too Many Requests
    const limitedRes = await fetch(`${BASE_URL}/api/contact`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-forwarded-for": rateLimitIp,
      },
      body: JSON.stringify(payload),
    });
    assert.equal(limitedRes.status, 429, "6th request must be rate limited");
    assert.equal(limitedRes.headers.get("Retry-After"), "900", "Retry-After header must be 900");
    const limitedData = await limitedRes.json();
    assert.ok(limitedData.error.includes("Too many enquiries submitted"));
  });

  // 3.6. Route Integrity - NimbusQ Redirect to WebStrike
  await testCase("GET /products/nimbusq - Redirects to /products/webstrike", async () => {
    // Manual redirect inspection
    const manualRes = await fetch(`${BASE_URL}/products/nimbusq`, { redirect: "manual" });
    assert.ok([307, 308].includes(manualRes.status), `Expected 307/308 redirect, got ${manualRes.status}`);
    const location = manualRes.headers.get("location");
    assert.ok(location.includes("/products/webstrike"), `Expected location to point to /products/webstrike, got ${location}`);

    // Followed redirect inspection
    const followedRes = await fetch(`${BASE_URL}/products/nimbusq`);
    assert.equal(followedRes.status, 200);
    const html = await followedRes.text();
    assert.ok(html.includes("WebStrike"));
    assert.ok(html.includes("Understand the security"));
  });

  // 4. Contact Form API - Empty Message
  await testCase("POST /api/contact - Missing required message returns 400", async () => {
    const res = await fetch(`${BASE_URL}/api/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-forwarded-for": getNextIp() },
      body: JSON.stringify({
        name: "Alice",
        email: "alice@valid.com",
        message: "",
      }),
    });
    assert.equal(res.status, 400);
  });

  // 5. Auth Register - Missing Required Fields
  await testCase("POST /api/auth/register - Missing fields returns 400", async () => {
    const res = await fetch(`${BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    const data = await res.json();
    assert.equal(res.status, 400);
    assert.equal(data.error, "Full name is required.");
  });

  // 5.1. Auth Register - Invalid Email Format
  await testCase("POST /api/auth/register - Invalid email format returns 400", async () => {
    const res = await fetch(`${BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: "Test User",
        email: "not-an-email",
        password: "StrongPassword#2026",
      }),
    });
    const data = await res.json();
    assert.equal(res.status, 400);
    assert.equal(data.error, "A valid email address is required.");
  });

  // 6. Auth Register - Password Policy Rejection (short password)
  await testCase("POST /api/auth/register - Short password returns 400", async () => {
    const res = await fetch(`${BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: "Test User",
        email: "test@company.com",
        password: "short",
      }),
    });
    const data = await res.json();
    assert.equal(res.status, 400);
    assert.equal(data.error, "Password must be at least 10 characters long.");
  });

  // 7. Auth Register - Password Complexity Rejection (no numbers/symbols)
  await testCase("POST /api/auth/register - Simple password returns 400 complexity error", async () => {
    const res = await fetch(`${BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: "Test User",
        email: "test@company.com",
        password: "LongPasswordWithoutAnyNumbers",
      }),
    });
    const data = await res.json();
    assert.equal(res.status, 400);
    assert.ok(data.error.includes("Password must contain uppercase, lowercase, a number, and a special character."));
  });

  // 8. Auth Login - Missing Credentials
  await testCase("POST /api/auth/login - Empty credentials returns 400", async () => {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "", password: "" }),
    });
    const data = await res.json();
    assert.equal(res.status, 400);
    assert.equal(data.error, "Email and password are required.");
  });

  // 8.1. Auth Login - Missing Password (Only Email Provided)
  await testCase("POST /api/auth/login - Missing password returns 400", async () => {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "user@company.com", password: "" }),
    });
    const data = await res.json();
    assert.equal(res.status, 400);
    assert.equal(data.error, "Email and password are required.");
  });

  // 8.2. Auth Login - Missing Email (Only Password Provided)
  await testCase("POST /api/auth/login - Missing email returns 400", async () => {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "", password: "SomePassword#123" }),
    });
    const data = await res.json();
    assert.equal(res.status, 400);
    assert.equal(data.error, "Email and password are required.");
  });

  // 9. Auth Me - Unauthenticated Access
  await testCase("GET /api/auth/me - Unauthenticated request returns 401", async () => {
    const res = await fetch(`${BASE_URL}/api/auth/me`);
    const data = await res.json();
    assert.equal(res.status, 401);
    assert.equal(data.authenticated, false);
    assert.equal(data.user, null);
  });

  // 10. Auth Logout - Successful Session Cleanup
  await testCase("POST /api/auth/logout - Logout returns 200 with success status", async () => {
    const res = await fetch(`${BASE_URL}/api/auth/logout`, {
      method: "POST",
    });
    const data = await res.json();
    assert.equal(res.status, 200);
    assert.equal(data.success, true);
  });

  // 11. Static PDF Asset Downloads - DroidScan One-Pager
  await testCase("GET /resources/droidscan-product-one-pager.pdf - Returns 200 with PDF content", async () => {
    const res = await fetch(`${BASE_URL}/resources/droidscan-product-one-pager.pdf`);
    assert.equal(res.status, 200);
    assert.ok(res.ok);
  });

  // 12. Static PDF Asset Downloads - ChainBreak One-Pager
  await testCase("GET /resources/chainbreak-product-one-pager.pdf - Returns 200 with PDF content", async () => {
    const res = await fetch(`${BASE_URL}/resources/chainbreak-product-one-pager.pdf`);
    assert.equal(res.status, 200);
    assert.ok(res.ok);
  });

  // 13. Static PDF Asset Downloads - WebStrike One-Pager
  await testCase("GET /resources/webstrike-product-one-pager.pdf - Returns 200 with PDF content", async () => {
    const res = await fetch(`${BASE_URL}/resources/webstrike-product-one-pager.pdf`);
    assert.equal(res.status, 200);
    assert.ok(res.ok);
    const buf = await res.arrayBuffer();
    assert.ok(buf.byteLength > 100000, `Expected WebStrike PDF size > 100KB, got ${buf.byteLength}`);
  });

  const total = results.length;
  const passed = results.filter((r) => r.pass).length;
  const failed = total - passed;

  console.log(`\n--- Integration Test Results ---`);
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

runTests().catch((err) => {
  console.error("Test execution failed:", err);
  stopServer();
  process.exit(1);
});
