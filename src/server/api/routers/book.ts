import { createRoleProtectedProcedure } from "~/server/middlewares/trpc-rbac";
import { createTRPCRouter } from "../trpc";
import {
  BookQuerySchema,
  CreateBookQuerySchema,
  UpdateBookQuerySchema,
} from "../schemas/book";
import {
  createBook,
  deleteBook,
  editBook,
  getAllBooks,
} from "../services/book";

export const bookRouter = createTRPCRouter({
  getAllBooks: createRoleProtectedProcedure(["unauth"])
    .input(BookQuerySchema)
    .query(async ({ ctx, input }) => {
      return await getAllBooks(ctx.db, input);
    }),
  createBook: createRoleProtectedProcedure(["unauth"])
    .input(CreateBookQuerySchema)
    .mutation(async ({ ctx, input }) => {
      return await createBook(ctx.db, input);
    }),
  editBook: createRoleProtectedProcedure(["unauth"])
    .input(UpdateBookQuerySchema)
    .mutation(async ({ ctx, input }) => {
      return await editBook(ctx.db, input);
    }),
  deleteBook: createRoleProtectedProcedure(["unauth"])
    .input(BookQuerySchema)
    .mutation(async ({ ctx, input }) => {
      return await deleteBook(ctx.db, input);
    }),
});
