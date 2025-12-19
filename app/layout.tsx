import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppContent } from "./app-content";
import { generateSeoMetadata, siteConfig } from "@/lib/seo/metadata";
import { generateOrganizationSchema } from "@/lib/seo/structured-data";
import { StructuredData } from "@/components/seo/structured-data";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  ...generateSeoMetadata({
    title: "ESOES",
    description:
      "ESOES - Eskişehir Mühendislik Öğrencileri Çevre Sürdürülebilirliği Topluluğu. Eskişehir Osmangazi Üniversitesi'nde çevre ve sürdürülebilirlik konularında faaliyet gösteren öğrenci topluluğu.",
    keywords: [
      "Eskişehir üniversite etkinlikleri",
      "university events",
      "student community",
      "öğrenci topluluğu",
    ],
  }),
  title: {
    default: "ESOES",
    template: "ESOES - %s",
  },
  icons: {
    icon: "/assets/icons/logo.svg",
    shortcut: "/assets/icons/logo.svg",
    apple: "/assets/icons/logo.svg",
  },
  applicationName: siteConfig.name,
  category: "education",
  classification: "Student Organization",
  verification: {
    google: "l5GxFnGavKEcpODbrKOulQVqh_V-e6fzbAw7X2SQsk0",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationSchema = generateOrganizationSchema();

  return (
    <html lang="tr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <StructuredData data={organizationSchema} />
        <AppContent>{children}</AppContent>
      </body>
    </html>
  );
}
