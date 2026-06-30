import { defineField, defineType } from "sanity"
import { DeployButton } from "../components/DeployAction"

export const siteSettingsType = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Site Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "favicon",
      title: "Favicon",
      type: "image",
      description: "The favicon is the icon used in the browser tab and bookmarks. It should be a square image, preferably 32x32 pixels.",
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
    defineField({
      name: "themeTextColor",
      title: "Theme Text Color",
      type: "color",
      description: "The theme text color used to complement your theme color.",
      validation: (rule) => rule.required(),
      options: {
        disableAlpha: true
      }
    }),
    defineField({
      name: "headerImage",
      title: "Header Image",
      type: "image"
    }),
    defineField({
      name: "serpApiKey",
      title: "SERP API Key",
      type: "string",
      description: "The API key for accessing the SERP (Search Engine Results Page) API.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "googleSiteVerificationId",
      title: "Google Site Verification ID",
      type: "string",
      description: "The Google Site Verification ID for verifying site ownership.",
    }),
    defineField({
      name: "deployHookUrl",
      title: "Deploy Hook URL",
      type: "url",
      description: "The URL for the deploy hook to trigger a rebuild of the site.",
      components: {
        input: DeployButton
      }
    }),
    defineField({
      name: "deployStatus",
      title: " ",
      type: "string",
      hidden: true
    })
  ]
})
