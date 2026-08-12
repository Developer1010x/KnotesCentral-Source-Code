import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { Notice } from "@/components/Notice";
import { SiteFooter } from "@/components/SiteFooter";
import { InstallApp } from "@/components/InstallApp";
import { ThemeProvider } from "@/components/ThemeProvider";
import { THEME_INIT_SCRIPT } from "@/lib/theme";
import { SITE } from "@/lib/site";
import { JsonLd, siteLd } from "@/components/StructuredData";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — RVCE notes, labs and question papers`,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.description,
  keywords: [
    "RVCE",
    "RV College of Engineering",
    "notes",
    "question papers",
    "lab manuals",
    "VTU",
    "study material",
  ],
  openGraph: {
    type: "website",
    siteName: SITE.name,
    title: `${SITE.name} — RVCE notes, labs and question papers`,
    description: SITE.description,
  },
  twitter: { card: "summary_large_image" },
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: SITE.name, statusBarStyle: "default" },
  icons: { apple: "/apple-icon.png" },
  alternates: { types: { "application/rss+xml": "/feed.xml" } },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#020617" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <JsonLd data={siteLd()} />
      </head>
      <body className={`${inter.className} flex min-h-screen flex-col`}>
        <ThemeProvider>
          <SiteHeader />
          <Notice />
          <main id="main" className="container flex-1 py-8 sm:py-10">
            {children}
          </main>
          <div className="container pb-4">
            <InstallApp />
          </div>
          <SiteFooter />
        </ThemeProvider>
      </body>
    </html>
  );
}
