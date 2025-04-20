import type { PrismaClient } from "@prisma/client";
import type {
  CreateCategoryType,
  DeleteCategoryType,
  UpdateCategoryType,
} from "../types/category";
import { handleError } from "../utils/errorHandler";

export const getCategories = async (db: PrismaClient) => {
  return await db.category.findMany();
};

export const createCategory = async (
  db: PrismaClient,
  input: CreateCategoryType,
) => {
  console.log("Received input:", input);
  const checkCategory = await db.category.findFirst({
    where: {
      name: input.name,
    },
  });

  if (checkCategory) {
    handleError("Book with that title already exist", "BAD_REQUEST");
    return;
  }

  return await db.category.create({
    data: {
      name: input.name,
    },
  });
};

export const updateCategory = async (
  db: PrismaClient,
  input: UpdateCategoryType,
) => {
  const checkCategory = await db.category.findFirst({
    where: {
      name: input.name,
    },
  });

  if (checkCategory) {
    handleError("Book with that title already exist", "BAD_REQUEST");
    return;
  }
  return await db.category.update({
    where: {
      id: input.id,
    },
    data: {
      name: input.name,
    },
  });
};
export const deleteCategory = async (
  db: PrismaClient,
  input: DeleteCategoryType,
) => {
  return await db.category.deleteMany({
    where: input,
  });
};
