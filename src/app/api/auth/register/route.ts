import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import {
  hashPassword,
  createSessionAndToken,
  AUTH_COOKIE_NAME,
  SESSION_DURATION_SECONDS,
} from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fullName, email, organisation, password } = body;

    // Validate Full Name
    if (!fullName || typeof fullName !== "string" || fullName.trim().length === 0) {
      return NextResponse.json(
        { error: "Full name is required." },
        { status: 400 }
      );
    }

    // Validate Email
    const trimmedEmail = (email || "").trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmedEmail || !emailRegex.test(trimmedEmail)) {
      return NextResponse.json(
        { error: "A valid email address is required." },
        { status: 400 }
      );
    }

    // Validate Password Policy
    if (!password || typeof password !== "string" || password.length < 10) {
      return NextResponse.json(
        { error: "Password must be at least 10 characters long." },
        { status: 400 }
      );
    }

    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSymbol = /[^A-Za-z0-9]/.test(password);

    if (!hasUpper || !hasLower || !hasNumber || !hasSymbol) {
      return NextResponse.json(
        {
          error:
            "Password must contain uppercase, lowercase, a number, and a special character.",
        },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: trimmedEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email address already exists." },
        { status: 409 }
      );
    }

    // Hash password and store in PostgreSQL
    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        email: trimmedEmail,
        fullName: fullName.trim(),
        organisation: organisation ? organisation.trim() : null,
        passwordHash,
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        organisation: true,
        role: true,
        createdAt: true,
      },
    });

    // Create JWT and store session in PostgreSQL
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

    return NextResponse.json(
      {
        success: true,
        message: "Account created successfully.",
        user,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Registration error:", error);
    const message =
      error instanceof Error && error.message.includes("Can't reach database server")
        ? "Database connection unavailable. Ensure PostgreSQL is running via Docker or local service."
        : "An unexpected error occurred during account registration.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}

