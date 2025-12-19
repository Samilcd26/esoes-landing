import { MetadataRoute } from "next";
import { sanityQuery } from "@/lib/sanity/client";
import { publishedCalendarEventsQuery } from "@/lib/sanity/queries/calendar_events";
import { activeDepartmentsQuery } from "@/lib/sanity/queries/departments";
import { siteConfig } from "@/lib/seo/metadata";

interface CalendarEvent {
  slug: string;
  _updatedAt: string;
}

interface Department {
  slug: string;
  _updatedAt: string;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url;

  // Statik sayfalar
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/home`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/events`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/department`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/calendar`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/gallery`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/hsd`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  // Sanity'den dinamik içerikleri çek
  try {
    // Yayınlanmış etkinlikleri çek
    const events = await sanityQuery<CalendarEvent[]>(
      publishedCalendarEventsQuery
    ).catch(() => []);

    // Aktif departmanları çek
    const departments = await sanityQuery<Department[]>(
      activeDepartmentsQuery
    ).catch(() => []);

    // Etkinlik sayfaları için sitemap entry'leri
    const eventPages: MetadataRoute.Sitemap = events
      .filter((event) => event.slug)
      .map((event) => ({
        url: `${baseUrl}/events/${event.slug}`,
        lastModified: event._updatedAt
          ? new Date(event._updatedAt)
          : new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }));

    // Departman sayfaları için sitemap entry'leri
    const departmentPages: MetadataRoute.Sitemap = departments
      .filter((dept) => dept.slug)
      .map((dept) => ({
        url: `${baseUrl}/department/${dept.slug}`,
        lastModified: dept._updatedAt ? new Date(dept._updatedAt) : new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.7,
      }));

    return [...staticPages, ...eventPages, ...departmentPages];
  } catch (error) {
    // Hata durumunda sadece statik sayfaları döndür
    console.error("Sitemap generation error:", error);
    return staticPages;
  }
}
