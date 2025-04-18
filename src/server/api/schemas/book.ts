import { z } from "zod";

export const BookQuerySchema = z.object({
  id: z.number().optional(),
  title: z.string().optional(),
  author: z.string().optional(),
  publisher: z.string().optional(),
  categoryId: z.number().optional(),
  limit: z.number().optional(),
  offset: z.number().optional(),
});
export const UpdateBookQuerySchema = z.object({
  id: z.number(),
  title: z.string().optional(),
  author: z.string().optional(),
  publisher: z.string().optional(),
  publicationDate: z.date().optional(),
  categoryId: z.number().optional(),
});
