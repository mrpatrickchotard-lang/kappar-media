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
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-[#08080a]">
        <Header />
        <main className="pt-20">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
