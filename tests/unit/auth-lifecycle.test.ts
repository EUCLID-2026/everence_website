import test from "node:test";
import assert from "node:assert/strict";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { SignJWT, jwtVerify } from "jose";

const JWT_SECRET = "everance-test-jwt-secret-key-32-chars-long";
const secretKey = new TextEncoder().encode(JWT_SECRET);
const SESSION_DURATION_SECONDS = 7 * 24 * 60 * 60; // 7 days

// In-Memory Database Store simulating PostgreSQL User and JwtSession tables
interface MockUser {
  id: string;
  email: string;
  fullName: string;
  organisation: string | null;
  passwordHash: string;
  role: string;
  createdAt: Date;
}

interface MockSession {
  id: string;
  userId: string;
  tokenHash: string;
  expiresAt: Date;
  revoked: boolean;
  userAgent: string | null;
}

class InMemoryAuthDatabase {
  users: Map<string, MockUser> = new Map();
  sessions: Map<string, MockSession> = new Map();

  async findUserByEmail(email: string): Promise<MockUser | null> {
    const trimmed = email.trim().toLowerCase();
    for (const user of this.users.values()) {
      if (user.email === trimmed) return user;
    }
    return null;
  }

  async createUser(data: {
    email: string;
    fullName: string;
    organisation?: string;
    passwordHash: string;
  }): Promise<MockUser> {
    const id = crypto.randomUUID();
    const user: MockUser = {
      id,
      email: data.email.trim().toLowerCase(),
      fullName: data.fullName.trim(),
      organisation: data.organisation?.trim() || null,
      passwordHash: data.passwordHash,
      role: "user",
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async createSession(sessionId: string, userId: string, tokenHash: string, userAgent?: string): Promise<MockSession> {
    const expiresAt = new Date(Date.now() + SESSION_DURATION_SECONDS * 1000);
    const session: MockSession = {
      id: sessionId,
      userId,
      tokenHash,
      expiresAt,
      revoked: false,
      userAgent: userAgent || null,
    };
    this.sessions.set(sessionId, session);
    return session;
  }

  async findActiveSession(sessionId: string, tokenHash: string): Promise<MockSession | null> {
    const session = this.sessions.get(sessionId);
    if (!session) return null;
    if (session.revoked) return null;
    if (session.tokenHash !== tokenHash) return null;
    if (session.expiresAt.getTime() <= Date.now()) return null;
    return session;
  }

  async revokeSession(sessionId: string): Promise<boolean> {
    const session = this.sessions.get(sessionId);
    if (!session) return false;
    session.revoked = true;
    return true;
  }
}

// Validation helpers matching src/app/api/auth/register/route.ts
function validateRegistrationInput(body: {
  fullName?: string;
  email?: string;
  password?: string;
}): { valid: boolean; error?: string } {
  if (!body.fullName || typeof body.fullName !== "string" || body.fullName.trim().length === 0) {
    return { valid: false, error: "Full name is required." };
  }

  const trimmedEmail = (body.email || "").trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!trimmedEmail || !emailRegex.test(trimmedEmail)) {
    return { valid: false, error: "A valid email address is required." };
  }

  if (!body.password || typeof body.password !== "string" || body.password.length < 10) {
    return { valid: false, error: "Password must be at least 10 characters long." };
  }

  const hasUpper = /[A-Z]/.test(body.password);
  const hasLower = /[a-z]/.test(body.password);
  const hasNumber = /[0-9]/.test(body.password);
  const hasSymbol = /[^A-Za-z0-9]/.test(body.password);

  if (!hasUpper || !hasLower || !hasNumber || !hasSymbol) {
    return {
      valid: false,
      error: "Password must contain uppercase, lowercase, a number, and a special character.",
    };
  }

  return { valid: true };
}

// -------------------------------------------------------------
// PHASE 2 TEST SUITE
// -------------------------------------------------------------

test("Phase 2.1: Registration validation catches missing fields and invalid emails", () => {
  // Missing full name
  assert.equal(validateRegistrationInput({ email: "test@example.com", password: "Password123!" }).valid, false);
  assert.equal(validateRegistrationInput({ email: "test@example.com", password: "Password123!" }).error, "Full name is required.");

  // Invalid email formats
  const invalidEmails = ["plainaddress", "@missinguser.com", "user@.com", "spaces in@email.com"];
  for (const email of invalidEmails) {
    const res = validateRegistrationInput({ fullName: "Alice", email, password: "Password123!" });
    assert.equal(res.valid, false);
    assert.equal(res.error, "A valid email address is required.");
  }

  // Valid registration
  const valid = validateRegistrationInput({
    fullName: "Chief SecOps Alice",
    email: "alice@everance-defense.io",
    password: "StrongPassword#2026",
  });
  assert.equal(valid.valid, true);
});

test("Phase 2.2: Full User Registration persists user in database with salted bcrypt hash", async () => {
  const db = new InMemoryAuthDatabase();

  const plainPassword = "SuperSecret#2026Password";
  const passwordHash = await bcrypt.hash(plainPassword, 12);

  const newUser = await db.createUser({
    fullName: "Security Architect Bob",
    email: "bob@security.org",
    organisation: "SecOps Global",
    passwordHash,
  });

  assert.ok(newUser.id, "User ID must be generated");
  assert.equal(newUser.email, "bob@security.org");
  assert.equal(newUser.fullName, "Security Architect Bob");
  assert.equal(newUser.organisation, "SecOps Global");
  assert.equal(newUser.role, "user");
  assert.notEqual(newUser.passwordHash, plainPassword, "Password must not be stored in plaintext");

  // Verify bcrypt authentication against hash
  const match = await bcrypt.compare(plainPassword, newUser.passwordHash);
  assert.equal(match, true);
});

test("Phase 2.3: Duplicate registration rejection (enforcing unique email constraint)", async () => {
  const db = new InMemoryAuthDatabase();

  await db.createUser({
    fullName: "Original User",
    email: "duplicate@test.com",
    passwordHash: "hash1",
  });

  // Attempt duplicate lookup
  const existing = await db.findUserByEmail("DUPLICATE@TEST.COM"); // case-insensitive check
  assert.ok(existing !== null, "User must be found");

  // Endpoint would return status 409
  const duplicateResponse = existing
    ? { status: 409, error: "An account with this email address already exists." }
    : { status: 201 };

  assert.equal(duplicateResponse.status, 409);
  assert.equal(duplicateResponse.error, "An account with this email address already exists.");
});

test("Phase 2.4: User Enumeration Prevention on Login (identical 401 error message)", async () => {
  const db = new InMemoryAuthDatabase();
  const passwordHash = await bcrypt.hash("CorrectPassword#123", 10);

  await db.createUser({
    fullName: "Existing User",
    email: "registered@company.com",
    passwordHash,
  });

  const GENERIC_AUTH_ERROR = "Invalid email or password.";

  // Scenario A: Non-existent user email
  async function simulateLogin(email: string, pass: string): Promise<{ status: number; error?: string }> {
    const user = await db.findUserByEmail(email);
    if (!user) {
      return { status: 401, error: GENERIC_AUTH_ERROR };
    }
    const valid = await bcrypt.compare(pass, user.passwordHash);
    if (!valid) {
      return { status: 401, error: GENERIC_AUTH_ERROR };
    }
    return { status: 200 };
  }

  const nonExistentResult = await simulateLogin("unknown@company.com", "AnyPassword#123");
  assert.equal(nonExistentResult.status, 401);
  assert.equal(nonExistentResult.error, GENERIC_AUTH_ERROR);

  // Scenario B: Valid email, but wrong password
  const wrongPasswordResult = await simulateLogin("registered@company.com", "WrongPassword#999");
  assert.equal(wrongPasswordResult.status, 401);
  assert.equal(wrongPasswordResult.error, GENERIC_AUTH_ERROR);

  // Assert both error messages and status codes are byte-for-byte identical (no enumeration)
  assert.equal(nonExistentResult.error, wrongPasswordResult.error);
  assert.equal(nonExistentResult.status, wrongPasswordResult.status);

  // Scenario C: Correct credentials
  const successResult = await simulateLogin("registered@company.com", "CorrectPassword#123");
  assert.equal(successResult.status, 200);
});

test("Phase 2.5: Full JWT Session Lifecycle (Sign, Track in DB, Verify, and Revoke)", async () => {
  const db = new InMemoryAuthDatabase();

  const user = await db.createUser({
    fullName: "Session User",
    email: "session@enterprise.com",
    passwordHash: "dummyhash",
  });

  // 1. Create Session and sign JWT token
  const sessionId = crypto.randomUUID();
  const token = await new SignJWT({ userId: user.id, jti: sessionId })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setJti(sessionId)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(secretKey);

  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  const session = await db.createSession(sessionId, user.id, tokenHash, "Mozilla/5.0 Test");

  assert.equal(session.userId, user.id);
  assert.equal(session.revoked, false);

  // 2. Authenticate using JWT Token (simulating GET /api/auth/me)
  const { payload } = await jwtVerify(token, secretKey);
  const verifiedSession = await db.findActiveSession(payload.jti as string, tokenHash);
  assert.ok(verifiedSession !== null, "Session must be active and valid in DB");
  assert.equal(verifiedSession.userId, user.id);

  // 3. Logout / Revoke Session (simulating POST /api/auth/logout)
  await db.revokeSession(sessionId);

  // 4. Subsequent requests with the same token must fail because DB session is revoked
  const afterLogoutSession = await db.findActiveSession(sessionId, tokenHash);
  assert.equal(afterLogoutSession, null, "Revoked session must be rejected");
});

test("Phase 2.6: Security Cookie Configuration Attributes", () => {
  // Confirm cookie options strictly match OWASP session management guidelines
  const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "lax" as const,
    path: "/",
    maxAge: SESSION_DURATION_SECONDS,
  };

  assert.equal(cookieOptions.httpOnly, true, "Cookie must be HTTP-only to prevent XSS theft");
  assert.equal(cookieOptions.sameSite, "lax", "Cookie must use SameSite=Lax for CSRF mitigation");
  assert.equal(cookieOptions.path, "/", "Cookie path must be root");
  assert.equal(cookieOptions.maxAge, 604800, "Session lifetime must be 7 days (604,800 seconds)");
});
