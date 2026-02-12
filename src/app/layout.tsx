import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: {
    default: "Darul Raza - Islamic Donations & Zakat",
    template: "%s | Darul Raza"
  },
  description: "Make Sadaqah, Zakat, and general donations for masjids, madrasas, food distribution, and helping poor families in Pakistan.",
  keywords: ["charity", "donation", "zakat", "sadaqah", "islamic charity", "pakistan"],
  authors: [{ name: "Darul Raza" }],
  creator: "Darul Raza",
  publisher: "Darul Raza",
  openGraph: {
    title: "Darul Raza - Islamic Donations",
    description: "Donate for Islamic causes. Support masjids, madrasas, and families in need.",
    url: process.env.CHARITY_WEBSITE,
    siteName: "Darul Raza",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_PK",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Darul Raza - Islamic Donations",
    description: "Donate for Islamic causes. Support masjids, madrasas, and families in need.",
    images: ["/twitter-image.jpg"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-icon.png",
  },
  manifest: "/site.webmanifest",
  themeColor: "#667eea",
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  alternates: {
    canonical: process.env.CHARITY_WEBSITE,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="outfit antialiased">
        {/* Toaster must be self-closing */}
        <Toaster />
        
        {children}
      </body>
    </html>
  );
}
