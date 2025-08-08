import {  sanityQuery } from '../sanity/client';
import { 
  publishedCalendarEventsQuery, 
  allCalendarEventsQuery, 
  calendarEventBySlugQuery,
  searchCalendarEventsQuery,
  searchAllCalendarEventsQuery,
  calendarEventsByCategoryQuery
} from '../sanity/queries/calendar_events';
import { CalendarEvent, PaginationParams, PaginatedResponse } from '../types/api';

export const sanityCalendarEventService = {
  // Tüm yayınlanmış calendar eventleri getir
  async getCalendarEvents(params?: PaginationParams): Promise<PaginatedResponse<CalendarEvent>> {
    const events = await sanityQuery<CalendarEvent[]>(publishedCalendarEventsQuery);
    
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

  // ADMIN: Tüm calendar eventleri getir
  async getAllCalendarEvents(params?: PaginationParams): Promise<PaginatedResponse<CalendarEvent>> {
    const events = await sanityQuery<CalendarEvent[]>(allCalendarEventsQuery);
    
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

  // Takvim için calendar eventleri getir
  async getCalendarEventsForCalendar(): Promise<CalendarEvent[]> {
    const events = await sanityQuery<CalendarEvent[]>(publishedCalendarEventsQuery);
    return events;
  },

  // ADMIN: Takvim için tüm calendar eventleri getir
  async getAllCalendarEventsForCalendar(): Promise<CalendarEvent[]> {
    const events = await sanityQuery<CalendarEvent[]>(allCalendarEventsQuery);
    return events;
  },

  // Tek bir calendar event getir
  async getCalendarEvent(slug: string): Promise<CalendarEvent> {
    const event = await sanityQuery<CalendarEvent>(calendarEventBySlugQuery, { slug });
    if (!event) throw new Error('Calendar event not found');
    return event;
  },

  // Calendar event arama
  async searchCalendarEvents(query: string, params?: PaginationParams): Promise<PaginatedResponse<CalendarEvent>> {
    const events = await sanityQuery<CalendarEvent[]>(searchCalendarEventsQuery, { query });
    
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

  // ADMIN: Calendar event arama
  async searchAllCalendarEvents(query: string, params?: PaginationParams): Promise<PaginatedResponse<CalendarEvent>> {
    const events = await sanityQuery<CalendarEvent[]>(searchAllCalendarEventsQuery, { query });
    
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

  // Kategoriye göre calendar eventler
  async getCalendarEventsByCategory(category: string): Promise<CalendarEvent[]> {
    const events = await sanityQuery<CalendarEvent[]>(calendarEventsByCategoryQuery, { category });
    return events;
  },
};
