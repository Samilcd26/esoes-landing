import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'faq',
  title: 'Sık Sorulan Sorular',
  type: 'document',
  fields: [
    defineField({
      name: 'question',
      title: 'Soru',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'answer',
      title: 'Cevap',
      type: 'text',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Kategori',
      type: 'string',
      options: {
        list: [
          { title: 'Genel', value: 'general' },
          { title: 'Etkinlikler', value: 'events' },
          { title: 'Üyelik', value: 'membership' },
          { title: 'Teknik', value: 'technical' },
          { title: 'Diğer', value: 'other' },
        ],
      },
      validation: (rule) => rule.required(),
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
  ],
  preview: {
    select: {
      title: 'question',
      category: 'category',
      order: 'order',
    },
    prepare(selection: Record<string, unknown>) {
      const { title, category, order } = selection;
      return {
        title: title as string,
        subtitle: `${category} • Sıra: ${order}`,
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
