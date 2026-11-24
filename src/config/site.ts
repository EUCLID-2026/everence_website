/**
 * Site Configuration & Content Registry
 * Intent: Maintain all company details, contact information, navigation structures,
 * and product definitions in ONE centralized place per project rules.
 * Assumptions:
 * - Contact person is Mr Pramod Prabhakar as defined in COPY.md.
 * - Team email is handled on server side and not directly exposed to client scrapers.
 */

export interface ProductItem {
  id: string;
  name: string;
  category: string;
  symbol: string;
  tagline: string;
  description: string;
  bullets: string[];
  pageHref: string;
  pdfHref: string;
  pdfLabel: string;
}

export const siteConfig = {
  name: "Everence SecuraApps",
  tagline: "Security intelligence, engineered",
  description:
    "Everence SecuraApps builds focused cybersecurity products for Android app security, Bitcoin wallet intelligence, and cloud and post-quantum readiness.",
  unitOf: {
    label: "A development unit of Everence",
    url: "https://www.everence.io/explore",
  },
  contact: {
    person: "Mr Pramod Prabhakar",
    email: "Pramod.Prabhakar@everence.io",
    phone: "+91 99203 14006",
    displayPhone: "+91 99203 14006",
    availabilityNote:
      "Product details and availability can be discussed directly with the team.",
  },
  nav: [
    { label: "Products", href: "/#products" },
    { label: "Our approach", href: "/#approach" },
    { label: "Resources", href: "/resources" },
    { label: "About", href: "/#about" },
  ],
  cta: {
    label: "Request a demo",
    href: "/#contact",
  },
  products: [
    {
      id: "droidscan",
      name: "DroidScan",
      category: "MOBILE APPSEC",
      symbol: "⌘",
      tagline: "Uncover the truth hidden inside Android apps.",
      description:
        "Inspect application packages, map findings to security standards, and compare builds to identify meaningful changes.",
      bullets: [
        "OWASP MASVS-aligned security findings",
        "In-browser code inspection",
        "App profiling and version comparison",
      ],
      pageHref: "/products/droidscan",
      pdfHref: "/resources/droidscan-product-one-pager.pdf",
      pdfLabel: "PDF · PRODUCT ONE-PAGER",
    },
    {
      id: "chainbreak",
      name: "ChainBreak",
      category: "WALLET INTELLIGENCE",
      symbol: "⛓",
      tagline: "Understand behaviour behind a Bitcoin wallet.",
      description:
        "Turn transaction history into a searchable profile, visual analytics and a professional report.",
      bullets: [
        "Wallet profile and transaction ledger",
        "Time- and volume-based analysis",
        "Visualisations and report generation",
      ],
      pageHref: "/products/chainbreak",
      pdfHref: "/resources/chainbreak-product-one-pager.pdf",
      pdfLabel: "PDF · PRODUCT ONE-PAGER",
    },
    {
      id: "webstrike",
      name: "WebStrike",
      category: "WEBSITE DEFENCE",
      symbol: "⚡",
      tagline: "Understand the security behind every website you own.",
      description:
        "WebStrike turns complex vulnerability tests, uptime tracking, and visual alterations into one clear security scorecard - 24/7 defacement sentinel, perimeter audit, real-time alerts, and professional executive reports.",
      bullets: [
        "24/7 defacement & downtime sentinel",
        "Perimeter, port & misconfiguration audit",
        "Phishing website detection & executive reports",
      ],
      pageHref: "/products/webstrike",
      pdfHref: "/resources/webstrike-product-one-pager.pdf",
      pdfLabel: "PDF · PRODUCT ONE-PAGER",
    },
  ] as ProductItem[],
  links: {
    products: [
      { label: "DroidScan", href: "/products/droidscan" },
      { label: "ChainBreak", href: "/products/chainbreak" },
      { label: "WebStrike", href: "/products/webstrike" },
    ],
    explore: [
      { label: "Resources", href: "/resources" },
      { label: "About SecuraApps", href: "/#about" },
      { label: "Contact", href: "/#contact" },
    ],
    everence: [
      { label: "Everence website", href: "https://www.everence.io/explore" },
      { label: "Email the team", href: "/#contact" },
    ],
  },
  copyright: `© ${new Date().getFullYear()} Everence SecuraApps Pvt. Ltd. All rights reserved.`,
};

