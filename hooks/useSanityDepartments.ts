import { useQuery } from '@tanstack/react-query';
import { sanityDepartmentService } from '../lib/api/sanityDepartmentService';
import {  PaginationParams } from '../lib/types/api';

// Query keys
export const sanityDepartmentKeys = {
  all: ['departments'] as const,
  lists: () => [...sanityDepartmentKeys.all, 'list'] as const,
  list: (params: PaginationParams) => [...sanityDepartmentKeys.lists(), params] as const,
  details: () => [...sanityDepartmentKeys.all, 'detail'] as const,
  detail: (slug: string) => [...sanityDepartmentKeys.details(), slug] as const,
  search: (query: string, params: PaginationParams) => [...sanityDepartmentKeys.all, 'search', query, params] as const,
  // Admin keys
  adminLists: () => [...sanityDepartmentKeys.all, 'admin', 'list'] as const,
  adminList: (params: PaginationParams) => [...sanityDepartmentKeys.adminLists(), params] as const,
  adminSearch: (query: string, params: PaginationParams) => [...sanityDepartmentKeys.all, 'admin', 'search', query, params] as const,
  category: (category: 'HSD' | 'GENERAL', params?: PaginationParams) => [...sanityDepartmentKeys.all, 'category', category, params] as const,
};

export const useSanityDepartments = (params?: PaginationParams) => {
  return useQuery({
    queryKey: sanityDepartmentKeys.list(params || {}),
    queryFn: () => sanityDepartmentService.getDepartments(params),
    staleTime: 5 * 60 * 1000, // 5 dakika
  });
};

export const useSanityDepartment = (slug: string) => {
  return useQuery({
    queryKey: sanityDepartmentKeys.detail(slug),
    queryFn: () => sanityDepartmentService.getDepartment(slug),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000, // 5 dakika
  });
};

export const useSearchSanityDepartments = (query: string, params?: PaginationParams) => {
  return useQuery({
    queryKey: sanityDepartmentKeys.search(query, params || {}),
    queryFn: () => sanityDepartmentService.searchDepartments(query, params),
    enabled: !!query,
    staleTime: 5 * 60 * 1000, // 5 dakika
  });
};

// Admin hooks
export const useAllSanityDepartments = (params?: PaginationParams) => {
  return useQuery({
    queryKey: sanityDepartmentKeys.adminList(params || {}),
    queryFn: () => sanityDepartmentService.getAllDepartments(params),
    staleTime: 5 * 60 * 1000, // 5 dakika
  });
};

export const useSearchAllSanityDepartments = (query: string, params?: PaginationParams) => {
  return useQuery({
    queryKey: sanityDepartmentKeys.adminSearch(query, params || {}),
    queryFn: () => sanityDepartmentService.searchAllDepartments(query, params),
    enabled: !!query,
    staleTime: 5 * 60 * 1000, // 5 dakika
  });
};

export const useSanityDepartmentsByCategory = (category: 'HSD' | 'GENERAL', params?: PaginationParams) => {
  return useQuery({
    queryKey: sanityDepartmentKeys.category(category, params),
    queryFn: () => sanityDepartmentService.getDepartmentsByCategory(category, params),
    enabled: !!category,
    staleTime: 5 * 60 * 1000,
  });
};
