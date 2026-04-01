import type { Metadata } from "next";
import { Noto_Serif, Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

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
  title: {
    template: "%s | Grand Haven Hotel",
    default:  "Grand Haven Hotel | Luxury Mountain Retreat in Bhalukpong",
  },
  description: "Experience luxury and serenity at Grand Haven Hotel, a premier boutique resort located on the Assam-Arunachal border. Book your stay today.",
  keywords: ["hotel", "Bhalukpong", "Assam", "Arunachal Pradesh", "resort", "luxury stay", "mountain retreat"],
  openGraph: {
    title: "Grand Haven Hotel | Luxury Mountain Retreat",
    description: "Experience luxury and serenity at Grand Haven Hotel, a premier boutique resort located on the Assam-Arunachal border.",
    url: "https://grandhaven.vercel.app",
    siteName: "Grand Haven Hotel",
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
          <Header />
          <main>{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
