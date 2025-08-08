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
  image?: any
  alt?: string
  caption?: string
  // Video fields
  video?: any
  poster?: any
  // External link fields
  url?: string
  platform?: string
  title?: string
  description?: string
  thumbnail?: any
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
      const galleries = await sanityClient.fetch(searchGalleryQuery, { query })
      return galleries
    } catch (error) {
      console.error('Error searching galleries:', error)
      throw error
    }
  }

  // Tek bir gallery getir
  static async getGalleryById(id: string): Promise<Gallery | null> {
    try {
      const gallery = await sanityClient.fetch(singleGalleryQuery, { id })
      return gallery
    } catch (error) {
      console.error('Error fetching gallery by id:', error)
      throw error
    }
  }

  // Sadece resimler
  static async getGalleryImages(): Promise<any[]> {
    try {
      const images = await sanityClient.fetch(galleryImagesQuery)
      return images
    } catch (error) {
      console.error('Error fetching gallery images:', error)
      throw error
    }
  }
}
