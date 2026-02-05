import { Metadata } from "next";
import { generateSeoMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = generateSeoMetadata({
  title: "Ana Sayfa",
  description:
    "ESOES ana sayfası - Engineering Society of Eskişehir'e hoş geldiniz. Etkinliklerimizi, projelerimizi ve faaliyetlerimizi keşfedin.",
  path: "/home",
  keywords: [
    "ana sayfa",
    "homepage",
    "Eskişehir üniversite etkinlikleri",
    "university events",
    "topluluk etkinlikleri",
    "community events",
  ],
});

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
