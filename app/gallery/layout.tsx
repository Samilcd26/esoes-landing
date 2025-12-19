import { Metadata } from "next";
import { generateSeoMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = generateSeoMetadata({
  title: "Galeri",
  description:
    "ESOES galeri - Etkinliklerimizden, workshoplarımızdan ve aktivitelerimizden kareler. Geçmiş etkinliklerimizin fotoğraf ve videolarını keşfedin.",
  path: "/gallery",
  keywords: [
    "galeri",
    "gallery",
    "etkinlik fotoğrafları",
    "event photos",
    "workshop görselleri",
    "workshop images",
    "aktiviteler",
    "activities",
  ],
});

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
