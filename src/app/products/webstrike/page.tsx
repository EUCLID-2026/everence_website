import Image from "next/image";
import Link from "next/link";
import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "WebStrike | Website & Cloud Security | Everence SecuraApps",
  description:
    "Understand the security behind every website and cloud you own. WebStrike turns website audits, network probing, uptime tracking, phishing detection and cloud posture checks into one clear security scorecard.",
};

const featureList = [
  {
    title: "WebAudit",
    badge: "WEBSECURITY",
    description:
      "Crawls the site, searches directories, and audits security headers, cookies, SSL/TLS certificates and email-spoofing protection. Enumerates subdomains and scans for known vulnerabilities, exposures and default credentials.",
    highlight: "Find the gaps before attackers do.",
  },
  {
    title: "NetProbe",
    badge: "WEBSECURITY",
    description:
      "Multi-threaded port scans maps open, filtered, and closed TCP/UDP ports. Extracts service banners and versions, checks them against known-vulnerability lists, and flags exploitable entry points.",
    highlight: "Close backdoors before attackers find them.",
  },
  {
    title: "Uptime",
    badge: "WEBSECURITY",
    description:
      "High-frequency HTTP/HTTPS polling tracks availability and response latency, recording exact incident timestamps. Email alerts fire when a monitored asset stays down past your set threshold.",
    highlight: "Know your site is down before customers do.",
  },
  {
    title: "PhisOps",
    badge: "PHISHING",
    description:
      "A phishing scanner that detects phishing domains targeting your organisation, so you can act before your customers and staff are caught out.",
    highlight: "Spot the phish before it lands.",
  },
  {
    title: "Cloud Posture Management",
    badge: "CLOUD",
    description:
      "Read-only scans of Azure, AWS and GCP accounts against CIS benchmarks. Builds a cloud bill of materials of every resource checked, with the misconfigurations found and how to fix them.",
    highlight: "Every cloud resource, accounted for.",
  },
  {
    title: "PQC Cloud Readiness",
    badge: "CLOUD",
    description:
      "Audits cloud keys and cryptographic algorithms against NIST post-quantum standards, flagging RSA and ECC to migrate to ML-KEM and ML-DSA before quantum decryption becomes practical.",
    highlight: "Be quantum-ready before it matters.",
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
    title: "Add an Asset",
    description: "Enter a domain or URL, or connect a cloud account with read-only access.",
  },
  {
    step: "STEP 02 · DISCOVERY",
    title: "Automated Deep Audit",
    description: "Audits the web, network, phishing and cloud posture in a single pass.",
  },
  {
    step: "STEP 03 · WATCH",
    title: "Always-On Uptime",
    description: "Uptime monitoring and repeat audits surface outages and newly exposed risks.",
  },
  {
    step: "STEP 04 · OUTCOME",
    title: "Executive Report",
    description: "Email alerts, plus on-demand graded PDF reports.",
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
              className="object-cover object-center opacity-90 animate-tunnel-bg"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-white/40 lg:via-white/70"></div>
            {/* Subtle Cybersecurity Scan Sweep */}
            <div className="absolute inset-x-0 h-28 bg-gradient-to-b from-transparent via-[#FF6700]/[0.05] to-transparent pointer-events-none animate-scan-line"></div>
            {/* Ambient Concentric Sonar Pulse */}
            <div className="hidden md:block absolute right-[12%] top-1/2 -translate-y-1/2 w-96 h-96 pointer-events-none opacity-40">
              <div className="absolute inset-0 rounded-full border border-[#FF6700]/25 sonar-circle-1"></div>
              <div className="absolute inset-0 rounded-full border border-[#FF6700]/25 sonar-circle-2"></div>
              <div className="absolute inset-0 rounded-full border border-[#FF6700]/25 sonar-circle-3"></div>
            </div>
          </div>

          <div className="relative z-10 mx-auto max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-8">
                {/* Breadcrumb */}
                <div className="text-xs text-slate-500 mb-6 animate-hero-1">
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
                <div className="flex items-center gap-2.5 text-xs font-semibold tracking-wider uppercase text-[#FF6700] animate-hero-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF6700] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF6700]"></span>
                  </span>
                  <span>-</span>
                  <span>WEBSITE & CLOUD SECURITY</span>
                </div>

                {/* Main Heading */}
                <h1 className="mt-4 text-4xl sm:text-6xl font-bold tracking-tight text-slate-900 leading-tight animate-hero-3">
                  Understand the security behind <br />
                  every website and <br />
                  cloud you own.
                </h1>

                {/* Subtitle */}
                <p className="mt-4 text-[15px] sm:text-[16px] text-slate-700 max-w-2xl leading-relaxed animate-hero-4">
                  WebStrike turns website audits, network probing, uptime tracking, phishing detection and cloud posture checks into one clear security scorecard - with professional executive reports. No agents to install. Read-only cloud access. No guesswork.
                </p>

                {/* Action Buttons */}
                <div className="mt-8 flex flex-wrap items-center gap-4 animate-hero-5">
                  <Link
                    href="/#contact"
                    className="group inline-flex items-center gap-1.5 rounded-full bg-[#FF6700] hover:bg-[#e65c00] text-white font-semibold px-6 py-3 text-[14px] sm:text-[15px] shadow-[1.5px_1.5px_3px_rgba(174,174,192,0.30)] hover:shadow-[0_4px_18px_rgba(255,103,0,0.32)] transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
                  >
                    Request a walkthrough
                    <span className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>
                  </Link>
                  <a
                    href="/resources/webstrike-product-one-pager.pdf"
                    download
                    className="group inline-flex items-center gap-1.5 rounded-full border border-slate-300 hover:border-slate-500 bg-white/80 hover:bg-white text-slate-900 font-semibold px-6 py-3 text-[14px] sm:text-[15px] shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 backdrop-blur-sm"
                  >
                    Download product one-pager
                    <span className="transition-transform duration-300 group-hover:translate-y-0.5">↓</span>
                  </a>
                </div>
              </div>

              {/* Right Column: Floating Telemetry HUD Card (Desktop) */}
              <div className="hidden lg:flex lg:col-span-4 justify-end animate-hero-5">
                <div className="rounded-3xl border border-slate-200/90 bg-white/85 backdrop-blur-md p-6 shadow-[0_12px_36px_rgba(0,0,0,0.06)] animate-hero-badge w-full max-w-xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                      <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-800">
                        DEFENCE & CLOUD HUD
                      </span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#FF6700]/10 text-[#FF6700] font-semibold border border-[#FF6700]/20">
                      MULTI-CLOUD
                    </span>
                  </div>

                  <div className="space-y-2.5 text-xs">
                    <div className="flex items-center justify-between py-1 border-b border-slate-50 text-slate-600">
                      <span className="text-slate-500">Perimeter Audit</span>
                      <span className="font-mono font-semibold text-slate-900">Port & Config</span>
                    </div>
                    <div className="flex items-center justify-between py-1 border-b border-slate-50 text-slate-600">
                      <span className="text-slate-500">Cloud Posture</span>
                      <span className="font-semibold text-emerald-600">Azure · AWS · GCP</span>
                    </div>
                    <div className="flex items-center justify-between py-1 border-b border-slate-50 text-slate-600">
                      <span className="text-slate-500">Threat Detection</span>
                      <span className="font-mono font-semibold text-slate-900">Phishing Sentinel</span>
                    </div>
                    <div className="flex items-center justify-between py-1 border-b border-slate-50 text-slate-600">
                      <span className="text-slate-500">Quantum Readiness</span>
                      <span className="font-mono font-semibold text-slate-900">NIST PQC Aligned</span>
                    </div>
                    <div className="flex items-center justify-between py-1 text-slate-600">
                      <span className="text-slate-500">Reporting</span>
                      <span className="font-semibold text-[#FF6700]">One-Click PDF (A-F)</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 text-[11px] font-mono text-slate-500 flex items-center justify-between">
                    <span>SECURITY SCORECARD</span>
                    <span className="text-emerald-600 font-semibold">● ACTIVE</span>
                  </div>
                </div>
              </div>
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
                    <span>-</span>
                    <span>WHAT WE SOLVE</span>
                  </div>
                  <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 leading-tight">
                    Catch security gaps <br />
                    before they turn into breaches.
                  </h2>
                  <p className="mt-4 text-[15px] sm:text-[16px] text-slate-600 leading-relaxed max-w-2xl">
                    From website vulnerabilities and phishing domains to cloud posture and post-quantum readiness. Regular checks catch certificate, configuration and exposure drift early, closing the 365-day blind spots with graded, plain-language scorecards leadership can act on.
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

                {/* Across Every Module Banner */}
                <div className="rounded-2xl border border-slate-200 bg-[#F5F5F5] p-4 text-[13px] sm:text-[14px] text-slate-700 font-medium text-center shadow-sm">
                  <span className="font-mono text-xs uppercase tracking-wider text-[#FF6700] font-bold mr-2">Across Every Module</span>
                  Live command dashboard · One-click graded executive reports (A to F) with plain-language fixes
                </div>
              </div>

              {/* Right Column: Sticky Sidebar Card */}
              <div className="lg:col-span-4 rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sticky top-28 space-y-6">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#FF6700]">
                    <span>-</span>
                    <span>BUILT FOR</span>
                  </div>
                  <h3 className="mt-2 text-[16px] sm:text-[18px] font-bold text-slate-900">
                    Teams protecting digital trust for a living.
                  </h3>
                  <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                    WebStrike serves any organisation that manages, owns, or is responsible for public-facing web infrastructure and cloud environments - from single-site startups to enterprise-grade fleets.
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
                    Bring us a domain or a cloud account - see the full audit end to end.
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
                <span>-</span>
                <span>HOW IT WORKS</span>
              </div>
              <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 leading-tight">
                One asset in. <br />
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
                  <span>-</span>
                  <span>NEXT STEP</span>
                </div>
                <h3 className="text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
                  Let&apos;s explore what this <br className="hidden sm:inline" />
                  could unlock for your organisation.
                </h3>
                <p className="text-[13px] sm:text-[14px] text-white/90 leading-relaxed">
                  Bring us a domain or a cloud account - see the full audit end to end.
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
