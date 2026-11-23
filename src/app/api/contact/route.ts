import { NextRequest, NextResponse } from "next/server";
import { siteConfig } from "@/config/site";

// Simple in-memory sliding window rate limiter
// Intent: Prevent rapid automated flooding without introducing external Redis dependency
interface RateLimitEntry {
  count: number;
  firstRequest: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS = 5;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry) {
    rateLimitMap.set(ip, { count: 1, firstRequest: now });
    return false;
  }

  if (now - entry.firstRequest > WINDOW_MS) {
    rateLimitMap.set(ip, { count: 1, firstRequest: now });
    return false;
  }

  if (entry.count >= MAX_REQUESTS) {
    return true;
  }

  entry.count += 1;
  return false;
}

const VALID_PRODUCTS = [
  "Choose a product",
  "DroidScan",
  "ChainBreak",
  "WebStrike",
  "NimbusQ",
  "Multiple products",
  "General enquiry",
];

/**
 * Contact Submission Route Handler
 * Intent: Securely validate and process customer enquiries on the server.
 * Assumptions:
 * - Recipient email (Pramod.Prabhakar@everence.io) is confidential and never exposed to the client.
 * - Honeypot and submission timing are evaluated before any processing.
 */
export async function POST(req: NextRequest) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "127.0.0.1";

    // Ordering Rule: Must check rate limiting before processing payload
    if (isRateLimited(ip)) {
      return NextResponse.json(
        {
          error:
            "Too many enquiries submitted from this network. Please wait a few minutes before trying again.",
        },
        { status: 429, headers: { "Retry-After": "900" } }
      );
    }

    const body = await req.json();
    const {
      name,
      email,
      organisation,
      product,
      message,
      honeypot,
      formLoadedAt,
    } = body;

    // Spam Defense 1: Honeypot trap
    // If the hidden honeypot field is filled, silently succeed so spammers cannot calibrate
    if (honeypot && String(honeypot).trim() !== "") {
      return NextResponse.json({
        success: true,
        message: "Your enquiry has been received.",
      });
    }

    // Spam Defense 2: Submission velocity check
    // Real humans take at least 1.8 seconds to fill and submit the enquiry form
    const now = Date.now();
    if (formLoadedAt && typeof formLoadedAt === "number") {
      const elapsed = now - formLoadedAt;
      if (elapsed < 1800) {
        return NextResponse.json({
          success: true,
          message: "Your enquiry has been received.",
        });
      }
    }

    // Server-Side Input Validation
    const trimmedName = typeof name === "string" ? name.trim() : "";
    if (!trimmedName || trimmedName.length < 2 || trimmedName.length > 100) {
      return NextResponse.json(
        { error: "Please provide your full name (between 2 and 100 characters)." },
        { status: 400 }
      );
    }

    const trimmedEmail = typeof email === "string" ? email.trim() : "";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmedEmail || !emailRegex.test(trimmedEmail) || trimmedEmail.length > 254) {
      return NextResponse.json(
        { error: "Please provide a valid work email address." },
        { status: 400 }
      );
    }

    if (
      !product ||
      !VALID_PRODUCTS.includes(product) ||
      product === "Choose a product"
    ) {
      return NextResponse.json(
        { error: "Please select a valid product of interest." },
        { status: 400 }
      );
    }

    const trimmedOrg = typeof organisation === "string" ? organisation.trim().slice(0, 100) : "";
    const trimmedMessage = typeof message === "string" ? message.trim().slice(0, 3000) : "";

    // Server-side delivery target (never exposed in client bundle)
    const recipientEmail =
      process.env.CONTACT_RECIPIENT_EMAIL || siteConfig.contact.email;

    // Intent: Log receipt with UTC timestamp without leaking sensitive data
    console.log(
      `[CONTACT_SUBMISSION] Timestamp: ${new Date().toISOString()} | Target: ${recipientEmail} | Product: ${product} | Org: ${trimmedOrg || "N/A"}`
    );

    return NextResponse.json({
      success: true,
      message:
        "Thank you for contacting Everence SecuraApps. Your enquiry has been received and our team will get in touch with you shortly.",
    });
  } catch (error) {
    console.error("[CONTACT_SUBMISSION_ERROR]", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while processing your request. Please try again later." },
      { status: 500 }
    );
  }
}

