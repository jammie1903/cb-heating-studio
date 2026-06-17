import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { colorInput } from '@sanity/color-input'
import { schemaTypes } from './schemaTypes'
import { SANITY_DATASET, SANITY_PROJECT_ID } from './sanity.constants'

const SITE_SETTINGS_ID = 'siteSettings'
const COMPANY_INFO_ID = 'companyInfo'
const HOME_PAGE_ID = 'homePage'
const MAX_PAGE_DEPTH = 3
const PAGE_BY_PARENT_TEMPLATE_ID = 'page-by-parent'

const pageNode = (S: any, pageId: string, depth: number) =>
  S.list()
    .title('Page')
    .items([
      S.listItem()
        .title('Edit Page')
        .child(
          S.document()
            .schemaType('page')
            .documentId(pageId)
        ),
      ...(depth < MAX_PAGE_DEPTH
        ? [
          S.listItem()
            .title('Children')
            .child(pageListByParent(S, pageId, depth + 1)),
        ]
        : []),
    ])

const pageListByParent = (S: any, parentId: string, depth: number) =>
  S.documentTypeList('page')
    .title(depth === 2 ? 'Child Pages' : 'Grandchild Pages')
    .filter('_type == "page" && parent._ref == $parentId')
    .params({ parentId })
    .initialValueTemplates([
      S.initialValueTemplateItem(PAGE_BY_PARENT_TEMPLATE_ID, { parentId }),
    ])
    .child((pageId: string) =>
      depth >= MAX_PAGE_DEPTH
        ? S.document()
          .schemaType('page')
          .documentId(pageId)
        : pageNode(S, pageId, depth)
    )

const topLevelPageList = (S: any) =>
  S.documentTypeList('page')
    .title('Top-Level Pages')
    .filter('_type == "page" && !defined(parent) && !(_id in [$homeId, $draftHomeId])')
    .params({ homeId: HOME_PAGE_ID, draftHomeId: `drafts.${HOME_PAGE_ID}` })
    .child((pageId: string) => pageNode(S, pageId, 1))

export default defineConfig({
  name: 'default',
  title: 'CB Heating Website',

  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,

  plugins: [
    colorInput(),
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.documentTypeListItem('post').title('Posts'),
            S.listItem()
              .title('Pages')
              .child(
                S.list()
                  .title('Pages')
                  .items([
                    S.listItem()
                      .title('Home Page')
                      .id(HOME_PAGE_ID)
                      .child(
                        S.document()
                          .schemaType('page')
                          .documentId(HOME_PAGE_ID)
                      ),
                    S.listItem()
                      .title('Top-Level Pages')
                      .child(topLevelPageList(S)),
                    S.listItem()
                      .title('All Pages')
                      .child(
                        S.documentTypeList('page')
                          .title('All Pages')
                          .filter('_type == "page" && !(_id in [$homeId, $draftHomeId])')
                          .params({ homeId: HOME_PAGE_ID, draftHomeId: `drafts.${HOME_PAGE_ID}` })
                      ),
                  ])
              ),
            S.divider(),
            S.documentTypeListItem('form').title('Forms'),
            S.listItem()
              .title('Company Info')
              .id(COMPANY_INFO_ID)
              .child(
                S.document()
                  .schemaType('companyInfo')
                  .documentId(COMPANY_INFO_ID)
              ),
            S.listItem()
              .title('Site Settings')
              .id(SITE_SETTINGS_ID)
              .child(
                S.document()
                  .schemaType('siteSettings')
                  .documentId(SITE_SETTINGS_ID)
              ),
            S.divider(),
            S.listItem()
              .title('Developer Tasks')
              .child(
                S.list()
                  .title('Developer Tasks')
                  .items([
                    S.listItem()
                      .title('Open Tasks')
                      .child(
                        S.documentTypeList('task')
                          .title('Open Tasks')
                          .filter('_type == "task" && status != "done"')
                      ),
                    S.listItem()
                      .title('Closed Tasks')
                      .child(
                        S.documentTypeList('task')
                          .title('Closed Tasks')
                          .filter('_type == "task" && status == "done"')
                      ),
                  ])
              ),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
    templates: (prev) => [
      ...prev,
      {
        id: PAGE_BY_PARENT_TEMPLATE_ID,
        title: 'Page (with parent)',
        schemaType: 'page',
        parameters: [{ name: 'parentId', type: 'string' }],
        value: ({ parentId }: { parentId?: string }) => ({
          parent: parentId ? { _type: 'reference', _ref: parentId } : undefined,
        }),
      },
    ],
  },
  document: {
    actions: (prev, context) => {
      const id = context.documentId?.replace('drafts.', '')
      const protectedSingletonIds = [HOME_PAGE_ID, COMPANY_INFO_ID, SITE_SETTINGS_ID]
      if (!id || !protectedSingletonIds.includes(id)) return prev

      return prev.filter((action) => action.action !== 'delete')
    },
  },
})
