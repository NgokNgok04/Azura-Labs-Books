import { z } from "zod";

export const CreateCategorySchema = z.object({
  name: z.string(),
});

export const UpdateCategorySchema = z.object({
  name: z.string().optional(),
});

export const DeleteCategorySchema = z.object({
  id: z.number().optional(),
  name: z.string().optional(),
});
