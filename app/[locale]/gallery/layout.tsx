import { getTranslations } from 'next-intl/server';
import { Metadata } from "next";

export async function generateMetadata({}: {params: Promise<{locale: string}>}): Promise<Metadata> {
  const t = await getTranslations('galleryLayout');
 
  return {
    title: t('title'),
    description: t('description'),
  };
}

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
