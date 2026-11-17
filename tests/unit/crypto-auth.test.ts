import test from "node:test";
import assert from "node:assert/strict";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { SignJWT, jwtVerify } from "jose";

const TEST_SECRET = new TextEncoder().encode("test-secret-key-32-chars-long-minimum-jwt");

test("bcrypt hashes password with salt and verifies matches", async () => {
  const plain = "SecuraApps#2026!";
  const hash = await bcrypt.hash(plain, 10);

  // Hash must not match plain text
  assert.notEqual(hash, plain);
  assert.ok(hash.startsWith("$2a$") || hash.startsWith("$2b$"));

  // Verify correct password matches
  const match = await bcrypt.compare(plain, hash);
  assert.equal(match, true);

  // Verify incorrect password fails
  const mismatch = await bcrypt.compare("WrongPassword#123", hash);
  assert.equal(mismatch, false);
});

test("hashToken generates consistent SHA-256 hash", () => {
  const token = "header.payload.signature-test-token";
  const hash1 = crypto.createHash("sha256").update(token).digest("hex");
  const hash2 = crypto.createHash("sha256").update(token).digest("hex");

  assert.equal(hash1, hash2);
  assert.equal(hash1.length, 64); // 256 bits = 64 hex chars
});

test("jose signs and validates JWT with payload and expiration", async () => {
  const userId = "user-1234-uuid";
  const jti = "session-5678-uuid";

  // Sign JWT
  const token = await new SignJWT({ userId, jti })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(userId)
    .setJti(jti)
    .setIssuedAt()
    .setExpirationTime("2h")
    .sign(TEST_SECRET);

  assert.ok(typeof token === "string");
  assert.equal(token.split(".").length, 3);

  // Verify JWT
  const { payload } = await jwtVerify(token, TEST_SECRET);
  assert.equal(payload.sub, userId);
  assert.equal(payload.jti, jti);
  assert.equal(payload.userId, userId);
});

test("jose rejects tampered JWT signature", async () => {
  const token = await new SignJWT({ userId: "user-1" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(TEST_SECRET);

  const parts = token.split(".");
  // Tamper with payload
  const tamperedToken = `${parts[0]}.${parts[1]}tampered.${parts[2]}`;

  await assert.rejects(async () => {
    await jwtVerify(tamperedToken, TEST_SECRET);
  });
});

test("jose rejects expired JWT", async () => {
  // Create token with negative expiration (already expired)
  const expiredToken = await new SignJWT({ userId: "user-1" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt(Math.floor(Date.now() / 1000) - 100)
    .setExpirationTime(Math.floor(Date.now() / 1000) - 10)
    .sign(TEST_SECRET);

  await assert.rejects(async () => {
    await jwtVerify(expiredToken, TEST_SECRET);
  });
});

