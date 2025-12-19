import { siteConfig } from "./metadata";

export interface OrganizationSchema {
  "@context": "https://schema.org";
  "@type": "Organization";
  name: string;
  url: string;
  logo: string;
  description: string;
  address: {
    "@type": "PostalAddress";
    addressLocality: string;
    addressRegion: string;
    addressCountry: string;
  };
  contactPoint?: {
    "@type": "ContactPoint";
    contactType: string;
    email?: string;
  };
  sameAs?: string[];
}

export interface EventSchema {
  "@context": "https://schema.org";
  "@type": "Event";
  name: string;
  description: string;
  startDate: string;
  endDate?: string;
  location?: {
    "@type": "Place";
    name: string;
    address?: string;
  };
  organizer?: {
    "@type": "Organization";
    name: string;
    url?: string;
  };
  image?: string;
  eventAttendanceMode?: "https://schema.org/OfflineEventAttendanceMode" | "https://schema.org/OnlineEventAttendanceMode";
  eventStatus?: "https://schema.org/EventScheduled";
}

export interface FAQPageSchema {
  "@context": "https://schema.org";
  "@type": "FAQPage";
  mainEntity: Array<{
    "@type": "Question";
    name: string;
    acceptedAnswer: {
      "@type": "Answer";
      text: string;
    };
  }>;
}

export interface BreadcrumbListSchema {
  "@context": "https://schema.org";
  "@type": "BreadcrumbList";
  itemListElement: Array<{
    "@type": "ListItem";
    position: number;
    name: string;
    item: string;
  }>;
}

/**
 * Organization schema oluşturur
 */
export function generateOrganizationSchema(
  overrides?: Partial<OrganizationSchema>
): OrganizationSchema {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.organization.name,
    url: siteConfig.organization.url,
    logo: siteConfig.organization.logo,
    description: siteConfig.description,
    address: {
      "@type": "PostalAddress",
      addressLocality: siteConfig.organization.address.addressLocality,
      addressRegion: siteConfig.organization.address.addressRegion,
      addressCountry: siteConfig.organization.address.addressCountry,
    },
    ...overrides,
  };
}

/**
 * Event schema oluşturur
 */
export function generateEventSchema(params: {
  name: string;
  description: string;
  startDate: string;
  endDate?: string;
  location?: string;
  locationName?: string;
  image?: string;
  organizerName?: string;
  organizerUrl?: string;
}): EventSchema {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: params.name,
    description: params.description,
    startDate: params.startDate,
    endDate: params.endDate,
    location: params.locationName
      ? {
          "@type": "Place",
          name: params.locationName,
          address: params.location,
        }
      : undefined,
    organizer: {
      "@type": "Organization",
      name: params.organizerName || siteConfig.organization.name,
      url: params.organizerUrl || siteConfig.organization.url,
    },
    image: params.image,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
  };
}

/**
 * FAQPage schema oluşturur
 */
export function generateFAQPageSchema(
  faqs: Array<{ question: string; answer: string }>
): FAQPageSchema {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

/**
 * BreadcrumbList schema oluşturur
 */
export function generateBreadcrumbSchema(
  items: Array<{ name: string; url: string }>
): BreadcrumbListSchema {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
