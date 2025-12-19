import { sanityQuery } from '../sanity/client';
import {
  allCalendarEventsQuery,
  calendarEventBySlugQuery,
  calendarEventsByCategoryQuery,
  publishedCalendarEventsQuery,
  searchAllCalendarEventsQuery,
  searchCalendarEventsQuery
} from '../sanity/queries/calendar_events';
import { CalendarEvents, PaginatedResponse, PaginationParams } from '../types/api';

// Helper function for paginated queries
async function getPaginatedResults(
  baseQuery: string,
  params: PaginationParams = {},
  queryParams: Record<string, string | number> = {}
): Promise<PaginatedResponse<CalendarEvents>> {
  const page = params.page || 1;
  const limit = params.limit || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  // Extract the filter part of the query, which is between `[` and `]`
  const filterMatch = baseQuery.match(/(\*\[.*?\])/);
  if (!filterMatch) {
    throw new Error('Invalid query for pagination');
  }
  const baseFilter = filterMatch[1];

  const dataQuery = `${baseQuery} [${startIndex}...${endIndex}]`;
  const totalQuery = `count(${baseFilter})`;

  const [data, total] = await Promise.all([
    sanityQuery<CalendarEvents[]>(dataQuery, queryParams),
    sanityQuery<number>(totalQuery, queryParams)
  ]);

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
}

export const sanityCalendarEventService = {
  // Tüm yayınlanmış calendar eventleri getir
  async getCalendarEvents(params?: PaginationParams): Promise<PaginatedResponse<CalendarEvents>> {
    const baseQuery = publishedCalendarEventsQuery.replace('{', '').replace('}', '');
    return getPaginatedResults(baseQuery, params);
  },

  // ADMIN: Tüm calendar eventleri getir
  async getAllCalendarEvents(params?: PaginationParams): Promise<PaginatedResponse<CalendarEvents>> {
    const baseQuery = allCalendarEventsQuery.replace('{', '').replace('}', '');
    return getPaginatedResults(baseQuery, params);
  },

  // Takvim için calendar eventleri getir
  async getCalendarEventsForCalendar(): Promise<CalendarEvents[]> {
    const events = await sanityQuery<CalendarEvents[]>(publishedCalendarEventsQuery, undefined, { perspective: 'published' });
    // Optional blacklist via env to hide ghost items immediately (comma-separated IDs)
    const blacklistEnv = process.env.NEXT_PUBLIC_CALENDAR_EVENT_BLACKLIST_IDS || '';
    const blacklist = new Set(
      blacklistEnv
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
    );
    const filtered = blacklist.size > 0 ? events.filter((e) => !blacklist.has(e._id)) : events;
    return filtered;
  },

  // ADMIN: Takvim için tüm calendar eventleri getir
  async getAllCalendarEventsForCalendar(): Promise<CalendarEvents[]> {
    const events = await sanityQuery<CalendarEvents[]>(allCalendarEventsQuery, undefined, { perspective: 'published' });
    return events;
  },

  // Tek bir calendar event getir
  async getCalendarEvent(slug: string): Promise<CalendarEvents> {
    const event = await sanityQuery<CalendarEvents>(calendarEventBySlugQuery, { slug }, { perspective: 'published' });
    if (!event) throw new Error('Calendar event not found');
    return event;
  },

  // Calendar event arama
  async searchCalendarEvents(query: string, params?: PaginationParams): Promise<PaginatedResponse<CalendarEvents>> {
    const baseQuery = searchCalendarEventsQuery.replace('{', '').replace('}', '');
    return getPaginatedResults(baseQuery, params, { query });
  },

  // ADMIN: Calendar event arama
  async searchAllCalendarEvents(query: string, params?: PaginationParams): Promise<PaginatedResponse<CalendarEvents>> {
    const baseQuery = searchAllCalendarEventsQuery.replace('{', '').replace('}', '');
    return getPaginatedResults(baseQuery, params, { query });
  },

  // Kategoriye göre calendar eventler
  async getCalendarEventsByCategory(category: string): Promise<CalendarEvents[]> {
    const events = await sanityQuery<CalendarEvents[]>(calendarEventsByCategoryQuery, { category }, { perspective: 'published' });
    return events;
  }
};
