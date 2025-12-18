import { z } from "zod";



import { Types } from "mongoose";

const escapeRegex = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const listCarsSchema = z.object({
  brand: z
    .string()
    .trim()
    .min(1)
    .transform(v => new RegExp(`^${escapeRegex(v)}$`, "i"))
    .optional(),

  model: z
    .string()
    .trim()
    .min(1)
    .transform(v => new RegExp(`^${escapeRegex(v)}$`, "i"))
    .optional(),

  year: z
    .coerce.number()
    .int()
    .gt(1900)
    .optional(),

  dealerId: z
    .string()
    .refine(Types.ObjectId.isValid, "Invalid dealerId")
    .transform(id => new Types.ObjectId(id))
    .optional(),

  page: z
    .coerce.number()
    .int()
    .positive()
    .default(1),

  limit: z
    .coerce.number()
    .int()
    .positive()
    .max(50)
    .default(10),
});
