import { z } from 'zod'

export const updateCarSchema = z.object({
  brand: z.string().trim().min(1),
  model: z.string().trim().min(1),

  year: z
    .number()
    .int()
    .min(1900)
    .max(new Date().getFullYear() + 1),

  price: z.number().positive().nullable().optional(),

  images: z.array(z.string().url()),

  specs: z.object({
    engine: z.string().trim().nullable().optional(),
    transmission: z.string().trim().nullable().optional(),
    fuelType: z.string().trim().nullable().optional(),
    horsepower: z.number().int().positive().nullable().optional(),
    color: z.string().trim().nullable().optional(),
  }),

  isActive: z.boolean(),
}).strict()
