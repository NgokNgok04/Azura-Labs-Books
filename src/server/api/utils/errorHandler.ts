import { TRPCError } from "@trpc/server";

export const handleError = (
  message: string,
  code: "CONFLICT" | "BAD_REQUEST",
) => {
  throw new TRPCError({ code, message });
};
