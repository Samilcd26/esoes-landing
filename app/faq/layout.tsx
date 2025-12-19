import { Metadata } from "next";
import { generateSeoMetadata } from "@/lib/seo/metadata";
import { generateFAQPageSchema } from "@/lib/seo/structured-data";
import { StructuredData } from "@/components/seo/structured-data";
import { sanityQuery } from "@/lib/sanity/client";
import { activeFaqsQuery } from "@/lib/sanity/queries/faqs";

export const metadata: Metadata = generateSeoMetadata({
  title: "Sık Sorulan Sorular",
  description:
    "ESOES hakkında sık sorulan sorular. Topluluğumuza katılım, etkinlikler, departmanlar ve genel sorularınızın cevaplarını burada bulabilirsiniz.",
  path: "/faq",
  keywords: [
    "SSS",
    "FAQ",
    "sık sorulan sorular",
    "frequently asked questions",
    "ESOES hakkında",
    "about ESOES",
    "topluluk bilgileri",
    "community information",
  ],
});

interface FAQ {
  question: string;
  answer: string;
}

export default async function FaqLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // FAQ verilerini server-side'da çek
  const faqs = await sanityQuery<FAQ[]>(activeFaqsQuery).catch(() => []);

  // FAQ schema oluştur
  const faqSchema = generateFAQPageSchema(
    faqs.map((faq) => ({
      question: faq.question,
      answer: faq.answer,
    }))
  );

  return (
    <>
      <StructuredData data={faqSchema} />
      {children}
    </>
  );
}
