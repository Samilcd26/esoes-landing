import { Metadata } from "next";
import { generateSeoMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = generateSeoMetadata({
  title: "Etkinlikler",
  description:
    "ESOES etkinliklerini keşfedin. Eskişehir Osmangazi Üniversitesi'nde düzenlediğimiz workshoplar, konferanslar, teknik etkinlikler ve sosyal aktiviteler hakkında bilgi edinin.",
  path: "/events",
  keywords: [
    "etkinlikler",
    "events",
    "workshop",
    "konferans",
    "teknik etkinlikler",
    "technical events",
    "university workshops",
    "üniversite workshopları",
  ],
});

export default function EventsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
