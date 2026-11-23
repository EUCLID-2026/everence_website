import Image from "next/image";
import Link from "next/link";
import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Product Resources | Everence SecuraApps",
  description:
    "Explore product capabilities and workflows through the current materials provided by the SecuraApps team.",
};

interface ResourceItem {
  id: string;
  name: string;
  tag: string;
  description: string;
  pdfHref: string;
}

const resourcesList: ResourceItem[] = [
  {
    id: "droidscan",
    name: "DroidScan",
    tag: "PDF · PRODUCT ONE-PAGER",
    description:
      "Android application security workspace. Includes key problems, audience, workflow, OWASP MASVS-aligned triage, code studio, behavioural profiling and other features.",
    pdfHref: "/resources/droidscan-product-one-pager.pdf",
  },
  {
    id: "chainbreak",
    name: "ChainBreak",
    tag: "PDF · PRODUCT ONE-PAGER",
    description:
      "Bitcoin wallet intelligence. Covers wallet profiling, transaction ledger, time and volume analytics, graphical representations and automated reporting.",
    pdfHref: "/resources/chainbreak-product-one-pager.pdf",
  },
  {
    id: "webstrike",
    name: "WebStrike",
    tag: "PDF · PRODUCT ONE-PAGER",
    description:
      "Website defence and threat intelligence platform. Covers phishing detection, perimeter & port reconnaissance, misconfiguration audits, 24/7 downtime sentinel, and one-click executive reports.",
    pdfHref: "/resources/webstrike-product-one-pager.pdf",
  },
];

export default function ResourcesPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col selection:bg-[#FF6700] selection:text-white font-sans">
      <Header />

      <main className="flex-1">
        {/* 1. HERO HEADER with tunnel.png background */}
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
              <span className="text-slate-900 font-medium">Resources</span>
            </div>

            {/* Eyebrow */}
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#FF6700]">
              <span>—</span>
              <span>PRODUCT LIBRARY</span>
            </div>

            {/* Main Heading */}
            <h1 className="mt-4 text-4xl sm:text-6xl font-bold tracking-tight text-slate-900 leading-tight">
              Helpful detail. <br />
              Ready when you are.
            </h1>

            {/* Intro text */}
            <p className="mt-4 text-[15px] sm:text-[16px] text-slate-700 max-w-2xl leading-relaxed">
              Explore product capabilities and workflows through the current materials provided by the SecuraApps team.
            </p>
          </div>
        </section>

        {/* 2. DOWNLOADS SECTION (White Canvas matching Screenshot 2) */}
        <section className="bg-white py-16 md:py-24 px-4 sm:px-6">
          <div className="mx-auto max-w-7xl">
            {/* Section Header */}
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#FF6700]">
                <span>—</span>
                <span>DOWNLOADS</span>
              </div>
              <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
                Product resources
              </h2>
              <p className="mt-2 text-[13px] sm:text-[14px] text-slate-500">
                Official product overviews and technical one-pagers for the Everence SecuraApps cybersecurity suite.
              </p>
            </div>

            {/* 3 PDF Resource Cards */}
            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
              {resourcesList.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-7 shadow-sm"
                >
                  <div>
                    {/* Orange Sheet Icon */}
                    <div className="font-mono text-xl text-[#FF6700]">▤</div>

                    {/* Tag outline pill */}
                    <div className="mt-3">
                      <span className="inline-block rounded-full border border-slate-200 px-3 py-1 font-mono text-[10px] text-slate-500 uppercase">
                        {item.tag}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="mt-4 text-xl font-bold text-slate-900">{item.name}</h3>

                    {/* Authentic Description */}
                    <p className="mt-2 text-[13px] sm:text-[14px] text-slate-600 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Solid Orange Download Button */}
                  <div className="mt-8 pt-6 border-t border-slate-100">
                    <a
                      href={item.pdfHref}
                      download
                      className="inline-flex items-center gap-1.5 rounded-full bg-[#FF6700] hover:bg-[#e65c00] text-white font-semibold px-5 py-2.5 text-[14px] shadow-[1.5px_1.5px_3px_rgba(174,174,192,0.30)] transition-all"
                    >
                      Download PDF
                      <span>↓</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>


            {/* 3. BOTTOM CALL-TO-ACTION CARD (Everence Orange Card matching design system) */}
            <div className="mt-16 rounded-3xl bg-[#FF6700] text-white p-8 sm:p-12 shadow-xl border border-[#ff8438] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-white/90">
                  <span>—</span>
                  <span>NEED MORE DETAIL?</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
                  Let’s discuss your security use <br className="hidden sm:inline" />
                  case.
                </h3>
                <p className="text-[13px] sm:text-[14px] text-white/90">
                  Contact the team for product questions, walkthroughs and next steps.
                </p>
              </div>

              <Link
                href="/#contact"
                className="inline-flex items-center gap-1.5 rounded-full bg-white hover:bg-slate-100 text-[#FF6700] font-semibold px-6 py-3 text-[14px] sm:text-[15px] shadow-[1.5px_1.5px_3px_rgba(0,0,0,0.15)] transition-all shrink-0"
              >
                Contact SecuraApps
                <span>↗</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
