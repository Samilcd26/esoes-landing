import {  sanityQuery } from '../sanity/client';
import { 
  publishedEventArchiveQuery, 
  allEventArchiveQuery, 
  eventArchiveBySlugQuery,
  searchEventArchiveQuery,
  searchAllEventArchiveQuery,
  eventArchiveByCategoryQuery,
  eventArchiveByYearQuery
} from '../sanity/queries/event_archive';
import { EventArchive, PaginationParams, PaginatedResponse } from '../types/api';

export const sanityEventArchiveService = {
  // Tüm yayınlanmış arşiv eventleri getir
  async getEventArchives(params?: PaginationParams): Promise<PaginatedResponse<EventArchive>> {
    const events = await sanityQuery<EventArchive[]>(publishedEventArchiveQuery);
    
    // Pagination işlemi
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedEvents = events.slice(startIndex, endIndex);

    return {
      data: paginatedEvents,
      pagination: {
        page,
        limit,
        total: events.length,
        totalPages: Math.ceil(events.length / limit)
      }
    };
  },

  // ADMIN: Tüm arşiv eventleri getir
  async getAllEventArchives(params?: PaginationParams): Promise<PaginatedResponse<EventArchive>> {
    const events = await sanityQuery<EventArchive[]>(allEventArchiveQuery);
    
    // Pagination işlemi
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedEvents = events.slice(startIndex, endIndex);

    return {
      data: paginatedEvents,
      pagination: {
        page,
        limit,
        total: events.length,
        totalPages: Math.ceil(events.length / limit)
      }
    };
  },

  // Tek bir arşiv event getir
  async getEventArchive(slug: string): Promise<EventArchive> {
    const event = await sanityQuery<EventArchive>(eventArchiveBySlugQuery, { slug });
    if (!event) throw new Error('Event archive not found');
    return event;
  },

  // Arşiv event arama
  async searchEventArchives(query: string, params?: PaginationParams): Promise<PaginatedResponse<EventArchive>> {
    const events = await sanityQuery<EventArchive[]>(searchEventArchiveQuery, { query });
    
    // Pagination işlemi
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedEvents = events.slice(startIndex, endIndex);

    return {
      data: paginatedEvents,
      pagination: {
        page,
        limit,
        total: events.length,
        totalPages: Math.ceil(events.length / limit)
      }
    };
  },

  // ADMIN: Arşiv event arama
  async searchAllEventArchives(query: string, params?: PaginationParams): Promise<PaginatedResponse<EventArchive>> {
    const events = await sanityQuery<EventArchive[]>(searchAllEventArchiveQuery, { query });
    
    // Pagination işlemi
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedEvents = events.slice(startIndex, endIndex);

    return {
      data: paginatedEvents,
      pagination: {
        page,
        limit,
        total: events.length,
        totalPages: Math.ceil(events.length / limit)
      }
    };
  },

  // Kategoriye göre arşiv eventler
  async getEventArchivesByCategory(category: string): Promise<EventArchive[]> {
    const events = await sanityQuery<EventArchive[]>(eventArchiveByCategoryQuery, { category });
    return events;
  },

  // Belirli bir yıldaki arşiv eventler
  async getEventArchivesByYear(year: number): Promise<EventArchive[]> {
    const events = await sanityQuery<EventArchive[]>(eventArchiveByYearQuery, { year });
    return events;
  },

  // En son arşiv eventleri getir (limit ile)
  async getRecentEventArchives(limit: number = 5): Promise<EventArchive[]> {
    const events = await sanityQuery<EventArchive[]>(publishedEventArchiveQuery);
    return events.slice(0, limit);
  },

  // Medya kaynakları olan arşiv eventleri getir
  async getEventArchivesWithMedia(): Promise<EventArchive[]> {
    const events = await sanityQuery<EventArchive[]>(publishedEventArchiveQuery);
    return events.filter(event => event.mediaResources && event.mediaResources.length > 0);
  },
};
