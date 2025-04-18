import { type Book } from "@prisma/client";

export type BookQueryType = {
  id?: number;
  code?: string;
  limit?: number;
  offset?: number;
};

export type UpdateBookType = Partial<Book>;
export type CreateBookType = Required<Omit<Book, "id">>;
