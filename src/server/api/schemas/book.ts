import { z } from "zod";

export const BookQuerySchema = z.object({
  id: z.number().optional(),
  title: z.string().optional(),
  author: z.string().optional(),
  publisher: z.string().optional(),
  limit: z.number().optional(),
  offset: z.number().optional(),
});
