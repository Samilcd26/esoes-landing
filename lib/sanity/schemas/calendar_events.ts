import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'event',
  title: 'Takvim Etkinlikleri',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Etkinlik Başlığı',
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
      name: 'startDate',
      title: 'Başlangıç Tarihi',
      type: 'datetime',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'endDate',
      title: 'Bitiş Tarihi',
      type: 'datetime',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'location',
      title: 'Konum',
      type: 'string',
    }),
    defineField({
      name: 'category',
      title: 'Kategori',
      type: 'string',
      options: {
        list: [
          { title: 'Teknik', value: 'technical' },
          { title: 'Sosyal', value: 'social' },
          { title: 'Atölye', value: 'workshop' },
          { title: 'Game Jam', value: 'gamejam' },
          { title: 'Zirve', value: 'summit' },
          { title: 'Diğer', value: 'other' },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Etkinlik Görseli',
      type: 'image',
      options: {
        hotspot: true,
      },
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
    defineField({
      name: 'isPublished',
      title: 'Yayınlandı',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'organizer',
      title: 'Organizatör',
      type: 'string',
    }),
    defineField({
      name: 'maxParticipants',
      title: 'Maksimum Katılımcı',
      type: 'number',
    }),
    defineField({
      name: 'registrationRequired',
      title: 'Kayıt Gerekli',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'registrationUrl',
      title: 'Kayıt URL',
      type: 'url',
      hidden: ({ parent }) => !parent?.registrationRequired,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      category: 'category',
      startDate: 'startDate',
      isPublished: 'isPublished',
    },
    prepare(selection) {
      const { title, category, startDate, isPublished } = selection;
      const date = startDate ? new Date(startDate).toLocaleDateString('tr-TR') : 'Tarih yok';
      const status = isPublished ? 'Yayınlandı' : 'Taslak';
      return {
        title,
        subtitle: `${category} • ${date} • ${status}`,
      };
    },
  },
})
