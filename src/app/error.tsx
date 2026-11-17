"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect } from "react";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Intent: Log non-sensitive error telemetry
    console.error("[APPLICATION_ERROR]", error);
  }, [error]);

  return (
    <div className="relative min-h-screen bg-white text-slate-900 flex flex-col selection:bg-[#FF6700] selection:text-white font-sans">
      <Header />

      <main className="relative flex-1 flex items-center justify-center px-4 py-24 sm:px-6 overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <Image
            src="/assets/tunnel.png"
            alt="Tunnel"
            fill
            className="object-cover object-center opacity-85"
          />
          <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px]"></div>
        </div>

        <div className="relative z-10 max-w-md text-center rounded-3xl border border-slate-200 bg-white/95 p-8 sm:p-10 shadow-2xl text-slate-900 backdrop-blur">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 border border-red-200 text-red-600">
            <AlertTriangle className="h-6 w-6" />
          </div>

          <div className="mt-4 font-mono text-xs uppercase tracking-wider text-red-600">
            500 · Server Processing Issue
          </div>

          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
            Something went wrong
          </h1>

          <p className="mt-3 text-[13px] sm:text-[14px] text-slate-600 leading-relaxed">
            An unexpected error occurred while rendering this view. Our security posture prevents exposing raw stack traces in customer-facing builds.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => reset()}
              className="inline-flex items-center gap-2 rounded-full bg-[#FF6700] hover:bg-[#e65c00] px-5 py-2.5 text-[14px] font-semibold text-white shadow-[1.5px_1.5px_3px_rgba(174,174,192,0.30)] transition-all"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Try again
            </button>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-slate-300 hover:border-slate-500 bg-white/80 hover:bg-white px-5 py-2.5 text-[14px] font-semibold text-slate-900 shadow-sm transition-colors"
            >
              <Home className="h-3.5 w-3.5" />
              Return Home
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

