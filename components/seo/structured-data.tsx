import Script from "next/script";
import {
  OrganizationSchema,
  EventSchema,
  FAQPageSchema,
  BreadcrumbListSchema,
} from "@/lib/seo/structured-data";

interface StructuredDataProps {
  data:
    | OrganizationSchema
    | EventSchema
    | FAQPageSchema
    | BreadcrumbListSchema
    | Array<
        | OrganizationSchema
        | EventSchema
        | FAQPageSchema
        | BreadcrumbListSchema
      >;
}

/**
 * Structured data (JSON-LD) component'i
 * Schema.org formatında structured data ekler
 */
export function StructuredData({ data }: StructuredDataProps) {
  const jsonLd = Array.isArray(data) ? data : [data];

  return (
    <>
      {jsonLd.map((schema, index) => (
        <Script
          key={index}
          id={`structured-data-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}
