import type { PrismaClient } from "@prisma/client";
import type { BookQueryType } from "../types/book";

export const getAllBooks = async (db: PrismaClient, input: BookQueryType) => {
  const { limit, offset, ...whereInput } = input;

  const books = await db.book.findMany({
    where: whereInput,
    take: limit,
    skip: offset,
  });

  return books;
};
