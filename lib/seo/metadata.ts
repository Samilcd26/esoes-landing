import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://esoes.org";
const siteName = "ESOES";
const defaultOgImage = `${siteUrl}/assets/images/esoes-logo.jpg`;

export interface SeoMetadataParams {
  title: string;
  description: string;
  path?: string;
  ogImage?: string;
  keywords?: string[];
  noindex?: boolean;
  nofollow?: boolean;
}

/**
 * Kapsamlı SEO metadata objesi oluşturur
 * Open Graph, Twitter Card ve diğer SEO taglarını içerir
 */
export function generateSeoMetadata({
  title,
  description,
  path = "",
  ogImage = defaultOgImage,
  keywords = [],
  noindex = false,
  nofollow = false,
}: SeoMetadataParams): Metadata {
  const url = path ? `${siteUrl}${path}` : siteUrl;
  const fullTitle = path ? `${siteName} - ${title}` : title;

  // Temel keywords'e her zaman ESOES ve ilgili keyword'leri ekle
  const defaultKeywords = [
    "ESOES",
    "Eskişehir Osmangazi Üniversitesi",
    "Öğrenci klübü",
    "Mühendislik öğrencileri",
    "Çevre sürdürülebilirliği",
    "Eskisehir Osmangazi University",
    "Student club",
    "Engineering students",
    "Environmental sustainability",
  ];

  const allKeywords = [...new Set([...defaultKeywords, ...keywords])];

  return {
    title: fullTitle,
    description,
    keywords: allKeywords,
    authors: [{ name: siteName }],
    creator: siteName,
    publisher: siteName,
    robots: {
      index: !noindex,
      follow: !nofollow,
      googleBot: {
        index: !noindex,
        follow: !nofollow,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      type: "website",
      locale: "tr_TR",
      url,
      siteName,
      title: fullTitle,
      description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [ogImage],
      creator: "@esoes",
    },
    alternates: {
      canonical: url,
    },
    metadataBase: new URL(siteUrl),
  };
}

/**
 * Ana sayfa için metadata
 */
export const homeMetadata: Metadata = generateSeoMetadata({
  title: "Ana Sayfa",
  description:
    "ESOES - Eskişehir Mühendislik Öğrencileri Çevre Sürdürülebilirliği Topluluğu. Eskişehir Osmangazi Üniversitesi'nde çevre ve sürdürülebilirlik konularında faaliyet gösteren öğrenci topluluğu.",
  path: "/home",
  keywords: [
    "ana sayfa",
    "homepage",
    "Eskişehir üniversite etkinlikleri",
    "university events",
  ],
});

/**
 * Site bilgileri
 */
export const siteConfig = {
  name: siteName,
  url: siteUrl,
  description:
    "Eskişehir Mühendislik Öğrencileri Çevre Sürdürülebilirliği Topluluğu",
  ogImage: defaultOgImage,
  locale: "tr_TR",
  organization: {
    name: "ESOES",
    url: siteUrl,
    logo: `${siteUrl}/assets/icons/logo.svg`,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Eskişehir",
      addressRegion: "Eskişehir",
      addressCountry: "TR",
    },
  },
};
