import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { eventService } from '../lib/api/services/eventService';
import { CreateEventRequest, UpdateEventRequest, PaginationParams } from '../lib/types/api';

// Query keys
export const eventKeys = {
  all: ['events'] as const,
  lists: () => [...eventKeys.all, 'list'] as const,
  list: (params: PaginationParams) => [...eventKeys.lists(), params] as const,
  details: () => [...eventKeys.all, 'detail'] as const,
  detail: (id: string) => [...eventKeys.details(), id] as const,
  userEvents: () => [...eventKeys.all, 'user'] as const,
  search: (query: string, params: PaginationParams) => [...eventKeys.all, 'search', query, params] as const,
  // Admin keys
  adminLists: () => [...eventKeys.all, 'admin', 'list'] as const,
  adminList: (params: PaginationParams) => [...eventKeys.adminLists(), params] as const,
  adminSearch: (query: string, params: PaginationParams) => [...eventKeys.all, 'admin', 'search', query, params] as const,
  calendar: () => [...eventKeys.all, 'calendar'] as const,
  adminCalendar: () => [...eventKeys.all, 'admin', 'calendar'] as const,
};

// Tüm eventleri getir (public)
export const useEvents = (params?: PaginationParams) => {
  return useQuery({
    queryKey: eventKeys.list(params || {}),
    queryFn: () => eventService.getEvents(params),
    staleTime: 5 * 60 * 1000, // 5 dakika
    gcTime: 10 * 60 * 1000, // 10 dakika
  });
};

// ADMIN: Tüm eventleri getir (draft dahil)
export const useAllEvents = (params?: PaginationParams) => {
  return useQuery({
    queryKey: eventKeys.adminList(params || {}),
    queryFn: () => eventService.getAllEvents(params),
    staleTime: 2 * 60 * 1000, // 2 dakika
    gcTime: 5 * 60 * 1000, // 5 dakika
  });
};

// Takvim için eventleri getir (public)
export const useCalendarEvents = () => {
  return useQuery({
    queryKey: eventKeys.calendar(),
    queryFn: () => eventService.getCalendarEvents(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// ADMIN: Takvim için tüm eventleri getir (draft dahil)
export const useAllCalendarEvents = () => {
  return useQuery({
    queryKey: eventKeys.adminCalendar(),
    queryFn: () => eventService.getAllCalendarEvents(),
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};

// Tek event getir
export const useEvent = (id: string) => {
  return useQuery({
    queryKey: eventKeys.detail(id),
    queryFn: () => eventService.getEvent(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Kullanıcının eventlerini getir
export const useUserEvents = () => {
  return useQuery({
    queryKey: eventKeys.userEvents(),
    queryFn: () => eventService.getUserEvents(),
    staleTime: 2 * 60 * 1000, // 2 dakika
    gcTime: 5 * 60 * 1000, // 5 dakika
  });
};

// Event arama (public)
export const useEventSearch = (query: string, params?: PaginationParams) => {
  return useQuery({
    queryKey: eventKeys.search(query, params || {}),
    queryFn: () => eventService.searchEvents(query, params),
    enabled: !!query && query.length > 2,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};

// ADMIN: Event arama (tüm statuslar dahil)
export const useAllEventSearch = (query: string, params?: PaginationParams) => {
  return useQuery({
    queryKey: eventKeys.adminSearch(query, params || {}),
    queryFn: () => eventService.searchAllEvents(query, params),
    enabled: !!query && query.length > 2,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};

// Event oluştur
export const useCreateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (eventData: CreateEventRequest) => eventService.createEvent(eventData),
    onSuccess: () => {
      // Event listelerini invalidate et
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() });
      queryClient.invalidateQueries({ queryKey: eventKeys.adminLists() });
      queryClient.invalidateQueries({ queryKey: eventKeys.userEvents() });
      queryClient.invalidateQueries({ queryKey: eventKeys.calendar() });
      queryClient.invalidateQueries({ queryKey: eventKeys.adminCalendar() });
    },
  });
};

// Event güncelle
export const useUpdateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateEventRequest> }) =>
      eventService.updateEvent(id, data),
    onSuccess: (updatedEvent) => {
      // İlgili event'i güncelle
      queryClient.setQueryData(eventKeys.detail(updatedEvent.id), updatedEvent);
      // Listeleri invalidate et
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() });
      queryClient.invalidateQueries({ queryKey: eventKeys.adminLists() });
      queryClient.invalidateQueries({ queryKey: eventKeys.userEvents() });
      queryClient.invalidateQueries({ queryKey: eventKeys.calendar() });
      queryClient.invalidateQueries({ queryKey: eventKeys.adminCalendar() });
    },
  });
};

// ADMIN: Event durumunu güncelle
export const useUpdateEventStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'draft' | 'published' | 'cancelled' }) =>
      eventService.updateEventStatus(id, status),
    onSuccess: (updatedEvent) => {
      // İlgili event'i güncelle
      queryClient.setQueryData(eventKeys.detail(updatedEvent.id), updatedEvent);
      // Listeleri invalidate et
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() });
      queryClient.invalidateQueries({ queryKey: eventKeys.adminLists() });
      queryClient.invalidateQueries({ queryKey: eventKeys.userEvents() });
      queryClient.invalidateQueries({ queryKey: eventKeys.calendar() });
      queryClient.invalidateQueries({ queryKey: eventKeys.adminCalendar() });
    },
  });
};

// Event sil
export const useDeleteEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => eventService.deleteEvent(id),
    onSuccess: (_, deletedId) => {
      // Event'i cache'den kaldır
      queryClient.removeQueries({ queryKey: eventKeys.detail(deletedId) });
      // Listeleri invalidate et
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() });
      queryClient.invalidateQueries({ queryKey: eventKeys.adminLists() });
      queryClient.invalidateQueries({ queryKey: eventKeys.userEvents() });
      queryClient.invalidateQueries({ queryKey: eventKeys.calendar() });
      queryClient.invalidateQueries({ queryKey: eventKeys.adminCalendar() });
    },
  });
};

// Event'e kayıt ol
export const useRegisterForEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (eventId: string) => eventService.registerForEvent(eventId),
    onSuccess: (_, eventId) => {
      // Event detayını güncelle
      queryClient.invalidateQueries({ queryKey: eventKeys.detail(eventId) });
      // Kullanıcı eventlerini güncelle
      queryClient.invalidateQueries({ queryKey: eventKeys.userEvents() });
      // Event listelerini güncelle
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() });
      queryClient.invalidateQueries({ queryKey: eventKeys.adminLists() });
    },
  });
};

// Event kaydını iptal et
export const useUnregisterFromEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (eventId: string) => eventService.unregisterFromEvent(eventId),
    onSuccess: (_, eventId) => {
      // Event detayını güncelle
      queryClient.invalidateQueries({ queryKey: eventKeys.detail(eventId) });
      // Kullanıcı eventlerini güncelle
      queryClient.invalidateQueries({ queryKey: eventKeys.userEvents() });
      // Event listelerini güncelle
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() });
      queryClient.invalidateQueries({ queryKey: eventKeys.adminLists() });
    },
  });
};

// Kullanıcının event'e kayıtlı olup olmadığını kontrol et
export const useIsUserRegisteredForEvent = (eventId: string) => {
  return useQuery({
    queryKey: [...eventKeys.detail(eventId), 'registration-status'],
    queryFn: () => eventService.isUserRegisteredForEvent(eventId),
    enabled: !!eventId,
    staleTime: 1 * 60 * 1000, // 1 dakika
    gcTime: 2 * 60 * 1000, // 2 dakika
  });
}; 