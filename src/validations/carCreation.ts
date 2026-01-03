import { z } from 'zod'

export const createCarSchema = z
  .object({
    brand: z.string().trim().min(1),
    model: z.string().trim().min(1),
    // dealer: z.string().trim().min(1),

    year: z
      .number()
      .int()
      .min(1900)
      .max(new Date().getFullYear() + 1),

    price: z.number().positive().optional(),

    images: z.array(z.string().url()).optional(),
    features: z.array(z.string()).optional().default([]),
    specs: z
      .object({
        engine: z.string().trim().optional(),
        transmission: z.string().trim().optional(),
        fuelType: z.string().trim().optional(),
        horsepower: z.number().int().positive().optional(),
        color: z.string().trim().optional(),
        acceleration: z.number().positive().optional(),
        torque: z.number().positive().optional(),
        drivetrain: z.string().trim().optional(),
        cartype: z.string().trim().optional(),
      })
      .optional(),

    isActive: z.boolean().optional(),
  })
  .strict()
