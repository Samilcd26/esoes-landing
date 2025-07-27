import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { faqService } from '../lib/api/services/faqService';
import { CreateFaqRequest, UpdateFaqRequest } from '../lib/types/api';

// Query keys
export const faqKeys = {
  all: ['faqs'] as const,
  lists: () => [...faqKeys.all, 'list'] as const,
  list: (filters: any) => [...faqKeys.lists(), { filters }] as const,
  details: () => [...faqKeys.all, 'detail'] as const,
  detail: (id: string) => [...faqKeys.details(), id] as const,
};

// Tüm SSS'leri getir
export const useFaqs = () => {
  return useQuery({
    queryKey: faqKeys.lists(),
    queryFn: () => faqService.getAllFaqs(),
    staleTime: 5 * 60 * 1000, // 5 dakika
    gcTime: 10 * 60 * 1000, // 10 dakika
  });
};

// Belirli bir SSS'yi getir
export const useFaq = (id: string) => {
  return useQuery({
    queryKey: faqKeys.detail(id),
    queryFn: () => faqService.getFaqById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 dakika
    gcTime: 10 * 60 * 1000, // 10 dakika
  });
};

// Yeni SSS oluştur
export const useCreateFaq = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (faqData: CreateFaqRequest) => 
      faqService.createFaq(faqData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: faqKeys.lists() });
    },
    onError: (error) => {
      console.error('SSS oluşturma hatası:', error);
    },
  });
};

// SSS güncelle
export const useUpdateFaq = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateFaqRequest }) => 
      faqService.updateFaq(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: faqKeys.lists() });
      queryClient.invalidateQueries({ queryKey: faqKeys.detail(data.id) });
    },
    onError: (error) => {
      console.error('SSS güncelleme hatası:', error);
    },
  });
};

// SSS sil
export const useDeleteFaq = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => faqService.deleteFaq(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: faqKeys.lists() });
    },
    onError: (error) => {
      console.error('SSS silme hatası:', error);
    },
  });
};