import { z } from "zod";

export const messageSchema = z.object({
  content: z
    .string()
    .min(10, { message: "Content must be at least of 10 char" })
    .max(30, { message: "Content cant be mre than 300 char" }),
});
