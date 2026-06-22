import {defineField, defineType} from "sanity"
import { bodyField, commonFields } from "./common"

const HOME_PAGE_DOCUMENT_ID = "homePage"

export const pageType = defineType({
  name: "page",
  title: "Page",
  type: "document",
  fields: [
    ...commonFields(),
    defineField({
      name: "parent",
      title: "Parent Page",
      type: "reference",
      to: [{type: "page"}],
      options: {
        filter: ({document}) => {
          const currentId = document?._id?.replace("drafts.", "")

          return {
            filter:
              "_type == 'page' && !(_id in [$homeId, $draftHomeId, $currentId, $draftCurrentId])",
            params: {
              homeId: HOME_PAGE_DOCUMENT_ID,
              draftHomeId: `drafts.${HOME_PAGE_DOCUMENT_ID}`,
              currentId,
              draftCurrentId: currentId ? `drafts.${currentId}` : undefined,
            },
          }
        },
      },
      validation: (rule) =>
        rule.custom((value, context) => {
          const currentId = context.document?._id?.replace("drafts.", "")
          const parentId = value?._ref?.replace("drafts.", "")

          if (currentId === HOME_PAGE_DOCUMENT_ID && parentId) {
            return "The Home Page cannot have a parent page"
          }

          if (parentId === HOME_PAGE_DOCUMENT_ID) {
            return "The Home Page cannot be used as a parent page"
          }

          if (!currentId || !parentId) return true
          if (currentId === parentId) return "A page cannot be its own parent"

          return true
        }),
    }),
    bodyField(),
  ],
})
