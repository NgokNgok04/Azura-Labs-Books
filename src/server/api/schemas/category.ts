import { z } from "zod";

export const CreateCategorySchema = z.object({
  name: z.string(),
});

export const UpdateCategorySchema = z.object({
  id: z.number(),
  name: z.string().optional(),
});

export const DeleteCategorySchema = z.object({
  id: z.union([z.number(), z.object({ in: z.array(z.number()) })]),
  name: z.string().optional(),
});
