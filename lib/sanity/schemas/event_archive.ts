import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'event_archive',
  title: 'Event Archive',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Event Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'mediaResources',
      title: 'Media Resources',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'mediaResource',
          fields: [
            {
              name: 'type',
              title: 'Media Type',
              type: 'string',
              options: {
                list: [
                  { title: 'Image', value: 'image' },
                  { title: 'Video', value: 'video' },
                  { title: 'YouTube Link', value: 'youtube' },
                  { title: 'Document', value: 'document' },
                  { title: 'Other Link', value: 'link' },
                ],
              },
              validation: (rule) => rule.required(),
            },
            {
              name: 'image',
              title: 'Image File',
              type: 'image',
              options: {
                hotspot: true,
              },
              hidden: ({ parent }) => parent?.type !== 'image',
            },
            {
              name: 'imageUrl',
              title: 'Image URL (Alternative)',
              type: 'url',
              description: 'Eğer dosya yüklemek istemiyorsanız, resim URL\'i girebilirsiniz',
              hidden: ({ parent }) => parent?.type !== 'image',
              validation: (rule) => rule.uri({ scheme: ['http', 'https'] }),
            },
            {
              name: 'video',
              title: 'Video File',
              type: 'file',
              options: {
                accept: 'video/*',
              },
              hidden: ({ parent }) => parent?.type !== 'video',
            },
            {
              name: 'videoUrl',
              title: 'Video URL (Alternative)',
              type: 'url',
              description: 'Eğer dosya yüklemek istemiyorsanız, video URL\'i girebilirsiniz',
              hidden: ({ parent }) => parent?.type !== 'video',
              validation: (rule) => rule.uri({ scheme: ['http', 'https'] }),
            },
            {
              name: 'youtubeUrl',
              title: 'YouTube URL',
              type: 'url',
              hidden: ({ parent }) => parent?.type !== 'youtube',
              validation: (rule) => rule.uri({ scheme: ['http', 'https'] }),
            },
            {
              name: 'document',
              title: 'Document File',
              type: 'file',
              hidden: ({ parent }) => parent?.type !== 'document',
            },
            {
              name: 'documentUrl',
              title: 'Document URL (Alternative)',
              type: 'url',
              description: 'Eğer dosya yüklemek istemiyorsanız, doküman URL\'i girebilirsiniz',
              hidden: ({ parent }) => parent?.type !== 'document',
              validation: (rule) => rule.uri({ scheme: ['http', 'https'] }),
            },
            {
              name: 'externalUrl',
              title: 'External URL',
              type: 'url',
              hidden: ({ parent }) => parent?.type !== 'link',
              validation: (rule) => rule.uri({ scheme: ['http', 'https'] }),
            },
            {
              name: 'order',
              title: 'Display Order',
              type: 'number',
              initialValue: 0,
            },
          ],
          preview: {
            select: {
              type: 'type',
              media: 'image',
            },
            prepare(value) {
              const { type, media } = value as { type: string; media?: any };
              return {
                title: type,
                subtitle: 'Media Resource',
                media,
              };
            },
          },
        },
      ],
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      mediaCount: 'mediaResources',
    },
    prepare(value) {
      const { title, mediaCount } = value as { title: string; mediaCount?: any[] };
      const mediaCountText = mediaCount ? `${mediaCount.length} media` : 'No media';
      return {
        title,
        subtitle: mediaCountText,
      };
    },
  },
})
