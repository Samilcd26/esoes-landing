import {  sanityQuery } from '../sanity/client';
import { 
  publishedEventsQuery, 
  allEventsQuery, 
  eventBySlugQuery,
  searchEventsQuery,
  searchAllEventsQuery,
  eventsByCategoryQuery
} from '../sanity/queries/events';
import { Event, PaginationParams, PaginatedResponse } from '../types/api';

// Sanity Event tipi
export interface SanityEvent {
  _id: string;
  _type: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  image?: string;
  capacity: number;
  registeredCount: number;
  status: 'draft' | 'published' | 'cancelled';
  slug: string;
  category?: string;
  tags?: string[];
  organizer?: {
    _id: string;
    name: string;
    avatar?: string;
  };
  _createdAt: string;
  _updatedAt: string;
}

// Sanity event'ini API event'ine çevir
const mapSanityEventToApiEvent = (sanityEvent: SanityEvent): Event => ({
  id: sanityEvent._id,
  title: sanityEvent.title,
  description: sanityEvent.description,
  startDate: sanityEvent.startDate,
  endDate: sanityEvent.endDate,
  location: sanityEvent.location,
  image: sanityEvent.image,
  capacity: sanityEvent.capacity,
  registeredCount: sanityEvent.registeredCount,
  status: sanityEvent.status,
  created_at: sanityEvent._createdAt,
  updated_at: sanityEvent._updatedAt
});

export const sanityEventService = {
  // Tüm yayınlanmış eventleri getir
  async getEvents(params?: PaginationParams): Promise<PaginatedResponse<Event>> {
    const events = await sanityQuery<SanityEvent[]>(publishedEventsQuery);
    
    // Pagination işlemi
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedEvents = events.slice(startIndex, endIndex);

    return {
      data: paginatedEvents.map(mapSanityEventToApiEvent),
      pagination: {
        page,
        limit,
        total: events.length,
        totalPages: Math.ceil(events.length / limit)
      }
    };
  },

  // ADMIN: Tüm eventleri getir
  async getAllEvents(params?: PaginationParams): Promise<PaginatedResponse<Event>> {
    const events = await sanityQuery<SanityEvent[]>(allEventsQuery);
    
    // Pagination işlemi
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedEvents = events.slice(startIndex, endIndex);

    return {
      data: paginatedEvents.map(mapSanityEventToApiEvent),
      pagination: {
        page,
        limit,
        total: events.length,
        totalPages: Math.ceil(events.length / limit)
      }
    };
  },

  // Takvim için eventleri getir
  async getCalendarEvents(): Promise<Event[]> {
    const events = await sanityQuery<SanityEvent[]>(publishedEventsQuery);
    return events.map(mapSanityEventToApiEvent);
  },

  // ADMIN: Takvim için tüm eventleri getir
  async getAllCalendarEvents(): Promise<Event[]> {
    const events = await sanityQuery<SanityEvent[]>(allEventsQuery);
    return events.map(mapSanityEventToApiEvent);
  },

  // Tek bir event getir
  async getEvent(slug: string): Promise<Event> {
    const event = await sanityQuery<SanityEvent>(eventBySlugQuery, { slug });
    if (!event) throw new Error('Event not found');
    return mapSanityEventToApiEvent(event);
  },

  // Event arama
  async searchEvents(query: string, params?: PaginationParams): Promise<PaginatedResponse<Event>> {
    const events = await sanityQuery<SanityEvent[]>(searchEventsQuery, { query });
    
    // Pagination işlemi
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedEvents = events.slice(startIndex, endIndex);

    return {
      data: paginatedEvents.map(mapSanityEventToApiEvent),
      pagination: {
        page,
        limit,
        total: events.length,
        totalPages: Math.ceil(events.length / limit)
      }
    };
  },

  // ADMIN: Event arama
  async searchAllEvents(query: string, params?: PaginationParams): Promise<PaginatedResponse<Event>> {
    const events = await sanityQuery<SanityEvent[]>(searchAllEventsQuery, { query });
    
    // Pagination işlemi
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedEvents = events.slice(startIndex, endIndex);

    return {
      data: paginatedEvents.map(mapSanityEventToApiEvent),
      pagination: {
        page,
        limit,
        total: events.length,
        totalPages: Math.ceil(events.length / limit)
      }
    };
  },

  // Kategoriye göre eventler
  async getEventsByCategory(category: string): Promise<Event[]> {
    const events = await sanityQuery<SanityEvent[]>(eventsByCategoryQuery, { category });
    return events.map(mapSanityEventToApiEvent);
  },

  
};
