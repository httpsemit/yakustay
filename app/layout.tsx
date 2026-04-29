import type { Metadata } from "next";
import { Noto_Serif, Inter } from "next/font/google";
import "./globals.css";
import "../styles/print.css";
import { AuthProvider } from "@/contexts/AuthContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

import FloatingWhatsApp from "@/components/layout/FloatingWhatsApp";
import { Analytics } from "@vercel/analytics/next";

const notoSerif = Noto_Serif({
  subsets:   ["latin"],
  weight:    ["300", "400", "700"],
  style:     ["normal", "italic"],
  variable:  "--font-serif",
  display:   "swap",
  preload:   true,
});

const inter = Inter({
  subsets:  ["latin"],
  weight:   ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
  display:  "swap",
  preload:   true,
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://yakustay.online'),
  title: {
    template: "%s | Chello Yaku Guest House Kimin",
    default:  "Guest House in Kimin & Budget Hotel near North Lakhimpur | Chello Yaku",
  },
  description: "Looking for an affordable stay in Assam? Chello Yaku Guest House in Kimin offers scenic mountain views, peaceful rooms, and easy access from North Lakhimpur Railway Station.",
  keywords: ["budget hotel in North Lakhimpur", "guest house in Kimin", "Rajapukhuri guest house", "hotel near North Lakhimpur railway station", "affordable stay in Assam", "mountain retreat"],
  openGraph: {
    title: "Chello Yaku Guest House | Mountain Retreat",
    description: "Looking for an affordable stay in Assam? Chello Yaku Guest House in Kimin offers scenic mountain views, peaceful rooms, and easy access from North Lakhimpur Railway Station.",
    url: "/",
    siteName: "Chello Yaku Guest House",
    images: [{ url: "/images/hero-1.jpg", width: 1200, height: 630 }],
    locale: "en_IN",
    type: "website",
  },
  // Performance optimizations
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${notoSerif.variable} ${inter.variable}`}>
      <head>
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* DNS prefetch for third-party domains */}
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://vercel.live" />
        
        {/* Material Symbols — icon font, not a page font, safe in <head> */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,300,0,0&display=block"
          rel="stylesheet"
        />
      </head>
      <body className="bg-surface text-on-surface antialiased font-body">
        <AuthProvider>
          <Header />
          <main>{children}</main>
          <Footer />
          <FloatingWhatsApp />
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
