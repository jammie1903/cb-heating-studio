import {defineField, defineType} from 'sanity'

export const formType = defineType({
  name: 'form',
  title: 'Form',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'accessKey',
      title: 'Access Key',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
  ],
})
