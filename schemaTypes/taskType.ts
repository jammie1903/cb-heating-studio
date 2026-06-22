import { defineField, defineType } from "sanity"

const types: Record<string, string> = {
  chore: "Chore",
  bug: "Bug",
  fr: "Feature Request"
};

const statuses: Record<string, string> = {
  todo: "To Do",
  in_progress: "In Progress",
  test: "Testing",
  done: "Done"
};

export const taskType = defineType({
  name: "task",
  title: "Task",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "type",
      title: "Type",
      type: "string",
      options: {
        list: Object.entries(types).map(([value, title]) => ({ value, title })),
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: Object.entries(statuses).map(([value, title]) => ({ value, title })),
        layout: "radio",
      },
      initialValue: "todo",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "summary",
      title: "Summary",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "files",
      title: "Attached Files",
      type: "array",
      of: [{ type: "file" }],
    }),
  ],
  preview: {
    select: {
      title: "title",
      type: "type",
      status: "status",
    },
    prepare({ title, type, status }) {
      const typeLabel = types[type] ?? type
      const statusLabel = statuses[status] ?? status
      return {
        title,
        subtitle: `${typeLabel} · ${statusLabel}`,
      }
    },
  },
})
