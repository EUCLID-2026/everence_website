import Image from "next/image";
import Link from "next/link";
import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "WebStrike | Website Defence & Threat Intelligence | Everence SecuraApps",
  description:
    "Understand the security behind every website you own. WebStrike turns complex vulnerability tests, uptime tracking, and visual alterations into one clear security scorecard.",
};

const featureList = [
  {
    title: "Phishing Website Detection",
    badge: "PHISHING",
    description:
      "Finds lookalike domains using permutations and homoglyphs. Checks SSL, page content and login forms, with visual-clone detection to flag impersonation.",
    highlight: "Spot brand impersonation before users are deceived.",
  },
  {
    title: "Perimeter & Port Reconnaissance",
    badge: "PORT SCAN",
    description:
      "Multi-threaded Nmap scans map open, filtered, and closed TCP/UDP ports. Extracts service banners and version info, flagging potentially exploitable entry points.",
    highlight: "Close backdoors before attackers find them.",
  },
  {
    title: "Misconfiguration Audit",
    badge: "MISCONFIG",
    description:
      "Audits 15+ HTTP headers (HSTS, CSP, CORS), SSL/TLS certificate health, open directory exposure, website crawling, and default credential testing in a single pass.",
    highlight: "Eliminate configuration gaps instantly.",
  },
  {
    title: "Always-On Downtime Sentinel",
    badge: "DOWNTIME",
    description:
      "High-frequency HTTP/HTTPS polling tracks availability and response latency, recording exact incident timestamps. Email alerts fire the moment any polled asset goes down.",
    highlight: "Know your site is down before customers do.",
  },
  {
    title: "Live Command Dashboard",
    badge: "DASHBOARD",
    description:
      "WebSocket event bus streams real-time scan telemetry, critical alert feeds, and threat radar charts into a single-pane executive command center with zero polling latency.",
    highlight: "Your entire fleet visible at a glance.",
  },
  {
    title: "One-Click Executive Reports",
    badge: "REPORTS",
    description:
      "Converts raw scanner findings into a board-ready PDF with letter grades (A to F), CVSS severity scores, a visual findings matrix, and plain-language remediation steps.",
    highlight: "Presentation-ready evidence in a single click.",
  },
];

const audiences = [
  "Business Owners",
  "IT & DevOps Teams",
  "Security & SecOps",
  "E-Commerce Brands",
  "Compliance Auditors",
  "Agencies & MSPs",
];

const workflowSteps = [
  {
    step: "STEP 01 · INPUT",
    title: "Add Website Asset",
    description: "Enter a domain or URL. No software or code changes required.",
  },
  {
    step: "STEP 02 · DISCOVERY",
    title: "Automated Deep Audit",
    description: "Checks headers, ports, SSL health, and captures certified snapshots.",
  },
  {
    step: "STEP 03 · SENTINEL",
    title: "24/7 Active Watchdog",
    description: "Sentinels watch for defacement, outages, and newly exposed risks.",
  },
  {
    step: "STEP 04 · OUTCOME",
    title: "Executive Report",
    description: "Instant email alerts, plus on-demand PDF audit report export.",
  },
];

