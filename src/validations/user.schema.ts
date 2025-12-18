import { z } from 'zod'
// Login schema
export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('invalid email'),
    password: z.string().min(8, 'password must be at least 8 characters'),
  }),
})
// For creating a user
export const createUserSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'name is required'),
    email: z.string().email('invalid email'),
    phone: z.string().min(10, 'phone is required'),
    password: z.string().min(8, 'password must be at least 8 characters'),
  }),
})

// For creating a dealer

export const createDealerSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'name is required'),
    email: z.string().email('invalid email'),
    phone: z.string().min(10, 'phone is required'),
    password: z.string().min(8, 'password must be at least 8 characters'),
    dealershipName: z.string().min(1, 'dealership name is required'),
    dealershipLocation: z.string().min(1, 'dealership location is required'),
  }),
})
