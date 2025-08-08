import { useQuery } from '@tanstack/react-query'
import { SanityGalleryService, Gallery } from '../lib/api/sanityGalleryService'

export const useSanityGallery = () => {
  const {
    data: galleries,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['galleries'],
    queryFn: SanityGalleryService.getActiveGalleries,
    staleTime: 5 * 60 * 1000, // 5 dakika
  })

  return {
    galleries: galleries || [],
    isLoading,
    error,
    refetch,
  }
}

export const useSanityGalleryByCategory = (category: string) => {
  const {
    data: galleries,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['galleries', category],
    queryFn: () => SanityGalleryService.getGalleriesByCategory(category),
    enabled: !!category,
    staleTime: 5 * 60 * 1000, // 5 dakika
  })

  return {
    galleries: galleries || [],
    isLoading,
    error,
    refetch,
  }
}

export const useSanityGallerySearch = (query: string) => {
  const {
    data: galleries,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['galleries', 'search', query],
    queryFn: () => SanityGalleryService.searchGalleries(query),
    enabled: !!query && query.length > 2,
    staleTime: 2 * 60 * 1000, // 2 dakika
  })

  return {
    galleries: galleries || [],
    isLoading,
    error,
    refetch,
  }
}

export const useSanityGalleryById = (id: string) => {
  const {
    data: gallery,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['gallery', id],
    queryFn: () => SanityGalleryService.getGalleryById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 dakika
  })

  return {
    gallery,
    isLoading,
    error,
    refetch,
  }
}

export const useSanityGalleryImages = () => {
  const {
    data: images,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['gallery-images'],
    queryFn: SanityGalleryService.getGalleryImages,
    staleTime: 10 * 60 * 1000, // 10 dakika
  })

  return {
    images: images || [],
    isLoading,
    error,
    refetch,
  }
}
