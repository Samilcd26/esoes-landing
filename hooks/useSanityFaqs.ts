import { useQuery } from '@tanstack/react-query';
import { sanityFaqService } from '../lib/api/sanityFaqService';
import { PaginationParams } from '../lib/types/api';

// Query keys
export const sanityFaqKeys = {
  all: ['sanity-faqs'] as const,
  lists: () => [...sanityFaqKeys.all, 'list'] as const,
  list: (params: PaginationParams) => [...sanityFaqKeys.lists(), params] as const,
  search: (query: string, params: PaginationParams) => [...sanityFaqKeys.all, 'search', query, params] as const,
  // Admin keys
  adminLists: () => [...sanityFaqKeys.all, 'admin', 'list'] as const,
  adminList: (params: PaginationParams) => [...sanityFaqKeys.adminLists(), params] as const,
  adminSearch: (query: string, params: PaginationParams) => [...sanityFaqKeys.all, 'admin', 'search', query, params] as const,
  category: (category: string) => [...sanityFaqKeys.all, 'category', category] as const,
};

// Tüm aktif FAQ'ları getir
export const useSanityFaqs = (params?: PaginationParams) => {
  return useQuery({
    queryKey: sanityFaqKeys.list(params || {}),
    queryFn: () => sanityFaqService.getFaqs(params),
    staleTime: 10 * 60 * 1000, // 10 dakika
    gcTime: 30 * 60 * 1000, // 30 dakika
  });
};

// ADMIN: Tüm FAQ'ları getir
export const useAllSanityFaqs = (params?: PaginationParams) => {
  return useQuery({
    queryKey: sanityFaqKeys.adminList(params || {}),
    queryFn: () => sanityFaqService.getAllFaqs(params),
    staleTime: 5 * 60 * 1000, // 5 dakika
    gcTime: 10 * 60 * 1000, // 10 dakika
  });
};

// Kategoriye göre FAQ'lar
export const useSanityFaqsByCategory = (category: string) => {
  return useQuery({
    queryKey: sanityFaqKeys.category(category),
    queryFn: () => sanityFaqService.getFaqsByCategory(category),
    enabled: !!category,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};

// FAQ arama (public)
export const useSanityFaqSearch = (query: string, params?: PaginationParams) => {
  return useQuery({
    queryKey: sanityFaqKeys.search(query, params || {}),
    queryFn: () => sanityFaqService.searchFaqs(query, params),
    enabled: !!query && query.length > 2,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// ADMIN: FAQ arama
export const useAllSanityFaqSearch = (query: string, params?: PaginationParams) => {
  return useQuery({
    queryKey: sanityFaqKeys.adminSearch(query, params || {}),
    queryFn: () => sanityFaqService.searchAllFaqs(query, params),
    enabled: !!query && query.length > 2,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
