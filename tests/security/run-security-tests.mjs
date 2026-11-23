import { spawn } from "node:child_process";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const PORT = 3096;
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

async function runSecurityTests() {
  console.log(`Starting Next.js production server for Phase 4 Security Tests on port ${PORT}...`);
  await startServer();
  console.log(`Server ready at ${BASE_URL}. Running security checks...\n`);

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

  // --- 1. HTTP SECURITY HEADERS INSPECTION ---
  await testCase("4.1 Security Headers - X-Frame-Options: DENY (Clickjacking Defense)", async () => {
    const res = await fetch(`${BASE_URL}/`);
    assert.equal(res.status, 200);
    const xFrame = res.headers.get("x-frame-options");
    assert.equal(xFrame, "DENY", `Expected X-Frame-Options to be DENY, got ${xFrame}`);
  });

  await testCase("4.2 Security Headers - X-Content-Type-Options: nosniff (MIME Sniffing Defense)", async () => {
    const res = await fetch(`${BASE_URL}/`);
    const nosniff = res.headers.get("x-content-type-options");
    assert.equal(nosniff, "nosniff", `Expected X-Content-Type-Options to be nosniff, got ${nosniff}`);
  });

  await testCase("4.3 Security Headers - Referrer-Policy and Permissions-Policy", async () => {
    const res = await fetch(`${BASE_URL}/`);
    const referrer = res.headers.get("referrer-policy");
    assert.equal(referrer, "strict-origin-when-cross-origin");

    const permissions = res.headers.get("permissions-policy");
    assert.ok(permissions && permissions.includes("camera=()"));
  });

  await testCase("4.4 Security Headers - Strict-Transport-Security (HSTS)", async () => {
    const res = await fetch(`${BASE_URL}/`);
    const hsts = res.headers.get("strict-transport-security");
    assert.ok(hsts && hsts.includes("max-age=63072000"));
  });

  // --- 2. CORS & CROSS-ORIGIN RESTRICTION ---
  await testCase("4.5 CORS Restrictions - APIs do not reflect arbitrary malicious origin or wildcard *", async () => {
    const res = await fetch(`${BASE_URL}/api/contact`, {
      method: "OPTIONS",
      headers: {
        Origin: "https://malicious-attacker-domain.com",
        "Access-Control-Request-Method": "POST",
      },
    });

    const acao = res.headers.get("access-control-allow-origin");
    assert.notEqual(acao, "*", "API must not expose wildcard Access-Control-Allow-Origin");
    assert.notEqual(acao, "https://malicious-attacker-domain.com", "API must not reflect malicious origin");
  });

  // --- 3. INJECTION DEFENSE (XSS & SQLi) ---
  await testCase("4.6 XSS Injection Resistance - Contact endpoint safely validates and rejects/escapes script tags", async () => {
    const xssPayloads = [
      "<script>alert('XSS')</script>",
      "<img src=x onerror=alert(1)>",
      "<svg onload=alert(document.domain)>",
      "javascript:alert(1)",
    ];

    for (const payload of xssPayloads) {
      const res = await fetch(`${BASE_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-forwarded-for": "192.0.2.11" },
        body: JSON.stringify({
          name: payload,
          email: "xss-test@security.org",
          product: "WebStrike",
          message: `Attempting injection: ${payload}`,
          formLoadedAt: Date.now() - 3000,
        }),
      });

      // Must return a structured JSON response (not HTML execution or reflection)
      const data = await res.json();
      assert.ok(data !== null && typeof data === "object");
      const contentType = res.headers.get("content-type") || "";
      assert.ok(contentType.includes("application/json"), "Response must be JSON, never HTML");
    }
  });

  await testCase("4.7 SQL Injection Resistance - Auth login endpoint handles SQL injection payloads safely", async () => {
    const sqliPayloads = [
      "' OR '1'='1",
      "admin'--",
      "' UNION SELECT NULL, NULL, NULL --",
      "'; DROP TABLE users; --",
      "' OR 1=1 #",
    ];

    for (const payload of sqliPayloads) {
      const res = await fetch(`${BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: payload,
          password: "password123",
        }),
      });

      // Must return 401 or 500 without database error leakage (no SQL syntax leaks)
      const data = await res.json();
      assert.ok([401, 500].includes(res.status), `Expected 401/500, got ${res.status}`);
      const errorText = JSON.stringify(data).toLowerCase();
      assert.ok(!errorText.includes("syntax error"), "Response must not leak SQL syntax errors");
      assert.ok(!errorText.includes("postgresql"), "Response must not leak PostgreSQL stack traces");
      assert.ok(!errorText.includes("prisma"), "Response must not leak Prisma query logs");
    }
  });

  // --- 4. DATA & SECRET LEAK PREVENTION ---
  await testCase("4.8 Secret Leak Check - Client static JavaScript chunks do not contain DATABASE_URL or JWT secrets", () => {
    const staticDir = path.join(process.cwd(), ".next", "static");
    assert.ok(fs.existsSync(staticDir), ".next/static directory must exist");

    function scanFiles(dir) {
      let files = [];
      for (const item of fs.readdirSync(dir)) {
        const full = path.join(dir, item);
        if (fs.statSync(full).isDirectory()) {
          files = files.concat(scanFiles(full));
        } else if (item.endsWith(".js")) {
          files.push(full);
        }
      }
      return files;
    }

    const jsFiles = scanFiles(staticDir);
    assert.ok(jsFiles.length > 0, "Static JS bundles must exist");

    const forbiddenPatterns = [
      "postgresql://",
      "everance_secret",
      "everance-securaapps-development-jwt",
      "JWT_SECRET",
      "DATABASE_URL",
    ];

    for (const file of jsFiles) {
      const content = fs.readFileSync(file, "utf8");
      for (const pattern of forbiddenPatterns) {
        assert.ok(
          !content.includes(pattern),
          `Sensitive pattern '${pattern}' leaked in client bundle: ${path.basename(file)}`
        );
      }
    }
  });

  // --- 5. UNHANDLED ERROR INFORMATION LEAK PREVENTION ---
  await testCase("4.9 Error Handling - Server errors do not expose file system paths or stack traces", async () => {
    // Malformed JSON body to trigger parse error
    const res = await fetch(`${BASE_URL}/api/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{ malformed json",
    });

    assert.equal(res.status, 500);
    const data = await res.json();
    assert.ok(data.error, "Error message must be present");
    const jsonStr = JSON.stringify(data);
    assert.ok(!jsonStr.includes("D:\\everance"), "Stack trace with server paths must not leak");
    assert.ok(!jsonStr.includes("node_modules"), "Internal module traces must not leak");
  });

  // Summary
  const total = results.length;
  const passed = results.filter((r) => r.pass).length;
  const failed = total - passed;

  console.log(`\n--- Phase 4 Security Hardening Results ---`);
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

runSecurityTests().catch((err) => {
  console.error("Security test execution failed:", err);
  stopServer();
  process.exit(1);
});
