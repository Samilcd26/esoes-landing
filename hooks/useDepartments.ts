import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { departmentService } from '../lib/api/services/departmentService';
import { CreateDepartmentRequest, UpdateDepartmentRequest } from '../lib/types/api';

// Query keys
export const departmentKeys = {
  all: ['departments'] as const,
  lists: () => [...departmentKeys.all, 'list'] as const,
  list: (filters: any) => [...departmentKeys.lists(), { filters }] as const,
  details: () => [...departmentKeys.all, 'detail'] as const,
  detail: (id: string) => [...departmentKeys.details(), id] as const,
  statistics: () => [...departmentKeys.all, 'statistics'] as const,
  members: (id: string) => [...departmentKeys.all, 'members', id] as const,
  usersWithDepartment: () => [...departmentKeys.all, 'usersWithDepartment'] as const,
  usersWithoutDepartment: () => [...departmentKeys.all, 'usersWithoutDepartment'] as const,
  usersByDepartment: (id: string) => [...departmentKeys.all, 'usersByDepartment', id] as const,
};

// Tüm departmanları getir
export const useDepartments = () => {
  return useQuery({
    queryKey: departmentKeys.lists(),
    queryFn: () => departmentService.getAllDepartments(),
    staleTime: 5 * 60 * 1000, // 5 dakika
    gcTime: 10 * 60 * 1000, // 10 dakika
  });
};

// Departman istatistiklerini getir
export const useDepartmentStatistics = () => {
  return useQuery({
    queryKey: departmentKeys.statistics(),
    queryFn: () => departmentService.getDepartmentStatistics(),
    staleTime: 2 * 60 * 1000, // 2 dakika
    gcTime: 5 * 60 * 1000, // 5 dakika
  });
};

// Belirli bir departmanı getir
export const useDepartment = (id: string) => {
  return useQuery({
    queryKey: departmentKeys.detail(id),
    queryFn: () => departmentService.getDepartmentById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 dakika
    gcTime: 10 * 60 * 1000, // 10 dakika
  });
};

// Departman üyelerini getir
export const useDepartmentMembers = (departmentId: string) => {
  return useQuery({
    queryKey: departmentKeys.members(departmentId),
    queryFn: () => departmentService.getDepartmentMembers(departmentId),
    enabled: !!departmentId,
    staleTime: 2 * 60 * 1000, // 2 dakika
    gcTime: 5 * 60 * 1000, // 5 dakika
  });
};

// Departman bilgisi ile kullanıcıları getir
export const useUsersWithDepartment = () => {
  return useQuery({
    queryKey: departmentKeys.usersWithDepartment(),
    queryFn: () => departmentService.getUsersWithDepartment(),
    staleTime: 2 * 60 * 1000, // 2 dakika
    gcTime: 5 * 60 * 1000, // 5 dakika
  });
};

// Departmansız kullanıcıları getir
export const useUsersWithoutDepartment = () => {
  return useQuery({
    queryKey: departmentKeys.usersWithoutDepartment(),
    queryFn: () => departmentService.getUsersWithoutDepartment(),
    staleTime: 2 * 60 * 1000, // 2 dakika
    gcTime: 5 * 60 * 1000, // 5 dakika
  });
};

// Belirli bir departmandaki kullanıcıları getir
export const useUsersByDepartment = (departmentId: string) => {
  return useQuery({
    queryKey: departmentKeys.usersByDepartment(departmentId),
    queryFn: () => departmentService.getUsersByDepartment(departmentId),
    enabled: !!departmentId,
    staleTime: 2 * 60 * 1000, // 2 dakika
    gcTime: 5 * 60 * 1000, // 5 dakika
  });
};

// Yeni departman oluştur
export const useCreateDepartment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (departmentData: CreateDepartmentRequest) => 
      departmentService.createDepartment(departmentData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: departmentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: departmentKeys.statistics() });
    },
    onError: (error) => {
      console.error('Departman oluşturma hatası:', error);
    },
  });
};

// Departman güncelle
export const useUpdateDepartment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateDepartmentRequest }) => 
      departmentService.updateDepartment(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: departmentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: departmentKeys.detail(data.id) });
      queryClient.invalidateQueries({ queryKey: departmentKeys.statistics() });
    },
    onError: (error) => {
      console.error('Departman güncelleme hatası:', error);
    },
  });
};

// Departman sil
export const useDeleteDepartment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => departmentService.deleteDepartment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: departmentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: departmentKeys.statistics() });
      queryClient.invalidateQueries({ queryKey: departmentKeys.usersWithDepartment() });
      queryClient.invalidateQueries({ queryKey: departmentKeys.usersWithoutDepartment() });
    },
    onError: (error) => {
      console.error('Departman silme hatası:', error);
    },
  });
};

// Kullanıcıyı departmana ata
export const useAssignUserToDepartment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ userId, departmentId }: { userId: string; departmentId: string }) => 
      departmentService.assignUserToDepartment(userId, departmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: departmentKeys.statistics() });
      queryClient.invalidateQueries({ queryKey: departmentKeys.usersWithDepartment() });
      queryClient.invalidateQueries({ queryKey: departmentKeys.usersWithoutDepartment() });
      queryClient.invalidateQueries({ queryKey: departmentKeys.all });
    },
    onError: (error) => {
      console.error('Kullanıcı departman atama hatası:', error);
    },
  });
};

// Kullanıcıyı departmandan çıkar
export const useRemoveUserFromDepartment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (userId: string) => 
      departmentService.removeUserFromDepartment(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: departmentKeys.statistics() });
      queryClient.invalidateQueries({ queryKey: departmentKeys.usersWithDepartment() });
      queryClient.invalidateQueries({ queryKey: departmentKeys.usersWithoutDepartment() });
      queryClient.invalidateQueries({ queryKey: departmentKeys.all });
    },
    onError: (error) => {
      console.error('Kullanıcı departman çıkarma hatası:', error);
    },
  });
}; 