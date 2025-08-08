import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import type { Metadata, Viewport } from "next";

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
    default: "ESOES | Home",
    template: "%s | ESOES"
  },
  description: "ESOES - Engineering Students Organization for Environmental Sustainability",
  icons: {
    icon: "/assets/icons/logo.svg",
    shortcut: "/assets/icons/logo.svg",
    apple: "/assets/icons/logo.svg",
  },
  manifest: "/site.webmanifest",
  robots: "index, follow",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning>
      <head>
        <link rel="icon" href="/assets/icons/logo.svg" type="image/svg+xml" />
        <link rel="shortcut icon" href="/assets/icons/logo.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/assets/icons/logo.svg" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black`}
      >
        {children}
      </body>
    </html>
  );
}
