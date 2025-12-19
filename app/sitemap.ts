import { MetadataRoute } from "next";
import { sanityQuery } from "@/lib/sanity/client";
import { publishedCalendarEventsQuery } from "@/lib/sanity/queries/calendar_events";
import { activeDepartmentsQuery } from "@/lib/sanity/queries/departments";
import { siteConfig } from "@/lib/seo/metadata";

interface CalendarEvent {
  slug?: string | null;
  _updatedAt?: string;
}

interface Department {
  slug?: string | null;
  _updatedAt?: string;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url;
  const now = new Date();

  // Statik sayfalar
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/home`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/events`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/department`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/calendar`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/gallery`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/hsd`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  // Sanity'den dinamik içerikleri çek
  let eventPages: MetadataRoute.Sitemap = [];
  let departmentPages: MetadataRoute.Sitemap = [];

  try {
    // Yayınlanmış etkinlikleri çek
    const events = await sanityQuery<CalendarEvent[]>(
      publishedCalendarEventsQuery
    ).catch((error) => {
      console.error("Error fetching events for sitemap:", error);
      return [];
    });

    // Etkinlik sayfaları için sitemap entry'leri (sadece slug'ı olanlar)
    if (Array.isArray(events)) {
      eventPages = events
        .filter((event) => event?.slug && typeof event.slug === "string" && event.slug.trim() !== "")
        .map((event) => ({
          url: `${baseUrl}/events/${event.slug}`,
          lastModified: event._updatedAt
            ? new Date(event._updatedAt)
            : now,
          changeFrequency: "weekly" as const,
          priority: 0.8,
        }));
    }

    // Aktif departmanları çek
    const departments = await sanityQuery<Department[]>(
      activeDepartmentsQuery
    ).catch((error) => {
      console.error("Error fetching departments for sitemap:", error);
      return [];
    });

    // Departman sayfaları için sitemap entry'leri (sadece slug'ı olanlar)
    if (Array.isArray(departments)) {
      departmentPages = departments
        .filter((dept) => dept?.slug && typeof dept.slug === "string" && dept.slug.trim() !== "")
        .map((dept) => ({
          url: `${baseUrl}/department/${dept.slug}`,
          lastModified: dept._updatedAt ? new Date(dept._updatedAt) : now,
          changeFrequency: "monthly" as const,
          priority: 0.7,
        }));
    }
  } catch (error) {
    // Hata durumunda sadece statik sayfaları döndür
    console.error("Sitemap generation error:", error);
  }

  return [...staticPages, ...eventPages, ...departmentPages];
}
