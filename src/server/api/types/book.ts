import { type Book } from "@prisma/client";

export type BookQueryType = {
  id?: number;
  title?: string;
  author?: string;
  publisher?: string;
  publicationDate?: Date;
  categoryId?: number;
  limit?: number;
  offset?: number;
};

export type DeleteBookType = {
  id?: number;
  title?: string;
  author?: string;
  publisher?: string;
  publicationDate?: Date;
  categoryId?: number;
};
export type UpdateBookType = Partial<Book>;
export type CreateBookType = Required<Omit<Book, "id">>;
