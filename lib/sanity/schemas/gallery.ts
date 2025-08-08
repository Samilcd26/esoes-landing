import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'gallery',
  title: 'Gallery',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Events', value: 'events' },
          { title: 'Workshops', value: 'workshops' },
          { title: 'Meetings', value: 'meetings' },
          { title: 'Activities', value: 'activities' },
          { title: 'Other', value: 'other' },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'mediaItems',
      title: 'Media Items',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'imageItem',
          title: 'Image',
          fields: [
            {
              name: 'image',
              title: 'Image',
              type: 'image',
              options: {
                hotspot: true,
                metadata: ['dimensions', 'palette'],
                // Sanity otomatik olarak resimleri optimize eder
                // Bu ayarlar sıkıştırma ve boyutlandırma için
                accept: 'image/*',
              },
              validation: (rule) => rule.required(),
            },
            {
              name: 'alt',
              title: 'Alt Text',
              type: 'string',
              description: 'Accessibility için alt text',
            },
            {
              name: 'caption',
              title: 'Caption',
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
              title: 'Video File',
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
              title: 'Poster Image',
              type: 'image',
              description: 'Video için poster görseli',
            },
            {
              name: 'caption',
              title: 'Caption',
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
          title: 'External Link',
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
              title: 'Title',
              type: 'string',
            },
            {
              name: 'description',
              title: 'Description',
              type: 'text',
              rows: 2,
            },
            {
              name: 'thumbnail',
              title: 'Thumbnail',
              type: 'image',
              description: 'Link için thumbnail görseli',
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
      title: 'Order',
      type: 'number',
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: 'isActive',
      title: 'Active',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
    }),
    defineField({
      name: 'date',
      title: 'Date',
      type: 'datetime',
      description: 'Gallery içeriğinin tarihi',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      category: 'category',
      media: 'mediaItems.0.image',
      order: 'order',
    },
    prepare(selection: {
      title: string
      category: string
      media: any
      order: number
    }) {
      const { title, category, media, order } = selection
      return {
        title,
        subtitle: `${category} • Order: ${order}`,
        media,
      }
    },
  },
  orderings: [
    {
      title: 'Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
    {
      title: 'Date',
      name: 'dateDesc',
      by: [{ field: 'date', direction: 'desc' }],
    },
  ],
})
