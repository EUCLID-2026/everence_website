import Image from "next/image";
import Link from "next/link";
import React from "react";
import { siteConfig } from "@/config/site";

export default function Footer() {
  return (
    <footer className="border-t border-[#e65c00] bg-[#FF6700] text-white text-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-4">
            <Link
              href="/"
              className="inline-block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white bg-white px-3.5 py-2 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
              aria-label="Everence SecuraApps Home"
            >
              <div className="relative h-8 w-32 sm:h-9 sm:w-36">
                <Image
                  src="/assets/logo.jpeg"
                  alt="Everence SecuraApps logo"
                  fill
                  className="object-contain object-left"
                />
              </div>
            </Link>
            <p className="text-[13px] sm:text-[14px] text-white/90 max-w-sm leading-relaxed">
              Purpose-built cybersecurity products that turn complex technical signals into clearer decisions.
            </p>
            <div className="text-xs text-white/80">
              <p>A development unit of Everence</p>
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h3 className="text-[13px] sm:text-[14px] font-semibold uppercase tracking-wider text-white">
              Products
            </h3>
            <ul className="mt-4 space-y-2.5 text-[13px] sm:text-[14px]">
              {siteConfig.links.products.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-white/90 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[13px] sm:text-[14px] font-semibold uppercase tracking-wider text-white">
              Explore
            </h3>
            <ul className="mt-4 space-y-2.5 text-[13px] sm:text-[14px]">
              {siteConfig.links.explore.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-white/90 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[13px] sm:text-[14px] font-semibold uppercase tracking-wider text-white">
              Everence
            </h3>
            <ul className="mt-4 space-y-2.5 text-[13px] sm:text-[14px]">
              {siteConfig.links.everence.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target={link.href.startsWith("http") ? "_blank" : undefined}
                    rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="text-white/90 hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar with Copyright */}
        <div className="mt-12 border-t border-white/20 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[12px] sm:text-[13px] text-white/80">
          <p>{siteConfig.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
