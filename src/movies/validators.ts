import z from "zod";

export const movieSortOrderSchema = z.object({
  field: z.enum(['release', 'episode']).optional(),
  order: z.enum(['descending', 'ascending']).optional()
})

export type MovieSort = z.infer<typeof movieSortOrderSchema>
