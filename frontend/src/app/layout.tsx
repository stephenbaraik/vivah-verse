import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { ToastContainer } from "@/components/ui/toast";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#C94A6A',
};

export const metadata: Metadata = {
  title: "Vivah Verse | Your Perfect Wedding, Beautifully Planned",
  description: "Discover stunning venues, talented vendors, and AI-powered planning tools to make your special day truly unforgettable.",
  keywords: ["wedding", "venues", "vendors", "wedding planning", "India"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="overflow-x-hidden">
      <body
        className={`${inter.variable} ${playfair.variable} antialiased overflow-x-hidden w-full`}
      >
        {/* Razorpay checkout script for booking payments */}
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="afterInteractive"
        />
        <div className="overflow-x-hidden w-full max-w-full">
          <Providers>
            {children}
            <ToastContainer />
          </Providers>
        </div>
      </body>
    </html>
  );
}
