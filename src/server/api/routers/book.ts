import { createRoleProtectedProcedure } from "~/server/middlewares/trpc-rbac";
import { createTRPCRouter } from "../trpc";
import { BookQuerySchema } from "../schemas/book";
import { getAllBooks } from "../services/book";

export const bookRouter = createTRPCRouter({
  getAllBooks: createRoleProtectedProcedure(["unauth"])
    .input(BookQuerySchema)
    .query(async ({ ctx, input }) => {
      return await getAllBooks(ctx.db, input);
    }),
});
