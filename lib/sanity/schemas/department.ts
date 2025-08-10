import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'department',
  title: 'Department',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
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
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'General', value: 'GENERAL' },
          { title: 'HSD', value: 'HSD' },
        ],
        layout: 'dropdown',
      },
      initialValue: 'GENERAL',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'images',
      title: 'Department Images',
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
      name: 'responsibleUserName',
      title: 'Responsible User Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'responsibleUserImage',
      title: 'Responsible User Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'responsibleUserNotes',
      title: 'Responsible User Notes',
      type: 'text',
    }),
    defineField({
      name: 'phone',
      title: 'Phone Number',
      type: 'string',
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
    }),
    defineField({
      name: 'assistants',
      title: 'Assistants',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'name',
              title: 'Name',
              type: 'string',
              validation: (rule) => rule.required(),
            },
            {
              name: 'phone',
              title: 'Phone Number',
              type: 'string',
            },
            {
              name: 'email',
              title: 'Email',
              type: 'string',
            },
            {
              name: 'notes',
              title: 'Notes',
              type: 'text',
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
      title: 'Active',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      validation: (rule) => rule.required().min(1),
    }),
  ],
  preview: {
    select: {
      title: 'name',
      category: 'category',
      responsibleUser: 'responsibleUserName',
      order: 'order',
      isActive: 'isActive',
    },
    prepare(selection: Record<string, unknown>) {
      const { title, category, responsibleUser, order, isActive } = selection as {
        title: string;
        category?: string;
        responsibleUser?: string;
        order?: number;
        isActive?: boolean;
      };
      return {
        title,
        subtitle: `${category || 'GENERAL'} • ${responsibleUser || ''} • Order: ${order} • ${isActive ? 'Active' : 'Inactive'}`,
      };
    },
  },
  orderings: [
    {
      title: 'Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
})
