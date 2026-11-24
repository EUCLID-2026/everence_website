import Image from "next/image";
import Link from "next/link";
import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ChainBreak | Bitcoin Wallet Intelligence | Everence SecuraApps",
  description:
    "Understand the behaviour behind every Bitcoin wallet. ChainBreak turns blockchain transaction data into a structured wallet profile - with a searchable ledger, analytics, visual insight and a professional report.",
};

const featureList = [
  {
    title: "Wallet profiling",
    description:
      "Wallet age, first and last observed activity, transaction count, BTC received and sent, observed balance, counterparties and activity status.",
  },
  {
    title: "Transaction ledger",
    description:
      "A chronological transaction-level view with timestamp, inflow/outflow, BTC amount, counterparty and transaction reference.",
  },
  {
    title: "Time-based analysis",
    description:
      "Daily, weekly and monthly activity, frequency, peaks, dormant periods and reactivation patterns.",
  },
  {
    title: "Volume-based analysis",
    description:
      "Total inflow/outflow, average and maximum transaction value, cumulative volume and high-value movements.",
  },
  {
    title: "Graphical representation",
    description:
      "Time-series charts, inflow versus outflow, volume distribution, activity heatmaps and wallet-counterparty relationship graphs.",
  },
  {
    title: "Automated reports",
    description:
      "A report combining wallet profile, statistics, visualisations, key observations and a transaction appendix.",
  },
];

const audiences = [
  "Crypto exchanges",
  "Financial institutions",
  "Compliance and investigation teams",
  "Cybersecurity teams",
  "FinTechs",
  "Researchers",
];

const workflowSteps = [
  {
    step: "01 · INPUT",
    title: "Wallet address",
    description: "Submit a Bitcoin wallet address.",
  },
  {
    step: "02 · INTELLIGENCE",
    title: "Profile and ledger",
    description: "Build a structured profile and chronological transaction ledger.",
  },
  {
    step: "03 · ANALYSIS",
    title: "Analyse and visualise",
    description: "Explore time- and volume-based analytics, charts and relationship graphs.",
  },
  {
    step: "04 · OUTCOME",
    title: "Professional report",
    description: "Generate a report with key observations and a transaction appendix.",
  },
];

