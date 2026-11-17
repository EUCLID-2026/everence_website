import test from "node:test";
import assert from "node:assert/strict";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateContactInput(body: {
  name?: string;
  email?: string;
  message?: string;
  honeypot?: string;
}): { valid: boolean; isBot: boolean; error?: string } {
  // 1. Bot honeypot check
  if (body.honeypot && body.honeypot.trim().length > 0) {
    return { valid: false, isBot: true, error: "Bot activity detected." };
  }

  // 2. Name validation
  if (!body.name || body.name.trim().length < 2) {
    return { valid: false, isBot: false, error: "Please enter your full name." };
  }

  // 3. Email validation
  const trimmedEmail = (body.email || "").trim();
  if (!trimmedEmail || !EMAIL_REGEX.test(trimmedEmail)) {
    return { valid: false, isBot: false, error: "Please enter a valid work email address." };
  }

  // 4. Message validation
  const trimmedMessage = (body.message || "").trim();
  if (!trimmedMessage || trimmedMessage.length < 10) {
    return { valid: false, isBot: false, error: "Please provide a message with at least 10 characters." };
  }

  if (trimmedMessage.length > 5000) {
    return { valid: false, isBot: false, error: "Message exceeds maximum length of 5000 characters." };
  }

  return { valid: true, isBot: false };
}

test("Contact validation accepts valid submission", () => {
  const result = validateContactInput({
    name: "Dr. Alice Morgan",
    email: "alice.morgan@enterprise-sec.com",
    message: "We would like to request an assessment of our multi-cloud deployment.",
    honeypot: "",
  });

  assert.equal(result.valid, true);
  assert.equal(result.isBot, false);
});

test("Contact validation catches bot submissions via honeypot field", () => {
  const result = validateContactInput({
    name: "Spam Bot",
    email: "spambot@example.com",
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
      message: "Valid message content with sufficient length.",
    });
    assert.equal(res.valid, false, `Failed to reject invalid email: ${email}`);
    assert.equal(res.error, "Please enter a valid work email address.");
  }
});

test("Contact validation rejects too short or too long messages", () => {
  // Too short
  const shortRes = validateContactInput({
    name: "Valid Name",
    email: "user@example.com",
    message: "Hi",
  });
  assert.equal(shortRes.valid, false);
  assert.equal(shortRes.error, "Please provide a message with at least 10 characters.");

  // Too long
  const longRes = validateContactInput({
    name: "Valid Name",
    email: "user@example.com",
    message: "A".repeat(5001),
  });
  assert.equal(longRes.valid, false);
  assert.equal(longRes.error, "Message exceeds maximum length of 5000 characters.");
});

