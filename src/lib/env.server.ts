import 'server-only'
import { z } from 'zod'

const razorpayEnvSchema = z.object({
  keyId: z.string().min(1),
  keySecret: z.string().min(1),
  webhookSecret: z.string().min(1),
})

const serviceRoleEnvSchema = z.object({
  supabaseUrl: z.string().url(),
  serviceRoleKey: z.string().min(1),
})

function razorpayEnvResult() {
  return razorpayEnvSchema.safeParse({
    keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    keySecret: process.env.RAZORPAY_KEY_SECRET,
    webhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET,
  })
}

export function isRazorpayConfigured() {
  return razorpayEnvResult().success
}

export function getRazorpayEnv() {
  const result = razorpayEnvResult()
  if (!result.success) {
    throw new Error('Razorpay is not configured. Set its key ID, key secret, and webhook secret locally.')
  }
  return result.data
}

function serviceRoleEnvResult() {
  return serviceRoleEnvSchema.safeParse({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  })
}

export function isServiceRoleConfigured() {
  return serviceRoleEnvResult().success
}

export function getServiceRoleEnv() {
  const result = serviceRoleEnvResult()
  if (!result.success) {
    throw new Error('Supabase service-role access is not configured on the server.')
  }
  return result.data
}

export function isResendConfigured() {
  return Boolean(process.env.RESEND_API_KEY?.trim() && process.env.EMAIL_FROM?.trim())
}

export function isWhatsAppConfigured() {
  return Boolean(
    process.env.WHATSAPP_PHONE_NUMBER_ID?.trim()
    && process.env.WHATSAPP_BUSINESS_ACCOUNT_ID?.trim()
    && process.env.WHATSAPP_ACCESS_TOKEN?.trim()
    && process.env.WHATSAPP_VERIFY_TOKEN?.trim(),
  )
}
