import {defineField, defineType} from 'sanity'

export const siteSettingsType = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Site Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'favicon',
      title: 'Favicon',
      type: 'image',
      description: 'The favicon is the icon used in the browser tab and bookmarks. It should be a square image, preferably 32x32 pixels.',
    }),
    defineField({
      name: "themeColor",
      title: "Theme Color",
      type: "color",
      description: "The theme color is used for the browser's address bar and other UI elements. It should be a color that represents your brand.",
      validation: (rule) => rule.required(),
        options: {
    disableAlpha: true
  }
    }),
  ]
})
