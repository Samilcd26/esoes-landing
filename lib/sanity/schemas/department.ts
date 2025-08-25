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
      name: 'responsible',
      title: 'Responsible Users',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'firstName',
              title: 'First Name',
              type: 'string',
              validation: (rule) => rule.required(),
            },
            {
              name: 'lastName',
              title: 'Last Name',
              type: 'string',
              validation: (rule) => rule.required(),
            },
            {
              name: 'title',
              title: 'Title',
              type: 'string',
            },
            {
              name: 'image',
              title: 'Profile Image',
              type: 'image',
              options: {
                hotspot: true,
              },
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
          ],
        },
      ],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: 'assistant',
      title: 'Assistant Users',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'firstName',
              title: 'First Name',
              type: 'string',
              validation: (rule) => rule.required(),
            },
            {
              name: 'lastName',
              title: 'Last Name',
              type: 'string',
              validation: (rule) => rule.required(),
            },
            {
              name: 'title',
              title: 'Title',
              type: 'string',
            },
            {
              name: 'image',
              title: 'Profile Image',
              type: 'image',
              options: {
                hotspot: true,
              },
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
        category || 'GENERAL',
        responsibleNames && `Responsible: ${responsibleNames}`,
        assistantNames && `Assistant: ${assistantNames}`,
        `Order: ${order}`,
        isActive ? 'Active' : 'Inactive'
      ].filter(Boolean).join(' • ');
      
      return {
        title,
        subtitle,
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
