import { createRoleProtectedProcedure } from "~/server/middlewares/trpc-rbac";
import { createTRPCRouter } from "../trpc";
import {
  createCategory,
  deleteCategory,
  getCategories,
} from "../services/category";
import {
  CreateCategorySchema,
  DeleteCategorySchema,
} from "../schemas/category";

export const categoryRouter = createTRPCRouter({
  getCategories: createRoleProtectedProcedure(["unauth"]).query(
    async ({ ctx }) => {
      return await getCategories(ctx.db);
    },
  ),
  createCategory: createRoleProtectedProcedure(["unauth"])
    .input(CreateCategorySchema)
    .mutation(async ({ ctx, input }) => {
      return await createCategory(ctx.db, input);
    }),
  deleteCategory: createRoleProtectedProcedure(["unauth"])
    .input(DeleteCategorySchema)
    .mutation(async ({ ctx, input }) => {
      return await deleteCategory(ctx.db, input);
    }),
});
