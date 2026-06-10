import type { Metadata } from "next";
import { Poppins, Inter, Nunito } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { site } from "@/lib/site";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — PM Coaching, Resources & AI-era Career Guidance`,
    template: `%s · ${site.name}`,
  },
  description: site.tagline,
  keywords: [
    "Product Management Coaching",
    "PM Career Coach",
    "PM Interview Prep",
    "Product Manager Career Advice",
    "Break Into Product Management",
    "PM Internship Resources",
  ],
  authors: [{ name: site.founder }],
  openGraph: {
    type: "website",
    url: site.url,
    title: `${site.name} — Launch Your Product Management Career`,
    description: site.tagline,
    siteName: site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name}`,
    description: site.tagline,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${poppins.variable} ${inter.variable} ${nunito.variable} h-full antialiased`}
    >
      <body className="bg-aurora flex min-h-full flex-col text-charcoal">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
