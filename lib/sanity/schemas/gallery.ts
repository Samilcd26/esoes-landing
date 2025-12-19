import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'gallery',
  title: 'Galeri',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Başlık',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Açıklama',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'category',
      title: 'Kategori',
      type: 'string',
      options: {
        list: [
          { title: 'Etkinlikler', value: 'events' },
          { title: 'Atölyeler', value: 'workshops' },
          { title: 'Toplantılar', value: 'meetings' },
          { title: 'Aktiviteler', value: 'activities' },
          { title: 'Diğer', value: 'other' },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'mediaItems',
      title: 'Medya Öğeleri',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'imageItem',
          title: 'Resim',
          fields: [
            {
              name: 'image',
              title: 'Resim',
              type: 'image',
              options: {
                hotspot: true,
                metadata: ['palette'],
                // Sanity otomatik olarak resimleri optimize eder
                // Bu ayarlar sıkıştırma ve boyutlandırma için
                accept: 'image/*',
              },
              validation: (rule) => rule.required(),
            },
            {
              name: 'alt',
              title: 'Alt Metin',
              type: 'string',
              description: 'Erişilebilirlik için alt metin',
            },
            {
              name: 'caption',
              title: 'Açıklama',
              type: 'string',
            },
          ],
          preview: {
            select: {
              media: 'image',
              title: 'alt',
              subtitle: 'caption',
            },
          },
        },
        {
          type: 'object',
          name: 'videoItem',
          title: 'Video',
          fields: [
            {
              name: 'video',
              title: 'Video Dosyası',
              type: 'file',
              options: {
                accept: 'video/*',
                // Sanity video dosyalarını optimize eder
                storeOriginalFilename: true,
              },
              validation: (rule) => rule.required(),
            },
            {
              name: 'poster',
              title: 'Poster Görseli',
              type: 'image',
              description: 'Video için poster görseli',
            },
            {
              name: 'caption',
              title: 'Açıklama',
              type: 'string',
            },
          ],
          preview: {
            select: {
              media: 'poster',
              title: 'video.asset.originalFilename',
              subtitle: 'caption',
            },
          },
        },
        {
          type: 'object',
          name: 'externalLink',
          title: 'Harici Bağlantı',
          fields: [
            {
              name: 'url',
              title: 'URL',
              type: 'url',
              validation: (rule) => rule.required(),
            },
            {
              name: 'platform',
              title: 'Platform',
              type: 'string',
              options: {
                list: [
                  { title: 'YouTube', value: 'youtube' },
                  { title: 'Vimeo', value: 'vimeo' },
                  { title: 'Instagram', value: 'instagram' },
                  { title: 'Twitter', value: 'twitter' },
                  { title: 'LinkedIn', value: 'linkedin' },
                  { title: 'Other', value: 'other' },
                ],
              },
            },
            {
              name: 'title',
              title: 'Başlık',
              type: 'string',
            },
            {
              name: 'description',
              title: 'Açıklama',
              type: 'text',
              rows: 2,
            },
            {
              name: 'thumbnail',
              title: 'Küçük Resim',
              type: 'image',
              description: 'Link için küçük resim görseli',
            },
          ],
          preview: {
            select: {
              media: 'thumbnail',
              title: 'title',
              subtitle: 'url',
            },
          },
        },
      ],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: 'order',
      title: 'Sıra',
      type: 'number',
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: 'isActive',
      title: 'Aktif',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'tags',
      title: 'Etiketler',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
    }),
    defineField({
      name: 'date',
      title: 'Tarih',
      type: 'datetime',
      description: 'Galeri içeriğinin tarihi',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      category: 'category',
      media: 'mediaItems.0.image',
      order: 'order',
    },
    prepare(selection) {
      const { title, category, media, order } = selection
      return {
        title,
        subtitle: `${category} • Sıra: ${order}`,
        media: media,
      }
    },
  },
  orderings: [
    {
      title: 'Sıra',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
    {
      title: 'Tarih',
      name: 'dateDesc',
      by: [{ field: 'date', direction: 'desc' }],
    },
  ],
})
