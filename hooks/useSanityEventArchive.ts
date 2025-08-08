import { useQuery } from '@tanstack/react-query';
import { sanityEventArchiveService } from '../lib/api/sanityEventArchiveService';
import { PaginationParams } from '../lib/types/api';

// Query keys
export const sanityEventArchiveKeys = {
  all: ['sanity-event-archive'] as const,
  lists: () => [...sanityEventArchiveKeys.all, 'list'] as const,
  list: (params: PaginationParams) => [...sanityEventArchiveKeys.lists(), params] as const,
  details: () => [...sanityEventArchiveKeys.all, 'detail'] as const,
  detail: (slug: string) => [...sanityEventArchiveKeys.details(), slug] as const,
  search: (query: string, params: PaginationParams) => [...sanityEventArchiveKeys.all, 'search', query, params] as const,
  // Admin keys
  adminLists: () => [...sanityEventArchiveKeys.all, 'admin', 'list'] as const,
  adminList: (params: PaginationParams) => [...sanityEventArchiveKeys.adminLists(), params] as const,
  adminSearch: (query: string, params: PaginationParams) => [...sanityEventArchiveKeys.all, 'admin', 'search', query, params] as const,
  category: (category: string) => [...sanityEventArchiveKeys.all, 'category', category] as const,
  year: (year: number) => [...sanityEventArchiveKeys.all, 'year', year] as const,
  recent: (limit: number) => [...sanityEventArchiveKeys.all, 'recent', limit] as const,
  withMedia: () => [...sanityEventArchiveKeys.all, 'with-media'] as const,
};

// Tüm arşiv eventleri getir (public)
export const useSanityEventArchives = (params?: PaginationParams) => {
  return useQuery({
    queryKey: sanityEventArchiveKeys.list(params || {}),
    queryFn: () => sanityEventArchiveService.getEventArchives(params),
    staleTime: 5 * 60 * 1000, // 5 dakika
    gcTime: 10 * 60 * 1000, // 10 dakika
  });
};

// ADMIN: Tüm arşiv eventleri getir
export const useAllSanityEventArchives = (params?: PaginationParams) => {
  return useQuery({
    queryKey: sanityEventArchiveKeys.adminList(params || {}),
    queryFn: () => sanityEventArchiveService.getAllEventArchives(params),
    staleTime: 2 * 60 * 1000, // 2 dakika
    gcTime: 5 * 60 * 1000, // 5 dakika
  });
};

// Tek arşiv event getir
export const useSanityEventArchive = (slug: string) => {
  return useQuery({
    queryKey: sanityEventArchiveKeys.detail(slug),
    queryFn: () => sanityEventArchiveService.getEventArchive(slug),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Arşiv event arama (public)
export const useSanityEventArchiveSearch = (query: string, params?: PaginationParams) => {
  return useQuery({
    queryKey: sanityEventArchiveKeys.search(query, params || {}),
    queryFn: () => sanityEventArchiveService.searchEventArchives(query, params),
    enabled: !!query && query.length > 2,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};

// ADMIN: Arşiv event arama
export const useAllSanityEventArchiveSearch = (query: string, params?: PaginationParams) => {
  return useQuery({
    queryKey: sanityEventArchiveKeys.adminSearch(query, params || {}),
    queryFn: () => sanityEventArchiveService.searchAllEventArchives(query, params),
    enabled: !!query && query.length > 2,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};

// Kategoriye göre arşiv eventler
export const useSanityEventArchivesByCategory = (category: string) => {
  return useQuery({
    queryKey: sanityEventArchiveKeys.category(category),
    queryFn: () => sanityEventArchiveService.getEventArchivesByCategory(category),
    enabled: !!category,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Belirli bir yıldaki arşiv eventler
export const useSanityEventArchivesByYear = (year: number) => {
  return useQuery({
    queryKey: sanityEventArchiveKeys.year(year),
    queryFn: () => sanityEventArchiveService.getEventArchivesByYear(year),
    enabled: !!year,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// En son arşiv eventleri getir
export const useSanityRecentEventArchives = (limit: number = 5) => {
  return useQuery({
    queryKey: sanityEventArchiveKeys.recent(limit),
    queryFn: () => sanityEventArchiveService.getRecentEventArchives(limit),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Medya kaynakları olan arşiv eventleri getir
export const useSanityEventArchivesWithMedia = () => {
  return useQuery({
    queryKey: sanityEventArchiveKeys.withMedia(),
    queryFn: () => sanityEventArchiveService.getEventArchivesWithMedia(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
