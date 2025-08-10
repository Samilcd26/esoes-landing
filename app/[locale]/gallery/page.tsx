"use client"
import React, { useState } from 'react'
import { GalleryGrid } from '@/components/ui/gallery-grid'
import { useSanityGallery } from '@/hooks/useSanityGallery'
import { LoaderOne } from '@/components/ui/loader'
import { HoverBorderGradient } from '@/components/ui/hover-border-gradient'
import { useTranslations } from 'next-intl'

const Gallery = () => {
  const t = useTranslations('gallery')
  const { galleries, isLoading, error } = useSanityGallery()
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const categories = [
    { value: 'all', label: t('categories.all') },
    { value: 'events', label: t('categories.events') },
    { value: 'workshops', label: t('categories.workshops') },
    { value: 'meetings', label: t('categories.meetings') },
    { value: 'activities', label: t('categories.activities') },
    { value: 'other', label: t('categories.other') },
  ]

  const filteredGalleries = selectedCategory === 'all' 
    ? galleries 
    : galleries.filter(gallery => gallery.category === selectedCategory)
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoaderOne />
          <h2 className="text-2xl font-bold text-white mt-8 mb-4">{t('loading.title')}</h2>
          <p className="text-gray-300">{t('loading.subtitle')}</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">{t('error.title')}</h2>
          <p className="text-gray-600 mb-4">{t('error.message')}</p>
          <button 
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.location.reload();
              }
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            {t('error.retry')}
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
            {t('header.title')}
          </h1>
          <p className="text-xl text-gray-300 text-center mb-12 max-w-3xl mx-auto">
            {t('header.subtitle')}
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
              {selectedCategory === 'all' ? t('empty.all') : t('empty.category')}
            </h3>
            <p className="text-gray-500">
              {t('empty.subtitle')}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default Gallery