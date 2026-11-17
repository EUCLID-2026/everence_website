import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col justify-between bg-slate-50 text-slate-900 selection:bg-[#FF6700] selection:text-white font-sans">
      {/* Top Header Bar */}
      <header className="border-b border-slate-200 bg-white px-6 py-4 shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-3 transition-opacity hover:opacity-90"
            aria-label="Everence SecuraApps Home"
          >
            <div className="relative h-10 w-36 sm:w-44">
              <Image
                src="/assets/everence-securaapps-logo.png"
                alt="Everence SecuraApps"
                fill
                className="object-contain object-left"
                priority
              />
            </div>
          </Link>

          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span className="hidden sm:inline-block">
              A development unit of{" "}
              <a
                href="https://www.everence.io/explore"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#FF6700] font-medium hover:underline"
              >
                Everence ↗
              </a>
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-[11px] font-medium text-slate-700">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
              Secured TLS
            </span>
          </div>
        </div>
      </header>

      {/* Main Authentication Card Container */}
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {children}
        </div>
      </main>

      {/* Shared Auth Footer */}
      <footer className="border-t border-slate-200 bg-white px-6 py-6 text-center text-xs text-slate-500">
        <p>
          &copy; {new Date().getFullYear()} Everence SecuraApps. All rights reserved.
        </p>
        <p className="mt-1 text-[11px] text-slate-400">
          Security intelligence, engineered for application, blockchain, and cloud resilience.
        </p>
      </footer>
    </div>
  );
}
