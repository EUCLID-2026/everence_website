import test from "node:test";
import assert from "node:assert/strict";

function validatePasswordPolicy(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!password || password.length < 10) {
    errors.push("Password must be at least 10 characters long.");
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter.");
  }
  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter.");
  }
  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain at least one number.");
  }
  if (!/[^A-Za-z0-9]/.test(password)) {
    errors.push("Password must contain at least one special character.");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

test("Password policy accepts strong compliant passwords", () => {
  const res = validatePasswordPolicy("SecuraApps#2026!");
  assert.equal(res.valid, true);
  assert.equal(res.errors.length, 0);
});

test("Password policy rejects passwords under 10 characters", () => {
  const res = validatePasswordPolicy("Short#1a");
  assert.equal(res.valid, false);
  assert.ok(res.errors.includes("Password must be at least 10 characters long."));
});

test("Password policy rejects passwords missing uppercase letters", () => {
  const res = validatePasswordPolicy("alllowercase#1234");
  assert.equal(res.valid, false);
  assert.ok(res.errors.includes("Password must contain at least one uppercase letter."));
});

test("Password policy rejects passwords missing lowercase letters", () => {
  const res = validatePasswordPolicy("ALLUPPERCASE#1234");
  assert.equal(res.valid, false);
  assert.ok(res.errors.includes("Password must contain at least one lowercase letter."));
});

test("Password policy rejects passwords missing numbers", () => {
  const res = validatePasswordPolicy("NoNumbersHere!@#$");
  assert.equal(res.valid, false);
  assert.ok(res.errors.includes("Password must contain at least one number."));
});

test("Password policy rejects passwords missing special characters", () => {
  const res = validatePasswordPolicy("AlphaNumeric12345");
  assert.equal(res.valid, false);
  assert.ok(res.errors.includes("Password must contain at least one special character."));
});

