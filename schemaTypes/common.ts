import { defineField } from 'sanity'
import { CompactImageBlockPreview } from './compactImageBlockPreview'

const HOME_PAGE_DOCUMENT_ID = 'homePage'

export const commonFields = (isPost = false) => [
  defineField({
    name: 'title',
    type: 'string',
    validation: (rule) => rule.required(),
  }),
  defineField({
    name: 'id',
    title: 'Id',
    type: 'slug',
    options: { source: 'title', maxLength: 96 },
    validation: (rule) =>
      rule.required().custom((value, context) => {
        const currentDocumentId = context.document?._id?.replace('drafts.', '')
        if (currentDocumentId !== HOME_PAGE_DOCUMENT_ID) return true

        return value?.current === 'home'
          ? true
          : 'The Home Page id must be set to "home"'
      }),
  }),
  defineField({
    name: 'description',
    type: 'text',
    rows: 3,
    description: 'A short description of the page for SEO purposes. It will not directly show up on the page, but will be used in search engine results.' + (isPost ? ' This description will also be shown on the post listing page.' : ''),
    validation: (rule) => rule.max(160).warning('Description should be under 160 characters for SEO purposes.'),
  }),
  defineField({
    name: 'image',
    type: 'image',
  }),
]

const imageBlock = defineField({
  name: 'imageBlock',
  title: 'Image',
  type: 'image',
  options: { hotspot: true },
  fields: [
    defineField({
      name: 'alt',
      title: 'Alt Text',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
    }),
  ],
  preview: {
    select: {
      title: 'caption',
      subtitle: 'alt',
      asset: 'asset',
    },
    prepare({ title, subtitle, asset }) {
      return {
        title: title || 'Image',
        subtitle: subtitle ? `Alt: ${subtitle}` : 'No alt text',
        asset,
      }
    },
  },
  components: {
    preview: CompactImageBlockPreview,
  },
})


const formBlock = defineField({
  name: 'formBlock',
  title: 'Form',
  type: 'object',
  fields: [
    defineField({
      name: 'formId',
      title: 'Form',
      type: 'reference',
      to: [{ type: 'form' }],
      options: {
        disableNew: true,
      },
      validation: (rule) => rule.required(),

    }),
  ],
  preview: {
    select: {
      formName: 'formId.name',
    },
    prepare({ formName }) {
      return {
        title: formName || 'Please select a form',
      }
    },
  },
})

export const bodyField = () => defineField({
  name: 'body',
  type: 'array',
  of: [
    { type: 'block' },
    imageBlock,
    formBlock,
  ],
})