export default function ChainBreakPage() {
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
                  <span className="text-slate-900 font-medium">ChainBreak</span>
                </div>

                {/* Eyebrow */}
                <div className="flex items-center gap-2.5 text-xs font-semibold tracking-wider uppercase text-[#FF6700] animate-hero-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF6700] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF6700]"></span>
                  </span>
                  <span>-</span>
                  <span>BITCOIN WALLET INTELLIGENCE</span>
                </div>

                {/* Main Heading */}
                <h1 className="mt-4 text-4xl sm:text-6xl font-bold tracking-tight text-slate-900 leading-tight animate-hero-3">
                  Understand the behaviour <br />
                  behind every Bitcoin <br />
                  wallet.
                </h1>

                {/* Subtitle */}
                <p className="mt-4 text-[15px] sm:text-[16px] text-slate-700 max-w-2xl leading-relaxed animate-hero-4">
                  ChainBreak turns blockchain transaction data into a structured wallet profile - with a searchable ledger, analytics, visual insight and a professional report.
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
                    href="/resources/chainbreak-product-one-pager.pdf"
                    download
                    className="group inline-flex items-center gap-1.5 rounded-full border border-slate-300 hover:border-slate-500 bg-white/80 hover:bg-white text-slate-900 font-semibold px-6 py-3 text-[14px] sm:text-[15px] shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 backdrop-blur-sm"
                  >
                    Download product overview
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
                        WALLET INTELLIGENCE
                      </span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#FF6700]/10 text-[#FF6700] font-semibold border border-[#FF6700]/20">
                      ON-CHAIN
                    </span>
                  </div>

                  <div className="space-y-2.5 text-xs">
                    <div className="flex items-center justify-between py-1 border-b border-slate-50 text-slate-600">
                      <span className="text-slate-500">Address Profile</span>
                      <span className="font-mono font-semibold text-slate-900">UTXO / Ledger</span>
                    </div>
                    <div className="flex items-center justify-between py-1 border-b border-slate-50 text-slate-600">
                      <span className="text-slate-500">Analytics</span>
                      <span className="font-semibold text-emerald-600">Time & Volume</span>
                    </div>
                    <div className="flex items-center justify-between py-1 border-b border-slate-50 text-slate-600">
                      <span className="text-slate-500">Visual Graph</span>
                      <span className="font-mono font-semibold text-slate-900">Interactive Flows</span>
                    </div>
                    <div className="flex items-center justify-between py-1 text-slate-600">
                      <span className="text-slate-500">Export</span>
                      <span className="font-semibold text-[#FF6700]">Executive PDF</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 text-[11px] font-mono text-slate-500 flex items-center justify-between">
                    <span>TRANSACTION LEDGER</span>
                    <span className="text-emerald-600 font-semibold">● SYNCED</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. FEATURES & AUDIENCE SIDEBAR (Screenshot 2: White canvas) */}
        <section className="bg-white py-16 md:py-24 px-4 sm:px-6 border-b border-slate-200/80">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              {/* Left Column: What It Helps You Do & 6 Cards */}
              <div className="lg:col-span-8 space-y-10">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#FF6700]">
                    <span>-</span>
                    <span>WHAT IT HELPS YOU DO</span>
                  </div>
                  <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 leading-tight">
                    From raw transactions to <br />
                    wallet intelligence.
                  </h2>
                  <p className="mt-4 text-[15px] sm:text-[16px] text-slate-600 leading-relaxed max-w-2xl">
                    Raw blockchain data can show what happened without making the behaviour easy to understand. ChainBreak consolidates wallet activity across counterparties, timestamps and value ranges so analysts can review patterns and communicate observations more clearly.
                  </p>
                </div>

                {/* 6 Feature Cards (2x3 Grid) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {featureList.map((item, idx) => (
                    <div
                      key={idx}
                      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                    >
                      <h3 className="text-[16px] sm:text-[18px] font-bold text-slate-900">{item.title}</h3>
                      <p className="mt-2 text-[13px] sm:text-[14px] text-slate-600 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Sticky Sidebar Card (Screenshot 2) */}
              <div className="lg:col-span-4 rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sticky top-28 space-y-6">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#FF6700]">
                    <span>-</span>
                    <span>DESIGNED FOR</span>
                  </div>
                  <h3 className="mt-2 text-[16px] sm:text-[18px] font-bold text-slate-900">
                    Built for wallet analysis and investigation.
                  </h3>
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

                {/* Explore ChainBreak CTA Box */}
                <div className="border-t border-slate-100 pt-6 space-y-3">
                  <h4 className="text-[16px] sm:text-[18px] font-bold text-slate-900">Explore ChainBreak</h4>
                  <p className="text-[13px] sm:text-[14px] text-slate-500">
                    Discuss your use case with the team.
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
                      href="/resources/chainbreak-product-one-pager.pdf"
                      download
                      className="inline-flex items-center justify-between w-full text-[13px] sm:text-[14px] font-medium text-slate-700 hover:text-[#FF6700] transition-colors"
                    >
                      <span>Product overview PDF</span>
                      <span>↓</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. HOW IT WORKS SECTION (Screenshot 3: White canvas with 4 step cards) */}
        <section className="bg-white py-16 md:py-24 px-4 sm:px-6 border-b border-slate-200/80">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#FF6700]">
                <span>-</span>
                <span>HOW IT WORKS</span>
              </div>
              <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 leading-tight">
                One address in. A professional <br />
                report out.
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

        {/* 4. BOTTOM CALL-TO-ACTION CARD (Screenshot 4) */}
        <section className="bg-[#f8fafc] py-16 md:py-24 px-4 sm:px-6 border-b border-slate-200/80">
          <div className="mx-auto max-w-7xl">
            <div className="rounded-3xl bg-[#FF6700] text-white p-8 sm:p-12 md:p-16 shadow-xl border border-[#ff8438] flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
              <div className="max-w-2xl space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-white/90">
                  <span>-</span>
                  <span>TAKE THE NEXT STEP</span>
                </div>
                <h3 className="text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
                  Make wallet activity easier to <br className="hidden sm:inline" />
                  understand.
                </h3>
                <p className="text-[13px] sm:text-[14px] text-white/90 leading-relaxed">
                  Bring a wallet-analysis use case to the team and explore the workflow end to end.
                </p>
              </div>

              <div className="shrink-0">
                <Link
                  href="/#contact"
                  className="inline-flex items-center gap-1.5 rounded-full bg-white hover:bg-slate-100 text-[#FF6700] font-semibold px-7 py-3 text-[14px] sm:text-[15px] shadow-[1.5px_1.5px_3px_rgba(0,0,0,0.15)] transition-all"
                >
                  Start a conversation
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
