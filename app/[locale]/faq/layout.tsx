import { getTranslations } from 'next-intl/server';
import { Metadata } from "next";

export async function generateMetadata({}: {params: Promise<{locale: string}>}): Promise<Metadata> {
  const t = await getTranslations('faqLayout');
 
  return {
    title: t('title'),
    description: t('description'),
    keywords: t('keywords').split(', '),
  };
}

export default async function FaqLayout({
  children,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  return children;
}
