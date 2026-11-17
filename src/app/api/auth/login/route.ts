import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import {
  verifyPassword,
  createSessionAndToken,
  AUTH_COOKIE_NAME,
  SESSION_DURATION_SECONDS,
} from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    const trimmedEmail = (email || "").trim().toLowerCase();
    if (!trimmedEmail || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    // Lookup user in PostgreSQL
    const user = await prisma.user.findUnique({
      where: { email: trimmedEmail },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    // Verify password hash
    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    // Create new JWT and persist session in PostgreSQL
    const userAgent = req.headers.get("user-agent") || undefined;
    const { token } = await createSessionAndToken(user.id, userAgent);

    // Set HTTP-Only Cookie
    const cookieStore = await cookies();
    cookieStore.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_DURATION_SECONDS,
    });

    return NextResponse.json({
      success: true,
      message: "Signed in successfully.",
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        organisation: user.organisation,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error: unknown) {
    console.error("Login error:", error);
    const message =
      error instanceof Error && error.message.includes("Can't reach database server")
        ? "Database connection unavailable. Ensure PostgreSQL is running via Docker or local service."
        : "An unexpected error occurred during sign in.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}

