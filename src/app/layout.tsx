import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { organizationJsonLd, websiteJsonLd } from "@/lib/jsonld";

export const metadata: Metadata = {
  metadataBase: new URL('https://kappar.tv'),
  title: {
    default: "Kappar Media | Forward Media for Business Leaders",
    template: "%s | Kappar Media",
  },
  description: "Where business leaders find their edge. Insights, interviews, and expert perspectives from Dubai to the world.",
  keywords: ["business", "media", "fintech", "technology", "dubai", "MENA", "interviews", "expert insights", "consulting", "events"],
  authors: [{ name: "Kappar Media" }],
  openGraph: {
    title: "Kappar Media | Forward Media for Business Leaders",
    description: "Where business leaders find their edge. Insights, interviews, and expert perspectives from Dubai to the world.",
    type: "website",
    locale: "en_US",
    siteName: "Kappar Media",
    url: "https://kappar.tv",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kappar Media | Forward Media for Business Leaders",
    description: "Where business leaders find their edge.",
    creator: "@kappartv",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: "https://kappar.tv",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            try {
              var saved = localStorage.getItem('kappar-theme');
              var theme = saved || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
              document.documentElement.setAttribute('data-theme', theme);
            } catch(e) {}
          })();
        `}} />
      </head>
      <body className="antialiased min-h-screen" suppressHydrationWarning style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd()) }}
        />
        <Header />
        <main>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
