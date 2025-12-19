import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'user',
  title: 'Kullanıcı',
  type: 'document',
  fields: [
    defineField({
      name: 'firstName',
      title: 'Ad',
      type: 'string',
      validation: (rule) => rule.required().min(2).max(50),
    }),
    defineField({
      name: 'lastName',
      title: 'Soyad',
      type: 'string',
      validation: (rule) => rule.required().min(2).max(50),
    }),
    defineField({
      name: 'email',
      title: 'E-posta',
      type: 'string',
      validation: (rule) => rule.email(),
    }),
    defineField({
      name: 'profileImage',
      title: 'Profil Resmi',
      type: 'image',
      options: {
        hotspot: true,
        metadata: ['palette'],
        accept: 'image/*',
      },
    }),
    defineField({
      name: 'isActive',
      title: 'Aktif',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'title',
      title: 'Ünvan',
      type: 'string',
      description: 'Kullanıcının ünvanı (örn: Başkan, Başkan Yardımcısı, Üye)',
    }),
    defineField({
      name: 'category',
      title: 'Kategori',
      type: 'string',
      options: {
        list: [
          { title: 'HSD Management', value: 'HSD_MANAGEMENT' },
          { title: 'General Management', value: 'GENERAL_MANAGEMENT' },
        ],
      },
      description: 'Kullanıcının bağlı olduğu kategori',
    }),
    defineField({
      name: 'order',
      title: 'Sıra',
      type: 'number',
      description: 'Kullanıcının listelenme sırası (düşük sayı önce gösterilir)',
      validation: (rule) => rule.min(0).integer(),
    }),
  ],
  preview: {
    select: {
      firstName: 'firstName',
      lastName: 'lastName',
      email: 'email',
      title: 'title',
      category: 'category',
      order: 'order',
      media: 'profileImage',
    },
    prepare(selection) {
      const { firstName, lastName, email, title, category, order, media } = selection
      return {
        title: `${firstName} ${lastName}`,
        subtitle: `${title || 'Ünvan yok'} • ${email} • ${category || 'Kategori yok'} • Sıra: ${order || 'Belirtilmemiş'}`,
        media: media,
      }
    },
  },
  orderings: [
    {
      title: 'Sıra (Order)',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
    {
      title: 'Ad Soyad',
      name: 'nameAsc',
      by: [
        { field: 'firstName', direction: 'asc' },
        { field: 'lastName', direction: 'asc' },
      ],
    },
    {
      title: 'E-posta',
      name: 'emailAsc',
      by: [{ field: 'email', direction: 'asc' }],
    },
    {
      title: 'Oluşturulma Tarihi',
      name: 'createdDesc',
      by: [{ field: '_createdAt', direction: 'desc' }],
    },
  ],
})
