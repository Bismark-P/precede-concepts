import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.precedeconcepts.com"),
  title: {
    default: "Precede Concepts | The Standard of Execution",
    template: "%s | Precede Concepts",
  },
  description: "Move Ahead, Stay Ahead. We operate a dual-purpose ecosystem delivering high-quality digital, administrative, and development services.",
  keywords: [
    "Precede Concepts",
    "Digital Agency",
    "Business Registration",
    "Tech Innovation",
    "Opportunity Hub",
    "Ghana"
  ],
  openGraph: {
    title: "Precede Concepts",
    description: "Move Ahead, Stay Ahead. The Standard of Execution.",
    url: "https://www.precedeconcepts.com",
    siteName: "Precede Concepts",
    images: [
      {
        url: "/og-image.jpg", // Put an image named og-image.jpg in your public folder
        width: 1200,
        height: 630,
        alt: "Precede Concepts Ecosystem Banner",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Precede Concepts",
    description: "Move Ahead, Stay Ahead. The Standard of Execution.",
    images: ["/logo-jpg.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}