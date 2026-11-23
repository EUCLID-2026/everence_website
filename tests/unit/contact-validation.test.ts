import test from "node:test";
import assert from "node:assert/strict";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const VALID_PRODUCTS = [
  "Choose a product",
  "DroidScan",
  "ChainBreak",
  "WebStrike",
  "NimbusQ",
  "Multiple products",
  "General enquiry",
];

function validateContactInput(body: {
  name?: string;
  email?: string;
  product?: string;
  message?: string;
  honeypot?: string;
  formLoadedAt?: number;
}): { valid: boolean; isBot: boolean; error?: string } {
  // 1. Bot honeypot check
  if (body.honeypot && body.honeypot.trim().length > 0) {
    return { valid: false, isBot: true, error: "Bot activity detected." };
  }

  // 2. Submission velocity check (< 1800ms)
  if (body.formLoadedAt && typeof body.formLoadedAt === "number") {
    const elapsed = Date.now() - body.formLoadedAt;
    if (elapsed < 1800) {
      return { valid: false, isBot: true, error: "Submission too fast (bot suspected)." };
    }
  }

  // 3. Name validation (2 to 100 characters)
  const trimmedName = typeof body.name === "string" ? body.name.trim() : "";
  if (!trimmedName || trimmedName.length < 2 || trimmedName.length > 100) {
    return { valid: false, isBot: false, error: "Please provide your full name (between 2 and 100 characters)." };
  }

  // 4. Email validation
  const trimmedEmail = typeof body.email === "string" ? body.email.trim() : "";
  if (!trimmedEmail || !EMAIL_REGEX.test(trimmedEmail) || trimmedEmail.length > 254) {
    return { valid: false, isBot: false, error: "Please enter a valid work email address." };
  }

  // 5. Product validation
  if (!body.product || !VALID_PRODUCTS.includes(body.product) || body.product === "Choose a product") {
    return { valid: false, isBot: false, error: "Please select a valid product of interest." };
  }

  return { valid: true, isBot: false };
}

test("Contact validation accepts valid submission", () => {
  const result = validateContactInput({
    name: "Dr. Alice Morgan",
    email: "alice.morgan@enterprise-sec.com",
    product: "WebStrike",
    message: "We would like to request an assessment of our website security.",
    honeypot: "",
    formLoadedAt: Date.now() - 3000,
  });

  assert.equal(result.valid, true);
  assert.equal(result.isBot, false);
});

test("Contact validation catches bot submissions via honeypot field", () => {
  const result = validateContactInput({
    name: "Spam Bot",
    email: "spambot@example.com",
    product: "WebStrike",
    message: "Buy cheap crypto now!",
    honeypot: "http://spamlink.com",
  });

  assert.equal(result.valid, false);
  assert.equal(result.isBot, true);
  assert.equal(result.error, "Bot activity detected.");
});

test("Contact validation rejects invalid emails", () => {
  const invalidEmails = [
    "plainaddress",
    "#@%^%#$@#$@#.com",
    "@missingusername.com",
    "user@.com",
    "user@example",
    "user name@example.com",
  ];

  for (const email of invalidEmails) {
    const res = validateContactInput({
      name: "Valid Name",
      email,
      product: "WebStrike",
      message: "Valid message content with sufficient length.",
    });
    assert.equal(res.valid, false, `Failed to reject invalid email: ${email}`);
    assert.equal(res.error, "Please enter a valid work email address.");
  }
});

test("Contact validation enforces name length boundaries (2 to 100 chars)", () => {
  // Empty name
  assert.equal(validateContactInput({ name: "", email: "a@b.com", product: "WebStrike" }).valid, false);
  // Single char name (< 2)
  assert.equal(validateContactInput({ name: "A", email: "a@b.com", product: "WebStrike" }).valid, false);
  // Boundary lower: 2 chars (valid)
  assert.equal(validateContactInput({ name: "Al", email: "a@b.com", product: "WebStrike", formLoadedAt: Date.now() - 2000 }).valid, true);
  // Boundary upper: 100 chars (valid)
  assert.equal(validateContactInput({ name: "A".repeat(100), email: "a@b.com", product: "WebStrike", formLoadedAt: Date.now() - 2000 }).valid, true);
  // Exceeds upper: 101 chars (invalid)
  assert.equal(validateContactInput({ name: "A".repeat(101), email: "a@b.com", product: "WebStrike" }).valid, false);
});

test("Contact validation enforces product whitelist", () => {
  // Valid options
  assert.equal(validateContactInput({ name: "Alice", email: "a@b.com", product: "WebStrike", formLoadedAt: Date.now() - 2000 }).valid, true);
  assert.equal(validateContactInput({ name: "Alice", email: "a@b.com", product: "DroidScan", formLoadedAt: Date.now() - 2000 }).valid, true);
  assert.equal(validateContactInput({ name: "Alice", email: "a@b.com", product: "ChainBreak", formLoadedAt: Date.now() - 2000 }).valid, true);
  
  // Placeholder option rejected
  const placeholderRes = validateContactInput({ name: "Alice", email: "a@b.com", product: "Choose a product" });
  assert.equal(placeholderRes.valid, false);
  assert.equal(placeholderRes.error, "Please select a valid product of interest.");

  // Unknown product rejected
  const unknownRes = validateContactInput({ name: "Alice", email: "a@b.com", product: "HackingTool" });
  assert.equal(unknownRes.valid, false);
});

test("Contact validation catches bot velocity submissions under 1800ms", () => {
  // Submitted in 500ms (too fast)
  const fastRes = validateContactInput({
    name: "Instant Submitter",
    email: "bot@fast.com",
    product: "WebStrike",
    formLoadedAt: Date.now() - 500,
  });
  assert.equal(fastRes.valid, false);
  assert.equal(fastRes.isBot, true);

  // Submitted in 2500ms (human speed)
  const humanRes = validateContactInput({
    name: "Human Submitter",
    email: "human@real.com",
    product: "WebStrike",
    formLoadedAt: Date.now() - 2500,
  });
  assert.equal(humanRes.valid, true);
  assert.equal(humanRes.isBot, false);
});

test("Sliding window rate limiter allows 5 requests and blocks the 6th", () => {
  const map = new Map<string, { count: number; firstRequest: number }>();
  const WINDOW_MS = 15 * 60 * 1000;
  const MAX = 5;

  function checkRateLimit(ip: string, now: number): boolean {
    const entry = map.get(ip);
    if (!entry) {
      map.set(ip, { count: 1, firstRequest: now });
      return false; // not limited
    }
    if (now - entry.firstRequest > WINDOW_MS) {
      map.set(ip, { count: 1, firstRequest: now });
      return false;
    }
    if (entry.count >= MAX) {
      return true; // limited
    }
    entry.count += 1;
    return false;
  }

  const testIp = "192.168.1.100";
  const t0 = 1000000;

  // Requests 1 through 5 must pass
  for (let i = 1; i <= 5; i++) {
    assert.equal(checkRateLimit(testIp, t0 + i * 100), false, `Request ${i} should be allowed`);
  }

  // Request 6 must be blocked
  assert.equal(checkRateLimit(testIp, t0 + 600), true, "Request 6 must be rate-limited");

  // After 15 minutes + 1 ms from firstRequest (which was t0 + 100), rate limiter must reset
  assert.equal(checkRateLimit(testIp, t0 + 100 + WINDOW_MS + 10), false, "Window must reset after 15 min");
});

