"use client";

import React, { useState, useEffect } from "react";
import { Mail, Phone, User, CheckCircle2, AlertCircle, Shield } from "lucide-react";
import { siteConfig } from "@/config/site";

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organisation: "",
    product: "Choose a product",
    message: "",
    honeypot: "",
  });

  const [formLoadedAt, setFormLoadedAt] = useState<number>(0);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    setFormLoadedAt(Date.now());
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!formData.name.trim()) {
      setErrorMessage("Please enter your name.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      setErrorMessage("Please enter a valid work email address.");
      return;
    }

    if (formData.product === "Choose a product") {
      setErrorMessage("Please select a product of interest.");
      return;
    }

    setStatus("submitting");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          formLoadedAt,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit enquiry.");
      }

      setStatus("success");
      setSuccessMessage(result.message);
      setFormData({
        name: "",
        email: "",
        organisation: "",
        product: "Choose a product",
        message: "",
        honeypot: "",
      });
    } catch (err: unknown) {
      setStatus("error");
      const message =
        err instanceof Error
          ? err.message
          : "An unexpected network error occurred. Please try again or reach out by phone.";
      setErrorMessage(message);
    }
  };

  return (
    <section id="contact" className="py-20 md:py-28 px-4 sm:px-6 bg-white border-b border-slate-200/80 scroll-mt-12">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#FF6700]">
            <span>—</span>
            <span>START A CONVERSATION</span>
          </div>
          <h2 className="mt-4 text-3xl sm:text-4xl lg:text-[48px] font-bold tracking-tight text-slate-900 leading-tight">
            See what the right product could unlock.
          </h2>
          <p className="mt-4 text-[15px] sm:text-[16px] text-slate-600 leading-relaxed">
            Tell us what you’re exploring. We’ll help you find the right product conversation.
          </p>
        </div>

        {/* Contact Layout: Details Block + Form */}
        <div className="mt-14 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Contact Details Block (Everence Orange container matching design system) */}
          <div className="lg:col-span-5 rounded-3xl bg-[#FF6700] text-white p-8 sm:p-10 space-y-6 shadow-xl border border-[#ff8438]">
            <div>
              <h3 className="text-[22px] sm:text-[24px] font-bold text-white">Let’s talk security.</h3>
              <p className="mt-2 text-[13px] sm:text-[14px] text-white/90 leading-relaxed">
                Request a walkthrough, discuss a use case or ask a question about the product portfolio.
              </p>
            </div>

            <div className="space-y-4 pt-4 border-t border-white/20">
              <div className="flex items-center gap-3.5 text-sm text-white">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/20 text-white">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-[11px] text-white/80 uppercase font-mono">Contact</div>
                  <div className="font-semibold text-white">{siteConfig.contact.person}</div>
                </div>
              </div>

              <div className="flex items-center gap-3.5 text-sm text-white">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/20 text-white">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-[11px] text-white/80 uppercase font-mono">Email</div>
                  <div className="font-semibold text-white">{siteConfig.contact.email}</div>
                </div>
              </div>

              <div className="flex items-center gap-3.5 text-sm text-white">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/20 text-white">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-[11px] text-white/80 uppercase font-mono">Phone</div>
                  <a
                    href={`tel:${siteConfig.contact.phone.replace(/\s+/g, "")}`}
                    className="font-semibold text-white hover:text-white/80 transition-colors"
                  >
                    {siteConfig.contact.displayPhone}
                  </a>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/20 bg-black/10 p-4 text-xs text-white flex items-start gap-2.5">
              <Shield className="h-4 w-4 shrink-0 text-white mt-0.5" />
              <span>{siteConfig.contact.availabilityNote}</span>
            </div>
          </div>

          {/* Enquiry Form (Clean White Card with subtle border) */}
          <div className="lg:col-span-7 rounded-3xl border border-slate-200 bg-white p-8 sm:p-10 shadow-sm">
            {errorMessage && (
              <div
                role="alert"
                className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-red-700"
              >
                <AlertCircle className="h-4 w-4 shrink-0 text-red-600 mt-0.5" />
                <p>{errorMessage}</p>
              </div>
            )}

            {successMessage && (
              <div
                role="status"
                className="mb-6 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs text-emerald-800"
              >
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
                <p>{successMessage}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <div className="hidden" aria-hidden="true">
                <label htmlFor="honeypot">Website</label>
                <input
                  id="honeypot"
                  name="honeypot"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={formData.honeypot}
                  onChange={handleChange}
                />
              </div>

              {/* Your Name */}
              <div>
                <label htmlFor="contact-name" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Your name <span className="text-[#FF6700]">*</span>
                </label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  required
                  disabled={status === "submitting"}
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  className="w-full rounded-xl border border-slate-300 bg-slate-50/50 py-2.5 px-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#FF6700] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#FF6700]"
                />
              </div>

              {/* Work Email */}
              <div>
                <label htmlFor="contact-email" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Work email <span className="text-[#FF6700]">*</span>
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  required
                  disabled={status === "submitting"}
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@organisation.com"
                  className="w-full rounded-xl border border-slate-300 bg-slate-50/50 py-2.5 px-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#FF6700] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#FF6700]"
                />
              </div>

              {/* Organisation */}
              <div>
                <label htmlFor="contact-organisation" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Organisation
                </label>
                <input
                  id="contact-organisation"
                  name="organisation"
                  type="text"
                  disabled={status === "submitting"}
                  value={formData.organisation}
                  onChange={handleChange}
                  placeholder="Organisation or enterprise name"
                  className="w-full rounded-xl border border-slate-300 bg-slate-50/50 py-2.5 px-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#FF6700] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#FF6700]"
                />
              </div>

              {/* Product of interest */}
              <div>
                <label htmlFor="contact-product" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Product of interest <span className="text-[#FF6700]">*</span>
                </label>
                <select
                  id="contact-product"
                  name="product"
                  required
                  disabled={status === "submitting"}
                  value={formData.product}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50/50 py-2.5 px-3.5 text-sm text-slate-900 focus:border-[#FF6700] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#FF6700]"
                >
                  <option value="Choose a product">Choose a product</option>
                  <option value="DroidScan">DroidScan (Mobile AppSec)</option>
                  <option value="ChainBreak">ChainBreak (Wallet Intelligence)</option>
                  <option value="NimbusQ">NimbusQ (Cloud & PQC)</option>
                  <option value="Multiple products">Multiple products</option>
                  <option value="General enquiry">General enquiry</option>
                </select>
              </div>

              {/* Message */}
              <div>
                <label htmlFor="contact-message" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  What would you like to explore?
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={4}
                  disabled={status === "submitting"}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Describe your security challenge, target environment or walkthrough request..."
                  className="w-full rounded-xl border border-slate-300 bg-slate-50/50 py-2.5 px-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#FF6700] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#FF6700]"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-[#FF6700] hover:bg-[#e65c00] px-7 py-3 text-[15px] sm:text-[16px] font-semibold text-white shadow-[1.5px_1.5px_3px_rgba(174,174,192,0.30)] transition-all focus:outline-none focus:ring-2 focus:ring-[#FF6700] focus:ring-offset-2 disabled:opacity-50"
                >
                  {status === "submitting" ? (
                    "Sending enquiry..."
                  ) : (
                    <>
                      Prepare enquiry
                      <span>↗</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-[11px] text-slate-500 pt-1">
                Direct enquiry: your message is securely validated and transmitted to our security team.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
