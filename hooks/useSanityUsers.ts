import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { SanityUserService, User, CreateUserData, UpdateUserData } from '@/lib/api/sanityUserService'

// Query keys
export const userKeys = {
  all: ['users'] as const,
  active: () => [...userKeys.all, 'active'] as const,
  allUsers: () => [...userKeys.all, 'all'] as const,
  byRole: (role: string) => [...userKeys.all, 'role', role] as const,
  byCategory: (category: string) => [...userKeys.all, 'category', category] as const,
  byId: (id: string) => [...userKeys.all, 'id', id] as const,
  byEmail: (email: string) => [...userKeys.all, 'email', email] as const,
  admins: () => [...userKeys.all, 'admins'] as const,
  hsd: () => [...userKeys.all, 'hsd'] as const,
  search: (query: string) => [...userKeys.all, 'search', query] as const,
}

// Aktif kullanıcıları getir
export function useActiveUsers() {
  return useQuery({
    queryKey: userKeys.active(),
    queryFn: SanityUserService.getActiveUsers,
    staleTime: 5 * 60 * 1000, // 5 dakika
  })
}

// Tüm kullanıcıları getir (admin için)
export function useAllUsers() {
  return useQuery({
    queryKey: userKeys.allUsers(),
    queryFn: SanityUserService.getAllUsers,
    staleTime: 5 * 60 * 1000, // 5 dakika
  })
}

// Role göre kullanıcıları getir
export function useUsersByRole(role: 'admin' | 'editor' | 'user') {
  return useQuery({
    queryKey: userKeys.byRole(role),
    queryFn: () => SanityUserService.getUsersByRole(role),
    staleTime: 5 * 60 * 1000, // 5 dakika
    enabled: !!role,
  })
}

// Kullanıcı arama
export function useSearchUsers(query: string) {
  return useQuery({
    queryKey: userKeys.search(query),
    queryFn: () => SanityUserService.searchUsers(query),
    staleTime: 2 * 60 * 1000, // 2 dakika
    enabled: query.length > 2,
  })
}

// Tek bir kullanıcı getir
export function useUserById(id: string) {
  return useQuery({
    queryKey: userKeys.byId(id),
    queryFn: () => SanityUserService.getUserById(id),
    staleTime: 5 * 60 * 1000, // 5 dakika
    enabled: !!id,
  })
}

// E-posta ile kullanıcı getir
export function useUserByEmail(email: string) {
  return useQuery({
    queryKey: userKeys.byEmail(email),
    queryFn: () => SanityUserService.getUserByEmail(email),
    staleTime: 5 * 60 * 1000, // 5 dakika
    enabled: !!email,
  })
}

// Admin kullanıcıları getir
export function useAdminUsers() {
  return useQuery({
    queryKey: userKeys.admins(),
    queryFn: SanityUserService.getAdminUsers,
    staleTime: 5 * 60 * 1000, // 5 dakika
  })
}

// Kategoriye göre kullanıcıları getir
export function useUsersByCategory(category: 'HSD_MANAGEMENT' | 'GENERAL_MANAGEMENT') {
  return useQuery({
    queryKey: userKeys.byCategory(category),
    queryFn: () => SanityUserService.getUsersByCategory(category),
    staleTime: 5 * 60 * 1000, // 5 dakika
    enabled: !!category,
  })
}

// HSD Management kategorisindeki kullanıcıları getir
export function useHsdManagementUsers() {
  return useQuery({
    queryKey: userKeys.hsd(),
    queryFn: SanityUserService.getHsdManagementUsers,
    staleTime: 5 * 60 * 1000, // 5 dakika
  })
}

// Kullanıcı oluştur
export function useCreateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (userData: CreateUserData) => SanityUserService.createUser(userData),
    onSuccess: () => {
      // Tüm user query'lerini invalidate et
      queryClient.invalidateQueries({ queryKey: userKeys.all })
    },
  })
}

// Kullanıcı güncelle
export function useUpdateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, userData }: { id: string; userData: UpdateUserData }) =>
      SanityUserService.updateUser(id, userData),
    onSuccess: (updatedUser) => {
      // İlgili query'leri güncelle
      queryClient.setQueryData(userKeys.byId(updatedUser._id), updatedUser)
      queryClient.invalidateQueries({ queryKey: userKeys.all })
    },
  })
}

// Kullanıcı sil (soft delete)
export function useDeleteUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => SanityUserService.deleteUser(id),
    onSuccess: (deletedUser) => {
      // İlgili query'leri güncelle
      queryClient.setQueryData(userKeys.byId(deletedUser._id), deletedUser)
      queryClient.invalidateQueries({ queryKey: userKeys.all })
    },
  })
}

// Kullanıcıyı tamamen sil
export function useHardDeleteUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => SanityUserService.hardDeleteUser(id),
    onSuccess: (_, id) => {
      // İlgili query'leri temizle
      queryClient.removeQueries({ queryKey: userKeys.byId(id) })
      queryClient.invalidateQueries({ queryKey: userKeys.all })
    },
  })
}

// Kullanıcıyı aktif et
export function useActivateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => SanityUserService.activateUser(id),
    onSuccess: (activatedUser) => {
      // İlgili query'leri güncelle
      queryClient.setQueryData(userKeys.byId(activatedUser._id), activatedUser)
      queryClient.invalidateQueries({ queryKey: userKeys.all })
    },
  })
}

// Kullanıcı ünvanını güncelle
export function useUpdateUserTitle() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, title }: { id: string; title: string }) =>
      SanityUserService.updateUserTitle(id, title),
    onSuccess: (updatedUser) => {
      // İlgili query'leri güncelle
      queryClient.setQueryData(userKeys.byId(updatedUser._id), updatedUser)
      queryClient.invalidateQueries({ queryKey: userKeys.all })
    },
  })
}

// Kullanıcı kategorisini güncelle
export function useUpdateUserCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, category }: { id: string; category: 'HSD_MANAGEMENT' | 'GENERAL_MANAGEMENT' }) =>
      SanityUserService.updateUserCategory(id, category),
    onSuccess: (updatedUser) => {
      // İlgili query'leri güncelle
      queryClient.setQueryData(userKeys.byId(updatedUser._id), updatedUser)
      queryClient.invalidateQueries({ queryKey: userKeys.all })
    },
  })
}
