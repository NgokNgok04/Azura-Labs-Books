import type { PrismaClient } from "@prisma/client";
import type { BookQueryType, UpdateBookType } from "../types/book";
import { handleError } from "../utils/errorHandler";

export const getAllBooks = async (db: PrismaClient, input: BookQueryType) => {
  const { limit, offset, ...whereInput } = input;

  const books = await db.book.findMany({
    where: whereInput,
    take: limit,
    skip: offset,
  });

  return books;
};

export const editBook = async (db: PrismaClient, input: UpdateBookType) => {
  const { id, ...data } = input;
  console.log("Received input:", input);

  const oldData = await db.book.findFirst({
    where: {
      id,
    },
  });
  const checkBook = await db.book.findFirst({
    where: {
      title: data.title,
    },
  });

  if (oldData && checkBook && oldData.title != checkBook.title) {
    handleError("Book with that title already exist", "BAD_REQUEST");
    return;
  }

  return await db.book.update({
    where: { id },
    data: {
      author: data.author,
      title: data.title,
      publicationDate: data.publicationDate,
      categoryId: data.categoryId,
      publisher: data.publisher,
    },
  });
};

export const getCategories = async (db: PrismaClient) => {
  return await db.category.findMany();
};
