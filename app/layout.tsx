import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { CartProvider } from "@/contexts/CartContext";
import CartDrawer from "@/components/shared/CartDrawer";
import CookieConsent from "@/components/shared/CookieConsent";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Anagha Innovation | Green Energy & EV Technology",
    template: "%s | Anagha Innovation",
  },
  description:
    "Anagha Innovation is a cutting-edge green energy and electric vehicle technology startup focused on sustainable power solutions, smart charging systems, and advanced motor technologies.",
  keywords: [
    "EV technology",
    "green energy",
    "electric vehicle",
    "solar charging",
    "BLDC motor",
    "power electronics",
    "IoT",
    "battery management",
  ],
  authors: [{ name: "Anagha Innovation" }],
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Anagha Innovation",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <CartProvider>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: {
                  background: "var(--card)",
                  color: "var(--foreground)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius)",
                  fontSize: "0.875rem",
                },
              }}
            />
            <CartDrawer />
            {children}
            <CookieConsent />
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
