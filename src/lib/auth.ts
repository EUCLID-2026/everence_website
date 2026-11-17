import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import prisma from "@/lib/prisma";

export const AUTH_COOKIE_NAME = "everance_session";
export const SESSION_DURATION_SECONDS = 7 * 24 * 60 * 60; // 7 days

const JWT_SECRET = process.env.JWT_SECRET || "everance-securaapps-default-jwt-secret-key-change-in-prod";
const secretKey = new TextEncoder().encode(JWT_SECRET);

export interface TokenPayload {
  userId: string;
  jti: string;
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  fullName: string;
  organisation: string | null;
  role: string;
  createdAt: Date;
}

/**
 * Hash a plain text password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

/**
 * Compare plain text password against hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Create a SHA-256 hash of a JWT for secure database tracking
 */
export function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

/**
 * Create a new signed JWT and persist its session record in PostgreSQL
 */
export async function createSessionAndToken(
  userId: string,
  userAgent?: string
): Promise<{ token: string; expiresAt: Date; sessionId: string }> {
  const sessionId = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + SESSION_DURATION_SECONDS * 1000);

  // Sign JWT with HS256
  const token = await new SignJWT({ userId, jti: sessionId })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(userId)
    .setJti(sessionId)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(secretKey);

  const tokenHash = hashToken(token);

  // Store JWT session in PostgreSQL via Prisma
  await prisma.jwtSession.create({
    data: {
      id: sessionId,
      userId,
      tokenHash,
      expiresAt,
      revoked: false,
      userAgent: userAgent || null,
    },
  });

  return { token, expiresAt, sessionId };
}

/**
 * Verify JWT signature and validate that its session is active in PostgreSQL
 */
export async function verifyTokenAndSession(
  token: string
): Promise<{ user: AuthenticatedUser; sessionId: string } | null> {
  try {
    // 1. Verify cryptographic JWT signature and expiration
    const { payload } = await jwtVerify(token, secretKey);
    const userId = payload.sub || (payload.userId as string);
    const sessionId = payload.jti;

    if (!userId || !sessionId) {
      return null;
    }

    // 2. Verify active session in PostgreSQL
    const session = await prisma.jwtSession.findUnique({
      where: { id: sessionId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
            organisation: true,
            role: true,
            createdAt: true,
          },
        },
      },
    });

    if (!session || session.revoked || session.expiresAt < new Date()) {
      return null;
    }

    // 3. Verify token hash matches
    const tokenHash = hashToken(token);
    if (session.tokenHash !== tokenHash) {
      return null;
    }

    return {
      user: session.user,
      sessionId: session.id,
    };
  } catch {
    return null;
  }
}

/**
 * Revoke a session in PostgreSQL
 */
export async function revokeSession(token: string): Promise<boolean> {
  try {
    const { payload } = await jwtVerify(token, secretKey);
    const sessionId = payload.jti;

    if (!sessionId) return false;

    await prisma.jwtSession.updateMany({
      where: { id: sessionId },
      data: { revoked: true },
    });

    return true;
  } catch {
    return false;
  }
}

