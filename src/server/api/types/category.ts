import type { Category } from "@prisma/client";

export type CreateCategoryType = Required<Omit<Category, "id">>;
export type UpdateCategoryType = Partial<Category>;
export type DeleteCategoryType = Partial<Category>;
