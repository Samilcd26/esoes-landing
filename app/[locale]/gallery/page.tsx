"use client"
import React, { useState } from 'react'
import { GalleryGrid } from '@/components/ui/gallery-grid'
import { useSanityGallery } from '@/hooks/useSanityGallery'
import { LoaderOne } from '@/components/ui/loader'
import { HoverBorderGradient } from '@/components/ui/hover-border-gradient'

const Gallery = () => {
  const { galleries, isLoading, error } = useSanityGallery()
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const categories = [
    { value: 'all', label: 'Tümü' },
    { value: 'events', label: 'Etkinlikler' },
    { value: 'workshops', label: 'Workshoplar' },
    { value: 'meetings', label: 'Toplantılar' },
    { value: 'activities', label: 'Aktiviteler' },
    { value: 'other', label: 'Diğer' },
  ]

  const filteredGalleries = selectedCategory === 'all' 
    ? galleries 
    : galleries.filter(gallery => gallery.category === selectedCategory)
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoaderOne />
          <h2 className="text-2xl font-bold text-white mt-8 mb-4">Galeri Yükleniyor</h2>
          <p className="text-gray-300">Fotoğraflar ve videolar hazırlanıyor...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Hata Oluştu</h2>
          <p className="text-gray-600 mb-4">Galeri yüklenirken bir sorun oluştu.</p>
          <button 
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.location.reload();
              }
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-b from-black/50 to-transparent py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-white text-center mb-8">
            Galeri
          </h1>
          <p className="text-xl text-gray-300 text-center mb-12 max-w-3xl mx-auto">
            ESOES&apos;in en güzel anlarını, etkinliklerini ve workshoplarını keşfedin
          </p>
          
          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {categories.map((category) => (
              <HoverBorderGradient 
                key={category.value}
                as="div"
                onClick={() => setSelectedCategory(category.value)}
                className={selectedCategory === category.value ? "bg-white/20" : "bg-transparent"}
              >
                <span className="text-white cursor-pointer px-4 py-2">
                  {category.label}
                </span>
              </HoverBorderGradient>
            ))}
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      {filteredGalleries.length > 0 ? (
        <GalleryGrid galleries={filteredGalleries} />
      ) : (
        <div className="min-h-[50vh] flex items-center justify-center">
          <div className="text-center">
            <h3 className="text-2xl font-semibold text-gray-600 mb-4">
              {selectedCategory === 'all' ? 'Henüz galeri içeriği yok' : 'Bu kategoride içerik bulunamadı'}
            </h3>
            <p className="text-gray-500">
              Yakında yeni içerikler eklenecek.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default Gallery