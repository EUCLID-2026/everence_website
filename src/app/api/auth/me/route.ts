import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyTokenAndSession, AUTH_COOKIE_NAME } from "@/lib/auth";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

    if (!token) {
      return NextResponse.json(
        { authenticated: false, user: null },
        { status: 401 }
      );
    }

    const sessionData = await verifyTokenAndSession(token);
    if (!sessionData) {
      return NextResponse.json(
        { authenticated: false, user: null },
        { status: 401 }
      );
    }

    return NextResponse.json({
      authenticated: true,
      user: sessionData.user,
    });
  } catch (error) {
    console.error("Auth check error:", error);
    return NextResponse.json(
      { authenticated: false, user: null },
      { status: 500 }
    );
  }
}

