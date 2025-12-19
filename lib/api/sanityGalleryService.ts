/* eslint-disable @typescript-eslint/no-explicit-any */
import { sanityClient } from '../sanity/client'
import {
  activeGalleryQuery,
  galleryByCategoryQuery,
  allGalleryQuery,
  searchGalleryQuery,
  singleGalleryQuery,
  galleryImagesQuery,
} from '../sanity/queries/gallery'

export interface GalleryMediaItem {
  _type: 'imageItem' | 'videoItem' | 'externalLink'
  _key: string
  // Image fields
  image?: {
    _type: string
    asset: {
      _ref: string
      _type: string
    }
  }
  alt?: string
  caption?: string
  // Video fields
  video?: {
    _type: string
    asset: {
      _ref: string
      _type: string
    }
  }
  poster?: {
    _type: string
    asset: {
      _ref: string
      _type: string
    }
  }
  // External link fields
  url?: string
  platform?: string
  title?: string
  description?: string
  thumbnail?: {
    _type: string
    asset: {
      _ref: string
      _type: string
    }
  }
}

export interface Gallery {
  _id: string
  _type: string
  title: string
  description?: string
  category: string
  mediaItems: GalleryMediaItem[]
  order: number
  isActive: boolean
  tags?: string[]
  date?: string
  _createdAt: string
  _updatedAt: string
}

export interface GalleryImagesResult {
  _id: string
  title: string
  category: string
  mediaItems: Array<{
    _type: string
    _key: string
    image?: {
      _type: string
      asset: {
        _ref: string
        _type: string
      }
    }
    alt?: string
    caption?: string
  }>
}

export class SanityGalleryService {
  // Tüm aktif gallery'leri getir
  static async getActiveGalleries(): Promise<Gallery[]> {
    try {
      const galleries = await sanityClient.fetch(activeGalleryQuery)
      return galleries
    } catch (error) {
      console.error('Error fetching active galleries:', error)
      throw error
    }
  }

  // Kategoriye göre gallery'ler
  static async getGalleriesByCategory(category: string): Promise<Gallery[]> {
    try {
      const galleries = await sanityClient.fetch(galleryByCategoryQuery, { category })
      return galleries
    } catch (error) {
      console.error('Error fetching galleries by category:', error)
      throw error
    }
  }

  // Tüm gallery'leri getir (admin için)
  static async getAllGalleries(): Promise<Gallery[]> {
    try {
      const galleries = await sanityClient.fetch(allGalleryQuery)
      return galleries
    } catch (error) {
      console.error('Error fetching all galleries:', error)
      throw error
    }
  }

  // Gallery arama
  static async searchGalleries(query: string): Promise<Gallery[]> {
    try {
      const galleries = await sanityClient.fetch(searchGalleryQuery, { query } as any)
      return galleries
    } catch (error) {
      console.error('Error fetching galleries by category:', error)
      throw error
    }
  }

  // Tek bir gallery getir
  static async getGalleryById(id: string): Promise<Gallery | null> {
    try {
      const gallery = await sanityClient.fetch(singleGalleryQuery, { id }) as Gallery | null
      return gallery
    } catch (error) {
      console.error('Error fetching gallery by id:', error)
      throw error
    }
  }

  // Sadece resimler
  static async getGalleryImages(): Promise<GalleryImagesResult[]> {
    try {
      const images = await sanityClient.fetch(galleryImagesQuery) as GalleryImagesResult[]
      return images
    } catch (error) {
      console.error('Error fetching gallery images:', error)
      throw error
    }
  }
}
