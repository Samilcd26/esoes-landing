import { useQuery } from '@tanstack/react-query';
import { sanityCalendarEventService } from '../lib/api/sanityCalendarEventService';
import { PaginationParams } from '../lib/types/api';

// Query keys
export const sanityCalendarEventKeys = {
  all: ['sanity-calendar-events'] as const,
  lists: () => [...sanityCalendarEventKeys.all, 'list'] as const,
  list: (params: PaginationParams) => [...sanityCalendarEventKeys.lists(), params] as const,
  details: () => [...sanityCalendarEventKeys.all, 'detail'] as const,
  detail: (slug: string) => [...sanityCalendarEventKeys.details(), slug] as const,
  search: (query: string, params: PaginationParams) => [...sanityCalendarEventKeys.all, 'search', query, params] as const,
  // Admin keys
  adminLists: () => [...sanityCalendarEventKeys.all, 'admin', 'list'] as const,
  adminList: (params: PaginationParams) => [...sanityCalendarEventKeys.adminLists(), params] as const,
  adminSearch: (query: string, params: PaginationParams) => [...sanityCalendarEventKeys.all, 'admin', 'search', query, params] as const,
  calendar: () => [...sanityCalendarEventKeys.all, 'calendar'] as const,
  adminCalendar: () => [...sanityCalendarEventKeys.all, 'admin', 'calendar'] as const,
  category: (category: string) => [...sanityCalendarEventKeys.all, 'category', category] as const,
};

// Tüm calendar eventleri getir (public)
export const useSanityCalendarEvents = (params?: PaginationParams) => {
  return useQuery({
    queryKey: sanityCalendarEventKeys.list(params || {}),
    queryFn: () => sanityCalendarEventService.getCalendarEvents(params),
    staleTime: 5 * 60 * 1000, // 5 dakika
    gcTime: 10 * 60 * 1000, // 10 dakika
  });
};

// ADMIN: Tüm calendar eventleri getir
export const useAllSanityCalendarEvents = (params?: PaginationParams) => {
  return useQuery({
    queryKey: sanityCalendarEventKeys.adminList(params || {}),
    queryFn: () => sanityCalendarEventService.getAllCalendarEvents(params),
    staleTime: 2 * 60 * 1000, // 2 dakika
    gcTime: 5 * 60 * 1000, // 5 dakika
  });
};

// Takvim için calendar eventleri getir (public)
export const useSanityCalendarEventsForCalendar = () => {
  return useQuery({
    queryKey: sanityCalendarEventKeys.calendar(),
    queryFn: () => sanityCalendarEventService.getCalendarEventsForCalendar(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// ADMIN: Takvim için tüm calendar eventleri getir
export const useAllSanityCalendarEventsForCalendar = () => {
  return useQuery({
    queryKey: sanityCalendarEventKeys.adminCalendar(),
    queryFn: () => sanityCalendarEventService.getAllCalendarEventsForCalendar(),
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};

// Tek calendar event getir
export const useSanityCalendarEvent = (slug: string) => {
  return useQuery({
    queryKey: sanityCalendarEventKeys.detail(slug),
    queryFn: () => sanityCalendarEventService.getCalendarEvent(slug),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Calendar event arama (public)
export const useSanityCalendarEventSearch = (query: string, params?: PaginationParams) => {
  return useQuery({
    queryKey: sanityCalendarEventKeys.search(query, params || {}),
    queryFn: () => sanityCalendarEventService.searchCalendarEvents(query, params),
    enabled: !!query && query.length > 2,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};

// ADMIN: Calendar event arama
export const useAllSanityCalendarEventSearch = (query: string, params?: PaginationParams) => {
  return useQuery({
    queryKey: sanityCalendarEventKeys.adminSearch(query, params || {}),
    queryFn: () => sanityCalendarEventService.searchAllCalendarEvents(query, params),
    enabled: !!query && query.length > 2,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};

// Kategoriye göre calendar eventler
export const useSanityCalendarEventsByCategory = (category: string) => {
  return useQuery({
    queryKey: sanityCalendarEventKeys.category(category),
    queryFn: () => sanityCalendarEventService.getCalendarEventsByCategory(category),
    enabled: !!category,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
