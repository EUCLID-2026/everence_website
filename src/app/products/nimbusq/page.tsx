import Image from "next/image";
import Link from "next/link";
import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NimbusQ | Cloud & Post-Quantum Cryptography | Everence SecuraApps",
  description:
    "Prepare your cloud security for what's next. NimbusQ helps organisations understand cloud environments, identify quantum-vulnerable cryptography, evaluate current cloud security posture and prioritise remediation.",
};

const featureList = [
  {
    title: "Cloud asset inventory",
    description:
      "Organises compute, storage, databases, identities, networks, encryption objects and application resources.",
  },
  {
    title: "Cryptographic readiness",
    description:
      "Reviews algorithms, key types and sizes, TLS versions, cipher suites, certificates and encryption state.",
  },
  {
    title: "Cloud security posture",
    description:
      "Assesses configuration risks across data protection, access control, network security and exposure.",
  },
  {
    title: "Quantum safety score",
    description:
      "Summarises cryptographic readiness with a 0–100 score intended to help teams measure progress.",
  },
  {
    title: "Prioritised remediation",
    description:
      "Highlights migration guidance for quantum-vulnerable public-key cryptography, weak TLS and missing encryption.",
  },
  {
    title: "Dashboards and reports",
    description:
      "Presents environment health, inventory, quantum analysis, posture findings and downloadable client-facing outputs.",
  },
];

const audiences = [
  "Cloud security teams",
  "Enterprise architects",
  "Security leadership",
  "Risk and compliance teams",
  "Cloud engineering teams",
  "Post-quantum migration planners",
];

const workflowSteps = [
  {
    step: "01 · CONNECT",
    title: "Read-only access",
    description: "Connect a cloud environment and validate assessment visibility.",
  },
  {
    step: "02 · DISCOVER",
    title: "Inventory assets",
    description: "Organise discovered resources into a consistent inventory.",
  },
  {
    step: "03 · ASSESS",
    title: "Analyse risk",
    description: "Review cryptographic use and cloud configuration posture.",
  },
  {
    step: "04 · PRIORITISE",
    title: "Report and plan",
    description: "Review scores, remediation guidance and migration priorities.",
  },
];

export default function NimbusQPage() {
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
              <span className="text-slate-900 font-medium">NimbusQ</span>
            </div>

            {/* Eyebrow */}
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#FF6700]">
              <span>—</span>
              <span>CLOUD SECURITY · POST-QUANTUM READINESS</span>
            </div>

            {/* Main Heading */}
            <h1 className="mt-4 text-4xl sm:text-6xl font-bold tracking-tight text-slate-900 leading-tight">
              Prepare your cloud <br />
              security for what&apos;s next.
            </h1>

            {/* Subtitle */}
            <p className="mt-4 text-[15px] sm:text-[16px] text-slate-700 max-w-2xl leading-relaxed">
              NimbusQ helps organisations understand cloud environments, identify quantum-vulnerable cryptography, evaluate current cloud security posture and prioritise remediation.
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
                href="/resources/nimbusq-product-overview.pdf"
                download
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 hover:border-slate-500 bg-white/80 hover:bg-white text-slate-900 font-semibold px-6 py-3 text-[14px] sm:text-[15px] shadow-sm transition-colors backdrop-blur-sm"
              >
                Download product overview
                <span>↓</span>
              </a>
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
                    <span>—</span>
                    <span>WHAT IT HELPS YOU DO</span>
                  </div>
                  <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 leading-tight">
                    A clearer view of cloud <br />
                    risk and cryptographic <br />
                    readiness.
                  </h2>
                  <p className="mt-4 text-[15px] sm:text-[16px] text-slate-600 leading-relaxed max-w-2xl">
                    NimbusQ is a multi-cloud assessment platform for security visibility and post-quantum migration planning. Its described workflow uses read-only cloud access to discover assets, identify cryptographic usage, evaluate configuration risks and turn findings into scores and recommendations.
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

                {/* Orange Callout Box */}
                <div className="rounded-2xl border border-[#FF6700]/30 bg-[#FF6700]/10 p-5 text-[13px] sm:text-[14px] text-slate-800 leading-relaxed shadow-sm">
                  Product information on this page is based on the supplied NimbusQ product overview. Confirm deployment details, data sources, supported integrations and product availability with the SecuraApps team.
                </div>
              </div>

              {/* Right Column: Sticky Sidebar Card (Screenshot 2) */}
              <div className="lg:col-span-4 rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sticky top-28 space-y-6">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#FF6700]">
                    <span>—</span>
                    <span>DESIGNED FOR</span>
                  </div>
                  <h3 className="mt-2 text-[16px] sm:text-[18px] font-bold text-slate-900">
                    For teams planning secure cloud operations.
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

                {/* Explore NimbusQ CTA Box */}
                <div className="border-t border-slate-100 pt-6 space-y-3">
                  <h4 className="text-[16px] sm:text-[18px] font-bold text-slate-900">Explore NimbusQ</h4>
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
                      href="/resources/nimbusq-product-overview.pdf"
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
                <span>—</span>
                <span>HOW IT WORKS</span>
              </div>
              <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 leading-tight">
                Connect. Scan. Analyse. <br />
                Prioritise. Report.
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
                  <span>—</span>
                  <span>TAKE THE NEXT STEP</span>
                </div>
                <h3 className="text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
                  Make your cloud and post- <br className="hidden sm:inline" />
                  quantum roadmap more <br className="hidden sm:inline" />
                  concrete.
                </h3>
                <p className="text-[13px] sm:text-[14px] text-white/90 leading-relaxed">
                  Discuss your cloud environment and cryptographic-readiness assessment goals with the SecuraApps team.
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
