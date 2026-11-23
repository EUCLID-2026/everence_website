"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { siteConfig } from "@/config/site";

/**
 * Header matching authentic original design:
 * Clean white background, dark slate links, and amber pill CTA button.
 */
export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [mobileMenuOpen]);

  return (
    <>
      {/* Top Banner (White with subtle border) */}
      <div className="bg-[#F6F6F6] border-b border-slate-200 text-xs text-slate-600 py-2 px-4 sm:px-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between flex-wrap gap-2">
          <span className="font-medium text-slate-700">Security products built for the real world</span>
          <a
            href={siteConfig.unitOf.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-semibold text-slate-800 hover:text-[#FF6700] transition-colors"
          >
            {siteConfig.unitOf.label}
            <span className="text-[#FF6700]">↗</span>
          </a>
        </div>
      </div>

      {/* Main Sticky Header */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-[#F6F6F6]/95 backdrop-blur-md transition-all shadow-[0_1.9px_3.8px_rgba(174,174,192,0.30)]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 py-3.5">
          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-[16px] lg:text-[18px] font-medium text-[#000000]" aria-label="Main Navigation">
            {siteConfig.nav.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="transition-colors hover:text-[#FF6700] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6700] rounded px-1 py-0.5"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Action Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/login"
              className="text-[14px] lg:text-[16px] font-semibold text-slate-700 hover:text-[#000000] px-2 py-1 rounded transition-colors"
            >
              Sign In
            </Link>
            <Link
              href={siteConfig.cta.href}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#FF6700] hover:bg-[#e65c00] text-white font-semibold px-6 py-2.5 text-[14px] lg:text-[16px] shadow-[1.5px_1.5px_3px_rgba(174,174,192,0.30)] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6700]"
            >
              {siteConfig.cta.label}
              <span>↗</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden inline-flex items-center justify-center rounded-lg p-2 text-slate-700 hover:bg-slate-100 hover:text-[#FF6700] focus:outline-none ml-auto"
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Slide-Down Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-slate-200 bg-white px-5 py-6 space-y-4 shadow-xl">
            <nav className="flex flex-col space-y-3" aria-label="Mobile Navigation">
              {siteConfig.nav.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-lg px-3 py-2 text-[16px] font-medium text-slate-800 hover:bg-slate-50 hover:text-[#FF6700] transition-colors"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-3 py-2 text-[16px] font-medium text-slate-800 hover:bg-slate-50 hover:text-[#FF6700] transition-colors"
              >
                Sign In
              </Link>
            </nav>
            <div className="pt-2 border-t border-slate-100">
              <Link
                href={siteConfig.cta.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-1.5 w-full text-center rounded-full bg-[#FF6700] px-4 py-2.5 text-[15px] font-semibold text-white shadow hover:bg-[#e65c00]"
              >
                {siteConfig.cta.label} ↗
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
