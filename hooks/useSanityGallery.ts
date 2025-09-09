import { useQuery } from '@tanstack/react-query'
import { SanityGalleryService } from '../lib/api/sanityGalleryService'

// Query keys
export const sanityGalleryKeys = {
  all: ['galleries'] as const,
  lists: () => [...sanityGalleryKeys.all, 'list'] as const,
  list: () => [...sanityGalleryKeys.lists()] as const,
  details: () => [...sanityGalleryKeys.all, 'detail'] as const,
  detail: (id: string) => [...sanityGalleryKeys.details(), id] as const,
  search: (query: string) => [...sanityGalleryKeys.all, 'search', query] as const,
  category: (category: string) => [...sanityGalleryKeys.all, 'category', category] as const,
  images: () => [...sanityGalleryKeys.all, 'images'] as const,
};

export const useSanityGallery = () => {
  const {
    data: galleries,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: sanityGalleryKeys.list(),
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
    queryKey: sanityGalleryKeys.category(category),
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
    queryKey: sanityGalleryKeys.search(query),
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
    queryKey: sanityGalleryKeys.detail(id),
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
    queryKey: sanityGalleryKeys.images(),
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
