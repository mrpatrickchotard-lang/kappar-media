import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Kappar Media | Forward Media for Business Leaders",
  description: "Where business leaders find their edge. Insights, interviews, and expert perspectives from Dubai to the world.",
  keywords: ["business", "media", "fintech", "technology", "dubai", "interviews", "expert insights"],
  authors: [{ name: "Kappar Media" }],
  openGraph: {
    title: "Kappar Media | Forward Media for Business Leaders",
    description: "Where business leaders find their edge. Insights, interviews, and expert perspectives from Dubai to the world.",
    type: "website",
    locale: "en_US",
    siteName: "Kappar Media",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kappar Media | Forward Media for Business Leaders",
    description: "Where business leaders find their edge.",
  },
  robots: {
    index: true,
    follow: true,
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
        <Header />
        <main>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
