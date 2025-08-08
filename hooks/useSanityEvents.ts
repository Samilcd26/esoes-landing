import { useQuery } from '@tanstack/react-query';
import { sanityEventService } from '../lib/api/sanityEventService';
import { PaginationParams } from '../lib/types/api';

// Query keys
export const sanityEventKeys = {
  all: ['sanity-events'] as const,
  lists: () => [...sanityEventKeys.all, 'list'] as const,
  list: (params: PaginationParams) => [...sanityEventKeys.lists(), params] as const,
  details: () => [...sanityEventKeys.all, 'detail'] as const,
  detail: (slug: string) => [...sanityEventKeys.details(), slug] as const,
  search: (query: string, params: PaginationParams) => [...sanityEventKeys.all, 'search', query, params] as const,
  // Admin keys
  adminLists: () => [...sanityEventKeys.all, 'admin', 'list'] as const,
  adminList: (params: PaginationParams) => [...sanityEventKeys.adminLists(), params] as const,
  adminSearch: (query: string, params: PaginationParams) => [...sanityEventKeys.all, 'admin', 'search', query, params] as const,
  calendar: () => [...sanityEventKeys.all, 'calendar'] as const,
  adminCalendar: () => [...sanityEventKeys.all, 'admin', 'calendar'] as const,
  category: (category: string) => [...sanityEventKeys.all, 'category', category] as const,
};

// Tüm eventleri getir (public)
export const useSanityEvents = (params?: PaginationParams) => {
  return useQuery({
    queryKey: sanityEventKeys.list(params || {}),
    queryFn: () => sanityEventService.getEvents(params),
    staleTime: 5 * 60 * 1000, // 5 dakika
    gcTime: 10 * 60 * 1000, // 10 dakika
  });
};

// ADMIN: Tüm eventleri getir
export const useAllSanityEvents = (params?: PaginationParams) => {
  return useQuery({
    queryKey: sanityEventKeys.adminList(params || {}),
    queryFn: () => sanityEventService.getAllEvents(params),
    staleTime: 2 * 60 * 1000, // 2 dakika
    gcTime: 5 * 60 * 1000, // 5 dakika
  });
};

// Takvim için eventleri getir (public)
export const useSanityCalendarEvents = () => {
  return useQuery({
    queryKey: sanityEventKeys.calendar(),
    queryFn: () => sanityEventService.getCalendarEvents(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// ADMIN: Takvim için tüm eventleri getir
export const useAllSanityCalendarEvents = () => {
  return useQuery({
    queryKey: sanityEventKeys.adminCalendar(),
    queryFn: () => sanityEventService.getAllCalendarEvents(),
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};

// Tek event getir
export const useSanityEvent = (slug: string) => {
  return useQuery({
    queryKey: sanityEventKeys.detail(slug),
    queryFn: () => sanityEventService.getEvent(slug),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Event arama (public)
export const useSanityEventSearch = (query: string, params?: PaginationParams) => {
  return useQuery({
    queryKey: sanityEventKeys.search(query, params || {}),
    queryFn: () => sanityEventService.searchEvents(query, params),
    enabled: !!query && query.length > 2,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};

// ADMIN: Event arama
export const useAllSanityEventSearch = (query: string, params?: PaginationParams) => {
  return useQuery({
    queryKey: sanityEventKeys.adminSearch(query, params || {}),
    queryFn: () => sanityEventService.searchAllEvents(query, params),
    enabled: !!query && query.length > 2,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};

// Kategoriye göre eventler
export const useSanityEventsByCategory = (category: string) => {
  return useQuery({
    queryKey: sanityEventKeys.category(category),
    queryFn: () => sanityEventService.getEventsByCategory(category),
    enabled: !!category,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
