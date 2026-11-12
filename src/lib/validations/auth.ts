import { z } from 'zod'

const emailSchema = z.string().trim().email().max(254)
const passwordSchema = z.string().min(8).max(128)
const phoneSchema = z.string().trim().regex(/^\+[1-9]\d{7,14}$/, 'Use an international phone number, such as +919876543210.')

export const signInSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
})

export const registrationSchema = z.object({
  firstName: z.string().trim().min(1).max(80),
  lastName: z.string().trim().min(1).max(80),
  email: emailSchema,
  phone: phoneSchema.optional().or(z.literal('')),
  password: passwordSchema,
  confirmPassword: z.string(),
}).refine((value) => value.password === value.confirmPassword, {
  path: ['confirmPassword'],
  message: 'The passwords do not match.',
})

export const phoneOtpRequestSchema = z.object({
  phone: phoneSchema,
})

export const phoneOtpVerifySchema = z.object({
  phone: phoneSchema,
  token: z.string().trim().regex(/^\d{6}$/, 'Enter the 6-digit code.'),
})

export const passwordResetRequestSchema = z.object({
  email: emailSchema,
})

export const newPasswordSchema = z.object({
  password: passwordSchema,
  confirmPassword: z.string(),
}).refine((value) => value.password === value.confirmPassword, {
  path: ['confirmPassword'],
  message: 'The passwords do not match.',
})
