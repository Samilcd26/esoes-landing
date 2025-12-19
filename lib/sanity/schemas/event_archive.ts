import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'event_archive',
  title: 'Etkinlik Arşivi',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Etkinlik Adı',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Açıklama',
      type: 'text',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'mediaResources',
      title: 'Medya Kaynakları',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'mediaResource',
          fields: [
            {
              name: 'type',
              title: 'Medya Türü',
              type: 'string',
              options: {
                list: [
                  { title: 'Resim', value: 'image' },
                  { title: 'Video', value: 'video' },
                  { title: 'YouTube Bağlantısı', value: 'youtube' },
                  { title: 'Doküman', value: 'document' },
                  { title: 'Diğer Bağlantı', value: 'link' },
                ],
              },
              validation: (rule) => rule.required(),
            },
            {
              name: 'image',
              title: 'Resim Dosyası',
              type: 'image',
              options: {
                hotspot: true,
              },
              hidden: ({ parent }) => parent?.type !== 'image',
            },
            {
              name: 'imageUrl',
              title: 'Resim URL (Alternatif)',
              type: 'url',
              description: 'Eğer dosya yüklemek istemiyorsanız, resim URL\'i girebilirsiniz',
              hidden: ({ parent }) => parent?.type !== 'image',
              validation: (rule) => rule.uri({ scheme: ['http', 'https'] }),
            },
            {
              name: 'video',
              title: 'Video Dosyası',
              type: 'file',
              options: {
                accept: 'video/*',
              },
              hidden: ({ parent }) => parent?.type !== 'video',
            },
            {
              name: 'videoUrl',
              title: 'Video URL (Alternatif)',
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
              title: 'Doküman Dosyası',
              type: 'file',
              hidden: ({ parent }) => parent?.type !== 'document',
            },
            {
              name: 'documentUrl',
              title: 'Doküman URL (Alternatif)',
              type: 'url',
              description: 'Eğer dosya yüklemek istemiyorsanız, doküman URL\'i girebilirsiniz',
              hidden: ({ parent }) => parent?.type !== 'document',
              validation: (rule) => rule.uri({ scheme: ['http', 'https'] }),
            },
            {
              name: 'externalUrl',
              title: 'Harici URL',
              type: 'url',
              hidden: ({ parent }) => parent?.type !== 'link',
              validation: (rule) => rule.uri({ scheme: ['http', 'https'] }),
            },
            {
              name: 'order',
              title: 'Görüntüleme Sırası',
              type: 'number',
              initialValue: 0,
            },
          ],
          preview: {
            select: {
              type: 'type',
              media: 'image',
            },
            prepare(selection) {
              const { type, media } = selection;
              return {
                title: type as string,
                subtitle: 'Medya Kaynağı',
                media: media,
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
    prepare(selection) {
      const { title, mediaCount } = selection;
      const mediaCountText = mediaCount ? `${mediaCount.length} medya` : 'Medya yok';
      return {
        title,
        subtitle: mediaCountText,
      };
    },
  },
})
