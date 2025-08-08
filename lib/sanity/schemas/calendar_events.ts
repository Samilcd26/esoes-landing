import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'event',
  title: 'Calendar Event',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Event Title',
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
      name: 'startDate',
      title: 'Start Date',
      type: 'datetime',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'endDate',
      title: 'End Date',
      type: 'datetime',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Technical', value: 'technical' },
          { title: 'Social', value: 'social' },
          { title: 'Workshop', value: 'workshop' },
          { title: 'Game Jam', value: 'gamejam' },
          { title: 'Summit', value: 'summit' },
          { title: 'Other', value: 'other' },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Event Image',
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
      title: 'Published',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'organizer',
      title: 'Organizer',
      type: 'string',
    }),
    defineField({
      name: 'maxParticipants',
      title: 'Maximum Participants',
      type: 'number',
    }),
    defineField({
      name: 'registrationRequired',
      title: 'Registration Required',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'registrationUrl',
      title: 'Registration URL',
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
      const date = startDate ? new Date(startDate).toLocaleDateString() : 'No date';
      const status = isPublished ? 'Published' : 'Draft';
      return {
        title,
        subtitle: `${category} • ${date} • ${status}`,
      };
    },
  },
})
