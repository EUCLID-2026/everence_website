import Image from "next/image";
import Link from "next/link";
import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactSection from "@/components/ContactSection";
import { SectionErrorBoundary } from "@/components/SectionErrorBoundary";
import { siteConfig } from "@/config/site";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col selection:bg-[#FF6700] selection:text-white font-sans">
      <Header />

      <main className="flex-1">
        {/* 1. HERO SECTION with tunnel.png background */}
        <SectionErrorBoundary sectionName="Hero">
          <section className="relative overflow-hidden bg-white text-slate-900 pt-16 pb-20 md:pt-24 md:pb-28 px-4 sm:px-6 border-b border-slate-200">
            {/* Background image tunnel.png */}
            <div className="absolute inset-0 z-0 pointer-events-none">
              <Image
                src="/assets/tunnel.png"
                alt="Everence Tunnel"
                fill
                priority
                className="object-cover object-center opacity-95"
              />
              {/* Soft gradient wash to ensure crisp readability for text across viewports */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-white/30 lg:via-white/70"></div>
            </div>

            <div className="relative z-10 mx-auto max-w-7xl">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                {/* Left Column: Eyebrow, Heading, Description, Buttons */}
                <div className="lg:col-span-7 space-y-6">
                  {/* Eyebrow */}
                  <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#FF6700]">
                    <span>—</span>
                    <span>PRODUCT ENGINEERING · CYBERSECURITY</span>
                  </div>

                  {/* Two-Tone Heading */}
                  <h1 className="text-4xl sm:text-6xl lg:text-[64px] font-extrabold tracking-tight text-slate-900 leading-[1.1] lg:leading-[70px]">
                    Security <br />
                    intelligence. <br />
                    <span className="text-[#FF6700]">Built into</span> <br />
                    <span className="text-[#FF6700]">products.</span>
                  </h1>

                  {/* Description */}
                  <p className="text-base sm:text-lg lg:text-[20px] text-slate-700 max-w-xl leading-relaxed lg:leading-[32px]">
                    Purpose-built tools that turn complex security data into clear decisions — from Android application analysis and Bitcoin wallet intelligence to cloud security and post-quantum readiness.
                  </p>

                  {/* Buttons */}
                  <div className="pt-2 flex flex-wrap items-center gap-4">
                    <Link
                      href="/#products"
                      className="inline-flex items-center gap-1.5 rounded-full bg-[#FF6700] hover:bg-[#e65c00] text-white font-semibold px-7 py-3 text-[15px] sm:text-[16px] shadow-[1.5px_1.5px_3px_rgba(174,174,192,0.30)] transition-colors"
                    >
                      Explore our products
                      <span>↗</span>
                    </Link>
                    <Link
                      href="/#contact"
                      className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 hover:border-slate-500 bg-white/80 hover:bg-white text-slate-900 font-semibold px-7 py-3 text-[15px] sm:text-[16px] shadow-sm transition-colors backdrop-blur-sm"
                    >
                      Talk to our team
                    </Link>
                  </div>
                </div>

                {/* Right Column: Concentric Radar with Glowing Diamond and Orbit Pills */}
                <div className="lg:col-span-5 flex items-center justify-center relative py-12 lg:py-0">
                  <div className="relative flex items-center justify-center w-72 h-72 sm:w-96 sm:h-96">
                    {/* Concentric radar circles */}
                    <div className="absolute inset-0 rounded-full border border-[#FF6700]/25"></div>
                    <div className="absolute inset-8 rounded-full border border-[#FF6700]/30"></div>
                    <div className="absolute inset-16 rounded-full border border-[#FF6700]/35"></div>
                    <div className="absolute inset-24 rounded-full border border-[#FF6700]/40"></div>

                    {/* Central Glowing Diamond with Asterisk */}
                    <div className="relative z-10 h-28 w-28 sm:h-36 sm:w-36 rotate-45 rounded-3xl bg-gradient-to-br from-[#ff8438] to-[#FF6700] shadow-[0_0_50px_rgba(255,103,0,0.35)] flex items-center justify-center">
                      <span className="-rotate-45 text-2xl sm:text-3xl font-extrabold text-slate-950">
                        ✳
                      </span>
                    </div>

                    {/* Satellite Orbit Pill: Risk Visibility (Top Right) */}
                    <div className="absolute top-2 right-0 sm:right-2 z-20 rounded-xl border border-slate-200/90 bg-white/95 px-3.5 py-2 shadow-md backdrop-blur">
                      <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                        RISK VISIBILITY
                      </div>
                      <div className="text-xs font-semibold text-slate-900 mt-0.5">
                        See what matters
                      </div>
                    </div>

                    {/* Satellite Orbit Pill: Analysis to Action (Bottom Left) */}
                    <div className="absolute bottom-6 left-0 sm:left-2 z-20 rounded-xl border border-slate-200/90 bg-white/95 px-3.5 py-2 shadow-md backdrop-blur">
                      <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                        ANALYSIS → ACTION
                      </div>
                      <div className="text-xs font-semibold text-slate-900 mt-0.5">
                        Less guesswork
                      </div>
                    </div>

                    {/* Satellite Orbit Pill: Intelligence (Bottom Right) */}
                    <div className="absolute bottom-2 right-4 sm:right-6 z-20 rounded-xl border border-slate-200/90 bg-white/95 px-3.5 py-2 shadow-md backdrop-blur">
                      <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-slate-500">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                        INTELLIGENCE
                      </div>
                      <div className="text-xs font-semibold text-slate-900 mt-0.5">
                        Built for teams
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Lead Strip */}
              <div className="mt-14 pt-8 border-t border-slate-200/80 flex items-center gap-2 text-xs text-slate-600">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                <span className="font-semibold text-slate-900">Three focused products.</span>
                <span className="text-slate-500">One commitment to clearer security decisions.</span>
              </div>
            </div>
          </section>
        </SectionErrorBoundary>

        {/* 2. CATEGORY BAR (Screenshot 2: White background with spaced tags) */}
        <section className="bg-white border-b border-slate-200/80 py-5 px-4 sm:px-6">
          <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-4 text-[13px] sm:text-[14px]">
            <span className="text-slate-600 font-medium">
              Designed for security-conscious teams
            </span>
            <div className="flex flex-wrap items-center gap-6 sm:gap-10 font-mono text-[11px] font-medium tracking-wider text-slate-700 uppercase">
              <span>APPLICATION SECURITY</span>
              <span>BLOCKCHAIN INTELLIGENCE</span>
              <span>CLOUD & POST-QUANTUM</span>
            </div>
          </div>
        </section>

        {/* 3. PRODUCT PORTFOLIO (Screenshot 2: White canvas with 3 cards) */}
        <SectionErrorBoundary sectionName="Product Portfolio">
          <section id="products" className="bg-white py-20 md:py-28 px-4 sm:px-6 border-b border-slate-200/80 scroll-mt-12">
            <div className="mx-auto max-w-7xl">
              <div className="max-w-3xl">
                <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#FF6700]">
                  <span>—</span>
                  <span>THE PRODUCT PORTFOLIO</span>
                </div>
                <h2 className="mt-4 text-3xl sm:text-5xl lg:text-[56px] font-extrabold tracking-tight text-slate-900 leading-tight lg:leading-[64px]">
                  Different challenges. <br />
                  Purpose-built tools.
                </h2>
                <p className="mt-4 text-base sm:text-lg lg:text-[20px] text-slate-600 leading-relaxed lg:leading-[32px]">
                  Explore products designed around a clear workflow: uncover evidence, understand what it means, and make the next move with confidence.
                </p>
              </div>

              {/* 3 Product Cards */}
              <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-8">
                {siteConfig.products.map((product) => (
                  <div
                    key={product.id}
                    className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-[#F5F5F5]/60 hover:bg-white p-8 shadow-sm hover:shadow-[1.5px_1.5px_6px_rgba(174,174,192,0.30)] transition-all"
                  >
                    <div>
                      {/* Card Header: Icon container and Category Tag */}
                      <div className="flex items-center justify-between">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white border border-slate-200 text-xl font-mono text-slate-800">
                          {product.symbol}
                        </div>
                        <span className="rounded-full border border-slate-200 bg-white px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-slate-600">
                          {product.category}
                        </span>
                      </div>

                      {/* Title & Description */}
                      <h3 className="mt-6 text-2xl lg:text-[26px] font-bold text-slate-900">
                        {product.name}
                      </h3>
                      <p className="mt-3 text-[14px] sm:text-[15px] text-slate-600 leading-relaxed">
                        {product.description}
                      </p>

                      {/* Bullets with Brand Arrow */}
                      <ul className="mt-6 space-y-2.5 border-t border-slate-200/80 pt-6">
                        {product.bullets.map((bullet, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-[13px] sm:text-[14px] text-slate-700">
                            <span className="text-[#FF6700] font-bold">↗</span>
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Bottom Explore Link */}
                    <div className="mt-8 pt-6 border-t border-slate-200/80">
                      <Link
                        href={product.pageHref}
                        className="inline-flex items-center gap-1.5 text-[14px] sm:text-[15px] font-bold text-slate-900 hover:text-[#FF6700] transition-colors"
                      >
                        Explore {product.name}
                        <span className="text-[#FF6700]">↗</span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </SectionErrorBoundary>

        {/* 4. SPLIT DECISION & PRODUCT PHILOSOPHY SECTION (Screenshot 3) */}
        <SectionErrorBoundary sectionName="Decision & Philosophy">
          <section id="approach" className="bg-white py-20 md:py-28 px-4 sm:px-6 border-b border-slate-200/80 scroll-mt-12">
            <div className="mx-auto max-w-7xl">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                {/* Left Side: Built around the decision you need to make (7 Cols) */}
                <div className="lg:col-span-7">
                  <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#FF6700]">
                    <span>—</span>
                    <span>FROM COMPLEXITY TO CLARITY</span>
                  </div>

                  <h2 className="mt-4 text-3xl sm:text-4xl lg:text-[48px] font-extrabold tracking-tight text-slate-900 leading-tight lg:leading-[56px]">
                    Built around the <br />
                    decision you need to <br />
                    make.
                  </h2>

                  <p className="mt-4 text-[15px] sm:text-[16px] text-slate-600 leading-relaxed lg:leading-[24px] max-w-xl">
                    Security tools should do more than surface raw findings. They should help teams understand the context, focus effort, and communicate results in a useful way.
                  </p>

                  {/* 2x2 Grid of 4 White Cards */}
                  <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="rounded-2xl border border-slate-200 bg-[#F6F6F6] hover:bg-white p-5 shadow-sm transition-all">
                      <h3 className="text-[16px] sm:text-[18px] font-bold text-slate-900">Make risk visible</h3>
                      <p className="mt-1 text-[13px] sm:text-[14px] text-slate-600 leading-relaxed">
                        Bring scattered technical signals into a clearer view.
                      </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-[#F6F6F6] hover:bg-white p-5 shadow-sm transition-all">
                      <h3 className="text-[16px] sm:text-[18px] font-bold text-slate-900">Focus the response</h3>
                      <p className="mt-1 text-[13px] sm:text-[14px] text-slate-600 leading-relaxed">
                        Surface meaningful findings and practical next steps.
                      </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-[#F6F6F6] hover:bg-white p-5 shadow-sm transition-all">
                      <h3 className="text-[16px] sm:text-[18px] font-bold text-slate-900">Communicate clearly</h3>
                      <p className="mt-1 text-[13px] sm:text-[14px] text-slate-600 leading-relaxed">
                        Turn technical analysis into structured insights.
                      </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-[#F6F6F6] hover:bg-white p-5 shadow-sm transition-all">
                      <h3 className="text-[16px] sm:text-[18px] font-bold text-slate-900">Support repeatable work</h3>
                      <p className="mt-1 text-[13px] sm:text-[14px] text-slate-600 leading-relaxed">
                        Give teams workflows they can use consistently.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Side: Featured Everence Orange Philosophy Card (5 Cols) */}
                <div className="lg:col-span-5 rounded-3xl bg-[#FF6700] text-white p-8 sm:p-10 shadow-xl border border-[#ff8438]">
                  <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-white/90">
                    <span>—</span>
                    <span>OUR PRODUCT PHILOSOPHY</span>
                  </div>

                  <h3 className="mt-3 text-xl sm:text-2xl lg:text-[26px] font-bold text-white">
                    Useful intelligence, not just more data.
                  </h3>

                  <p className="mt-3 text-[14px] sm:text-[15px] text-white/90 leading-relaxed">
                    Each product is designed around a specific security problem, with a practical path from input to analysis and outcome.
                  </p>

                  <div className="mt-8 space-y-6 border-t border-white/20 pt-6">
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="font-mono text-base font-bold text-white">01</span>
                        <span className="text-[16px] font-bold text-white">Discover</span>
                      </div>
                      <p className="mt-1 text-[13px] sm:text-[14px] text-white/85 leading-relaxed pl-6">
                        Bring the relevant app, wallet activity or cloud environment into view.
                      </p>
                    </div>

                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="font-mono text-base font-bold text-white">02</span>
                        <span className="text-[16px] font-bold text-white">Analyse</span>
                      </div>
                      <p className="mt-1 text-[13px] sm:text-[14px] text-white/85 leading-relaxed pl-6">
                        Organise technical detail into meaningful patterns and findings.
                      </p>
                    </div>

                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="font-mono text-base font-bold text-white">03</span>
                        <span className="text-[16px] font-bold text-white">Act</span>
                      </div>
                      <p className="mt-1 text-[13px] sm:text-[14px] text-white/85 leading-relaxed pl-6">
                        Use structured insights to guide review, remediation or reporting.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </SectionErrorBoundary>

        {/* 5. A CLEAR WORKFLOW (Screenshot 4: White canvas with 4 horizontal step cards) */}
        <SectionErrorBoundary sectionName="Workflow">
          <section className="bg-white py-20 md:py-28 px-4 sm:px-6 border-b border-slate-200/80">
            <div className="mx-auto max-w-7xl">
              <div className="max-w-3xl">
                <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#FF6700]">
                  <span>—</span>
                  <span>A CLEAR WORKFLOW</span>
                </div>
                <h2 className="mt-4 text-3xl sm:text-4xl lg:text-[48px] font-extrabold tracking-tight text-slate-900 leading-tight lg:leading-[56px]">
                  Less friction between data <br />
                  and action.
                </h2>
                <p className="mt-3 text-base sm:text-lg text-slate-600 leading-relaxed">
                  Product experiences are designed to keep the workflow understandable, from the first input through to a useful output.
                </p>
              </div>

              {/* 4 Cards in a Row */}
              <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="rounded-2xl border border-slate-200 bg-[#F6F6F6] hover:bg-white p-6 shadow-sm transition-all">
                  <div className="font-mono text-xs font-semibold text-[#FF6700] uppercase">
                    STEP 01
                  </div>
                  <h3 className="mt-2 text-[17px] sm:text-[18px] font-bold text-slate-900">Bring it in</h3>
                  <p className="mt-2 text-[13px] sm:text-[14px] text-slate-600 leading-relaxed">
                    Submit an app package, Bitcoin wallet address or connect a cloud environment.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-[#F6F6F6] hover:bg-white p-6 shadow-sm transition-all">
                  <div className="font-mono text-xs font-semibold text-[#FF6700] uppercase">
                    STEP 02
                  </div>
                  <h3 className="mt-2 text-[17px] sm:text-[18px] font-bold text-slate-900">Build context</h3>
                  <p className="mt-2 text-[13px] sm:text-[14px] text-slate-600 leading-relaxed">
                    Organise structure, activity, assets and relevant technical signals.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-[#F6F6F6] hover:bg-white p-6 shadow-sm transition-all">
                  <div className="font-mono text-xs font-semibold text-[#FF6700] uppercase">
                    STEP 03
                  </div>
                  <h3 className="mt-2 text-[17px] sm:text-[18px] font-bold text-slate-900">Find the signal</h3>
                  <p className="mt-2 text-[13px] sm:text-[14px] text-slate-600 leading-relaxed">
                    Review findings, trends, comparisons and security posture.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-[#F6F6F6] hover:bg-white p-6 shadow-sm transition-all">
                  <div className="font-mono text-xs font-semibold text-[#FF6700] uppercase">
                    STEP 04
                  </div>
                  <h3 className="mt-2 text-[17px] sm:text-[18px] font-bold text-slate-900">Move forward</h3>
                  <p className="mt-2 text-[13px] sm:text-[14px] text-slate-600 leading-relaxed">
                    Use practical insights, recommendations and reports to plan next steps.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </SectionErrorBoundary>

        {/* 6. RESOURCES (Screenshot 5: White canvas with 3 cards & Download PDF pills) */}
        <SectionErrorBoundary sectionName="Resources">
          <section className="bg-white py-20 md:py-28 px-4 sm:px-6 border-b border-slate-200/80">
            <div className="mx-auto max-w-7xl">
              <div className="max-w-3xl">
                <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#FF6700]">
                  <span>—</span>
                  <span>RESOURCES</span>
                </div>
                <h2 className="mt-4 text-3xl sm:text-4xl lg:text-[48px] font-extrabold tracking-tight text-slate-900 leading-tight lg:leading-[56px]">
                  Get to know the products.
                </h2>
                <p className="mt-3 text-base sm:text-lg text-slate-600 leading-relaxed">
                  Download the current product material to explore capabilities and workflows in more detail.
                </p>
              </div>

              {/* 3 Resource Cards */}
              <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
                {siteConfig.products.map((prod) => (
                  <div
                    key={prod.id}
                    className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-[#F5F5F5]/60 hover:bg-white p-7 shadow-sm transition-all"
                  >
                    <div>
                      {/* Document Symbol */}
                      <div className="font-mono text-2xl text-[#FF6700]">▤</div>

                      {/* Outline Tag */}
                      <div className="mt-3">
                        <span className="inline-block rounded-full border border-slate-200 bg-white px-3 py-1 font-mono text-[10px] text-slate-600 uppercase">
                          {prod.pdfLabel}
                        </span>
                      </div>

                      {/* Product Title */}
                      <h3 className="mt-4 text-xl sm:text-[22px] font-bold text-slate-900">{prod.name}</h3>
                      <p className="mt-2 text-[13px] sm:text-[14px] text-slate-600 leading-relaxed">
                        {prod.tagline}
                      </p>
                    </div>

                    {/* Download Pill Button matching Screenshot 5 */}
                    <div className="mt-8 pt-6 border-t border-slate-200/80">
                      <a
                        href={prod.pdfHref}
                        download
                        className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 bg-white px-6 py-2.5 text-[14px] font-semibold text-slate-800 shadow-[1.5px_1.5px_3px_rgba(174,174,192,0.30)] hover:border-[#FF6700] hover:text-[#FF6700] transition-colors"
                      >
                        Download PDF
                        <span>↓</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              {/* Link below */}
              <div className="mt-12">
                <Link
                  href="/resources"
                  className="inline-flex items-center gap-1.5 text-[14px] sm:text-[15px] font-semibold text-slate-700 hover:text-[#FF6700] transition-colors"
                >
                  Browse all resources
                  <span className="text-[#FF6700]">↗</span>
                </Link>
              </div>
            </div>
          </section>
        </SectionErrorBoundary>

        {/* 7. ABOUT SECURAAPPS (Matching Screenshot) */}
        <SectionErrorBoundary sectionName="About">
          <section id="about" className="bg-[#f8fafc] py-16 md:py-24 px-4 sm:px-6 border-b border-slate-200/80 scroll-mt-12">
            <div className="mx-auto max-w-7xl">
              <div className="rounded-3xl bg-[#FF6700] text-white p-8 sm:p-12 md:p-16 shadow-xl border border-[#ff8438] flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                <div className="max-w-2xl space-y-4">
                  <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-white/90">
                    <span>—</span>
                    <span>EVERENCE SECURAAPPS</span>
                  </div>
                  <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold tracking-tight text-white leading-tight lg:leading-[52px]">
                    Security challenges deserve <br className="hidden sm:inline" />
                    focused product thinking.
                  </h2>
                  <p className="text-[14px] sm:text-[16px] text-white/95 leading-relaxed max-w-xl">
                    SecuraApps is the product development unit of Everence, building tools that help teams make better-informed security decisions.
                  </p>
                </div>

                <div className="shrink-0">
                  <a
                    href="https://www.everence.io/explore"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full bg-white hover:bg-slate-100 text-[#FF6700] font-semibold px-7 py-3 text-[15px] sm:text-[16px] shadow-[1.5px_1.5px_3px_rgba(0,0,0,0.15)] transition-colors"
                  >
                    Discover Everence
                    <span>↗</span>
                  </a>
                </div>
              </div>
            </div>
          </section>
        </SectionErrorBoundary>

        {/* 8. CONTACT SECTION */}
        <SectionErrorBoundary sectionName="Contact">
          <ContactSection />
        </SectionErrorBoundary>
      </main>

      {/* 9. FOOTER */}
      <Footer />
    </div>
  );
}
