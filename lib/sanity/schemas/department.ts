import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'department',
  title: 'Departman',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'İsim',
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
      name: 'category',
      title: 'Kategori',
      type: 'string',
      options: {
        list: [
          { title: 'Genel', value: 'GENERAL' },
          { title: 'HSD', value: 'HSD' },
        ],
        layout: 'dropdown',
      },
      initialValue: 'GENERAL',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'images',
      title: 'Departman Görselleri',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
          },
        },
      ],
    }),
    defineField({
      name: 'responsible',
      title: 'Sorumlu Kullanıcılar',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'firstName',
              title: 'Ad',
              type: 'string',
              validation: (rule) => rule.required(),
            },
            {
              name: 'lastName',
              title: 'Soyad',
              type: 'string',
              validation: (rule) => rule.required(),
            },
            {
              name: 'title',
              title: 'Ünvan',
              type: 'string',
            },
            {
              name: 'image',
              title: 'Profil Görseli',
              type: 'image',
              options: {
                hotspot: true,
              },
            },
            {
              name: 'phone',
              title: 'Telefon Numarası',
              type: 'string',
            },
            {
              name: 'email',
              title: 'E-posta',
              type: 'string',
            },
          ],
        },
      ],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: 'assistant',
      title: 'Yardımcı Kullanıcılar',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'firstName',
              title: 'Ad',
              type: 'string',
              validation: (rule) => rule.required(),
            },
            {
              name: 'lastName',
              title: 'Soyad',
              type: 'string',
              validation: (rule) => rule.required(),
            },
            {
              name: 'title',
              title: 'Ünvan',
              type: 'string',
            },
            {
              name: 'image',
              title: 'Profil Görseli',
              type: 'image',
              options: {
                hotspot: true,
              },
            },
            {
              name: 'phone',
              title: 'Telefon Numarası',
              type: 'string',
            },
            {
              name: 'email',
              title: 'E-posta',
              type: 'string',
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'isActive',
      title: 'Aktif',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'order',
      title: 'Sıra',
      type: 'number',
      validation: (rule) => rule.required().min(1),
    }),
  ],
  preview: {
    select: {
      title: 'name',
      category: 'category',
      responsible: 'responsible',
      assistant: 'assistant',
      order: 'order',
      isActive: 'isActive',
    },
    prepare(selection: Record<string, unknown>) {
      const { title, category, responsible, assistant, order, isActive } = selection as {
        title: string;
        category?: string;
        responsible?: Array<{ firstName: string; lastName: string; title?: string }>;
        assistant?: Array<{ firstName: string; lastName: string; title?: string }>;
        order?: number;
        isActive?: boolean;
      };
      
      const responsibleNames = responsible?.map(r => `${r.firstName} ${r.lastName}${r.title ? ` (${r.title})` : ''}`).join(', ') || '';
      const assistantNames = assistant?.map(a => `${a.firstName} ${a.lastName}${a.title ? ` (${a.title})` : ''}`).join(', ') || '';
      
      const subtitle = [
        category || 'GENEL',
        responsibleNames && `Sorumlu: ${responsibleNames}`,
        assistantNames && `Yardımcı: ${assistantNames}`,
        `Sıra: ${order}`,
        isActive ? 'Aktif' : 'Pasif'
      ].filter(Boolean).join(' • ');
      
      return {
        title,
        subtitle,
      };
    },
  },
  orderings: [
    {
      title: 'Sıra',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
})
