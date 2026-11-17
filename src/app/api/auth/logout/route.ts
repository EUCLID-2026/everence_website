import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { revokeSession, AUTH_COOKIE_NAME } from "@/lib/auth";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

    if (token) {
      await revokeSession(token);
    }

    // Clear session cookie
    cookieStore.delete(AUTH_COOKIE_NAME);

    return NextResponse.json({
      success: true,
      message: "Logged out successfully.",
    });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred during logout." },
      { status: 500 }
    );
  }
}