export default function WebStrikePage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col selection:bg-[#FF6700] selection:text-white font-sans">
      <Header />

      <main className="flex-1">
        {/* 1. HERO SECTION with tunnel.png background */}
        <section className="relative overflow-hidden bg-white text-slate-900 pt-14 pb-16 md:pt-20 md:pb-24 px-4 sm:px-6 border-b border-slate-200">
          <div className="absolute inset-0 z-0 pointer-events-none">
            <Image
              src="/assets/tunnel.png"
              alt="Everence Tunnel"
              fill
              priority
              className="object-cover object-center opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-white/40 lg:via-white/70"></div>
          </div>

          <div className="relative z-10 mx-auto max-w-7xl">
            {/* Breadcrumb */}
            <div className="text-xs text-slate-500 mb-6">
              <Link href="/" className="hover:text-[#FF6700] transition-colors">
                Home
              </Link>
              <span className="mx-1.5 text-slate-400">/</span>
              <Link href="/#products" className="hover:text-[#FF6700] transition-colors">
                Products
              </Link>
              <span className="mx-1.5 text-slate-400">/</span>
              <span className="text-slate-900 font-medium">WebStrike</span>
            </div>

            {/* Eyebrow */}
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#FF6700]">
              <span>—</span>
              <span>WEBSITE DEFENCE · THREAT INTELLIGENCE</span>
            </div>

            {/* Main Heading */}
            <h1 className="mt-4 text-4xl sm:text-6xl font-bold tracking-tight text-slate-900 leading-tight">
              Understand the security <br />
              behind every website you own.
            </h1>

            {/* Subtitle */}
            <p className="mt-4 text-[15px] sm:text-[16px] text-slate-700 max-w-2xl leading-relaxed">
              WebStrike turns complex vulnerability tests, uptime tracking, and visual alterations into one clear security scorecard — 24/7 defacement sentinel, perimeter audit, real-time alerts, and professional executive reports. No agents. No disruption. No guesswork.
            </p>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/#contact"
                className="inline-flex items-center gap-1.5 rounded-full bg-[#FF6700] hover:bg-[#e65c00] text-white font-semibold px-6 py-3 text-[14px] sm:text-[15px] shadow-[1.5px_1.5px_3px_rgba(174,174,192,0.30)] transition-all"
              >
                Request a walkthrough
                <span>↗</span>
              </Link>
              <a
                href="/resources/webstrike-product-one-pager.pdf"
                download
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 hover:border-slate-500 bg-white/80 hover:bg-white text-slate-900 font-semibold px-6 py-3 text-[14px] sm:text-[15px] shadow-sm transition-colors backdrop-blur-sm"
              >
                Download product one-pager
                <span>↓</span>
              </a>
            </div>
          </div>
        </section>

        {/* 2. FEATURES & AUDIENCE SIDEBAR */}
        <section className="bg-white py-16 md:py-24 px-4 sm:px-6 border-b border-slate-200/80">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              {/* Left Column: What We Solve & 6 Cards */}
              <div className="lg:col-span-8 space-y-10">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#FF6700]">
                    <span>—</span>
                    <span>WHAT WE SOLVE</span>
                  </div>
                  <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 leading-tight">
                    Catch website threats <br />
                    before they turn into breaches.
                  </h2>
                  <p className="mt-4 text-[15px] sm:text-[16px] text-slate-600 leading-relaxed max-w-2xl">
                    From hidden vulnerabilities to real-time threat intelligence. Continuous checks catch certificate and config drift as it happens, closing the 365-day blind spots with graded, plain-language scorecards leadership can act on.
                  </p>
                </div>

                {/* 6 Feature Cards (2x3 Grid) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {featureList.map((item, idx) => (
                    <div
                      key={idx}
                      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#FF6700] bg-[#FF6700]/10 px-2.5 py-0.5 rounded-full">
                            {item.badge}
                          </span>
                        </div>
                        <h3 className="text-[16px] sm:text-[18px] font-bold text-slate-900">{item.title}</h3>
                        <p className="mt-2 text-[13px] sm:text-[14px] text-slate-600 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                      <div className="mt-4 pt-3 border-t border-slate-100 text-xs font-semibold text-[#FF6700]">
                        → {item.highlight}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Orange Callout Box */}
                <div className="rounded-2xl border border-[#FF6700]/30 bg-[#FF6700]/10 p-5 text-[13px] sm:text-[14px] text-slate-800 leading-relaxed shadow-sm">
                  Product information on this page is based on the supplied WebStrike product documentation. Confirm deployment details, data sources, supported integrations and product availability with the SecuraApps team.
                </div>
              </div>

              {/* Right Column: Sticky Sidebar Card */}
              <div className="lg:col-span-4 rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sticky top-28 space-y-6">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#FF6700]">
                    <span>—</span>
                    <span>BUILT FOR</span>
                  </div>
                  <h3 className="mt-2 text-[16px] sm:text-[18px] font-bold text-slate-900">
                    Teams protecting digital trust for a living.
                  </h3>
                  <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                    WebStrike serves any organisation that manages, owns, or is responsible for public-facing web infrastructure.
                  </p>
                </div>

                {/* Audience list */}
                <ul className="space-y-2.5 border-t border-slate-100 pt-4">
                  {audiences.map((aud, idx) => (
                    <li
                      key={idx}
                      className="flex items-center justify-between text-[13px] sm:text-[14px] text-slate-700 py-1 border-b border-slate-50 last:border-b-0"
                    >
                      <span>{aud}</span>
                      <span className="text-[#FF6700] text-[13px]">↗</span>
                    </li>
                  ))}
                </ul>

                {/* Explore WebStrike CTA Box */}
                <div className="border-t border-slate-100 pt-6 space-y-3">
                  <h4 className="text-[16px] sm:text-[18px] font-bold text-slate-900">Explore WebStrike</h4>
                  <p className="text-[13px] sm:text-[14px] text-slate-500">
                    Bring us a domain — see the full audit and watchdog workflow end to end.
                  </p>
                  <Link
                    href="/#contact"
                    className="flex items-center justify-center gap-1.5 w-full rounded-full bg-[#FF6700] hover:bg-[#e65c00] text-white font-semibold py-3 text-[14px] sm:text-[15px] text-center shadow-[1.5px_1.5px_3px_rgba(174,174,192,0.30)] transition-all"
                  >
                    Request a walkthrough
                    <span>↗</span>
                  </Link>
                  <div className="pt-2 text-center">
                    <a
                      href="/resources/webstrike-product-one-pager.pdf"
                      download
                      className="inline-flex items-center justify-between w-full text-[13px] sm:text-[14px] font-medium text-slate-700 hover:text-[#FF6700] transition-colors"
                    >
                      <span>Product one-pager PDF</span>
                      <span>↓</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. HOW IT WORKS SECTION */}
        <section className="bg-white py-16 md:py-24 px-4 sm:px-6 border-b border-slate-200/80">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#FF6700]">
                <span>—</span>
                <span>HOW IT WORKS</span>
              </div>
              <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 leading-tight">
                One website in. <br />
                A professional security report out.
              </h2>
            </div>

            {/* 4 Cards in a row */}
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {workflowSteps.map((stepItem, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <div className="font-mono text-xs font-semibold text-[#FF6700] uppercase">
                    {stepItem.step}
                  </div>
                  <h3 className="mt-2 text-[16px] sm:text-[18px] font-bold text-slate-900">
                    {stepItem.title}
                  </h3>
                  <p className="mt-2 text-[13px] sm:text-[14px] text-slate-600 leading-relaxed">
                    {stepItem.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. BOTTOM CALL-TO-ACTION CARD */}
        <section className="bg-[#f8fafc] py-16 md:py-24 px-4 sm:px-6 border-b border-slate-200/80">
          <div className="mx-auto max-w-7xl">
            <div className="rounded-3xl bg-[#FF6700] text-white p-8 sm:p-12 md:p-16 shadow-xl border border-[#ff8438] flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
              <div className="max-w-2xl space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-white/90">
                  <span>—</span>
                  <span>NEXT STEP</span>
                </div>
                <h3 className="text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
                  Let&apos;s explore what this <br className="hidden sm:inline" />
                  could unlock for your organisation.
                </h3>
                <p className="text-[13px] sm:text-[14px] text-white/90 leading-relaxed">
                  Bring us a domain — see the full audit and watchdog workflow end to end.
                </p>
              </div>

              <div className="shrink-0">
                <Link
                  href="/#contact"
                  className="inline-flex items-center gap-1.5 rounded-full bg-white hover:bg-slate-100 text-[#FF6700] font-semibold px-7 py-3 text-[14px] sm:text-[15px] shadow-[1.5px_1.5px_3px_rgba(0,0,0,0.15)] transition-all"
                >
                  Request a Walkthrough
                  <span>↗</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
