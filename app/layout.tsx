import type { Metadata } from "next";
import { Noto_Serif, Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MaintenanceStrip from "@/components/layout/MaintenanceStrip";
import FloatingWhatsApp from "@/components/layout/FloatingWhatsApp";
import { Analytics } from "@vercel/analytics/next";

const notoSerif = Noto_Serif({
  subsets:   ["latin"],
  weight:    ["300", "400", "700"],
  style:     ["normal", "italic"],
  variable:  "--font-serif",
  display:   "swap",
});

const inter = Inter({
  subsets:  ["latin"],
  weight:   ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
  display:  "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://yakustay.online'),
  title: {
    template: "%s | Chello Yaku Guest House",
    default:  "Chello Yaku Guest House | Mountain Retreat in Kimin",
  },
  description: "Experience warm hospitality at Chello Yaku Guest House, a comfortable retreat located in Kimin, Arunachal Pradesh. Book your stay today.",
  keywords: ["guest house", "Kimin", "Arunachal Pradesh", "retreat", "comfortable stay", "mountain retreat"],
  openGraph: {
    title: "Chello Yaku Guest House | Mountain Retreat",
    description: "Experience warm hospitality at Chello Yaku Guest House, a comfortable retreat located in Kimin, Arunachal Pradesh.",
    url: "/",
    siteName: "Chello Yaku Guest House",
    images: [{ url: "/images/hero-1.jpg", width: 1200, height: 630 }],
    locale: "en_IN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${notoSerif.variable} ${inter.variable}`}>
      <head>
        {/* Material Symbols — icon font, not a page font, safe in <head> */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,300,0,0&display=block"
          rel="stylesheet"
        />
      </head>
      <body className="bg-surface text-on-surface antialiased font-body">
        <AuthProvider>
          <MaintenanceStrip />
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
