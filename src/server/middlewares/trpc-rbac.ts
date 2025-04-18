import { TRPCError } from "@trpc/server";
import { publicProcedure } from "~/server/api/trpc";

type allRoles = "unauth";

export const createRoleProtectedProcedure = (allowedRoles: allRoles[]) => {
  return publicProcedure.use(({ ctx, next }) => {
    if (!ctx.session?.user) {
      if (allowedRoles.includes("unauth")) {
        return next();
      } else {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
    }

    const userRole = "unauth";

    if (!allowedRoles.includes(userRole)) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "You don't have permission to access this resource",
      });
    }

    return next({
      ctx: {
        ...ctx,
        session: {
          ...ctx.session,
          user: {
            ...ctx.session.user,
            role: userRole,
          },
        },
      },
    });
  });
};
