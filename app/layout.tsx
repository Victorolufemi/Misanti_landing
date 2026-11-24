import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-display",
});

const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
  variable: "--font-body",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://misanti.agency";
const title = "The Under 1M Media Vendor List · Misanti";
const description =
  "Seven Lagos wedding photographers, videographers and content creators, each priced below ₦1,000,000 — with prices, free dates, portfolios and how to book. Shorten your search from 3 weeks to 1 hour.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  applicationName: "Misanti",
  openGraph: { title, description, url: siteUrl, siteName: "Misanti Agency", locale: "en_NG", type: "website" },
  twitter: { card: "summary_large_image", title, description },
  icons: { icon: "/icon.svg" },
};

export const viewport: Viewport = {
  themeColor: "#FAF6EC",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${jost.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>
        <div className="grain" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
