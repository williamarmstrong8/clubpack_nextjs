import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
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
  title: "ClubPack",
  description: "The all-in-one platform for modern social clubs.",
  icons: {
    icon: [
      { url: "/clubpack-logo-site.png", type: "image/png", sizes: "32x32" },
      { url: "/clubpack-logo-site.png", type: "image/png", sizes: "16x16" },
    ],
    shortcut: "/clubpack-logo-site.png",
    apple: "/clubpack-logo-site.png",
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
        <Analytics />
      </body>
    </html>
  );
}
