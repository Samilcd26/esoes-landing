import { useQuery } from '@tanstack/react-query';
import { sanityDepartmentService } from '../lib/api/sanityDepartmentService';
import { Department, PaginationParams } from '../lib/types/api';

export const useSanityDepartments = (params?: PaginationParams) => {
  return useQuery({
    queryKey: ['departments', params],
    queryFn: () => sanityDepartmentService.getDepartments(params),
    staleTime: 5 * 60 * 1000, // 5 dakika
  });
};

export const useSanityDepartment = (slug: string) => {
  return useQuery({
    queryKey: ['department', slug],
    queryFn: () => sanityDepartmentService.getDepartment(slug),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000, // 5 dakika
  });
};

export const useSearchSanityDepartments = (query: string, params?: PaginationParams) => {
  return useQuery({
    queryKey: ['departments', 'search', query, params],
    queryFn: () => sanityDepartmentService.searchDepartments(query, params),
    enabled: !!query,
    staleTime: 5 * 60 * 1000, // 5 dakika
  });
};

// Admin hooks
export const useAllSanityDepartments = (params?: PaginationParams) => {
  return useQuery({
    queryKey: ['departments', 'all', params],
    queryFn: () => sanityDepartmentService.getAllDepartments(params),
    staleTime: 5 * 60 * 1000, // 5 dakika
  });
};

export const useSearchAllSanityDepartments = (query: string, params?: PaginationParams) => {
  return useQuery({
    queryKey: ['departments', 'all', 'search', query, params],
    queryFn: () => sanityDepartmentService.searchAllDepartments(query, params),
    enabled: !!query,
    staleTime: 5 * 60 * 1000, // 5 dakika
  });
};
