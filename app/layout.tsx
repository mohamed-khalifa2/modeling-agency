import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { Toaster } from "sonner";
import { getHero } from "@/lib/hero";
import { getSiteSettings } from "@/lib/site-settings";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const DEFAULT_AGENCY_NAME = "Lumina Model Management";

export async function generateMetadata(): Promise<Metadata> {
  const [settings, hero] = await Promise.all([getSiteSettings(), getHero()]);

  const agencyName = settings?.agency_name || DEFAULT_AGENCY_NAME;
  const title = settings?.seo_title || agencyName;
  const description =
    settings?.seo_description ||
    settings?.tagline ||
    "Modeling agency showcase.";
  const ogImage = hero?.background_image_url || settings?.logo_url || null;

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: title,
      template: `%s | ${agencyName}`,
    },
    description,
    openGraph: {
      type: "website",
      siteName: agencyName,
      title,
      description,
      url: SITE_URL,
      ...(ogImage
        ? { images: [{ url: ogImage, width: 1920, height: 1080, alt: agencyName }] }
        : {}),
    },
    twitter: {
      card: ogImage ? "summary_large_image" : "summary",
      title,
      description,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  };
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <noscript>
          <style>{`[data-fade]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        {children}
        <Toaster position="bottom-right" closeButton />
      </body>
    </html>
  );
}
