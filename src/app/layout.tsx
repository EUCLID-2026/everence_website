import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#FF6700",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://everence-securaapps.com"),
  title: {
    default: "Everence SecuraApps | Security intelligence, engineered",
    template: "%s | Everence SecuraApps",
  },
  description:
    "Everence SecuraApps builds focused cybersecurity products for Android app security, Bitcoin wallet intelligence, and cloud and post-quantum readiness.",
  keywords: [
    "cybersecurity",
    "Android app security",
    "OWASP MASVS",
    "Bitcoin wallet intelligence",
    "cloud security",
    "post-quantum cryptography",
    "DroidScan",
    "ChainBreak",
    "WebStrike",
    "Everence",
  ],
  authors: [{ name: "Everence SecuraApps" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://everence-securaapps.com",
    title: "Everence SecuraApps | Security intelligence, engineered",
    description:
      "Everence SecuraApps builds focused cybersecurity products for Android app security, Bitcoin wallet intelligence, and cloud and post-quantum readiness.",
    siteName: "Everence SecuraApps",
    images: [
      {
        url: "/assets/everence-securaapps-logo.png",
        width: 164,
        height: 62,
        alt: "Everence SecuraApps logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Everence SecuraApps | Security intelligence, engineered",
    description:
      "Everence SecuraApps builds focused cybersecurity products for Android app security, Bitcoin wallet intelligence, and cloud and post-quantum readiness.",
    images: ["/assets/everence-securaapps-logo.png"],
  },
  icons: {
    icon: "/assets/logo.png",
    shortcut: "/assets/logo.png",
    apple: "/assets/logo.png",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className="min-h-screen bg-white text-slate-900 antialiased selection:bg-[#FF6700] selection:text-white"
        style={{ fontFamily: "var(--font-campton), Arial, Helvetica, sans-serif" }}
      >
        {children}
      </body>
    </html>
  );
}
