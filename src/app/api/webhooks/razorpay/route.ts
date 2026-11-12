import { z } from 'zod'
import { isRazorpayConfigured, isServiceRoleConfigured } from '@/lib/env.server'
import { mapRazorpayMethod, verifyWebhookSignature } from '@/lib/payments/razorpay'
import { createAdminClient } from '@/lib/supabase/admin'

const eventNameSchema = z.object({ event: z.string().min(1) })
const paymentCapturedEventSchema = z.object({
  event: z.literal('payment.captured'),
  payload: z.object({
    payment: z.object({
      entity: z.object({
        id: z.string().min(1).max(80),
        order_id: z.string().min(1).max(80),
        amount: z.number().int().positive(),
        currency: z.literal('INR'),
        status: z.literal('captured'),
        method: z.string().min(1).max(40),
      }),
    }),
  }),
})

export async function POST(request: Request) {
  if (!isRazorpayConfigured() || !isServiceRoleConfigured()) {
    return Response.json({ error: 'Payment webhook is not configured.' }, { status: 503 })
  }

  const signature = request.headers.get('x-razorpay-signature') ?? ''
  const eventId = request.headers.get('x-razorpay-event-id') ?? ''
  const rawBody = await request.text()

  if (!verifyWebhookSignature(rawBody, signature)) {
    return Response.json({ error: 'Invalid webhook signature.' }, { status: 401 })
  }
  if (!eventId || eventId.length > 255) {
    return Response.json({ error: 'Missing webhook event ID.' }, { status: 400 })
  }

  let payload: unknown
  try {
    payload = JSON.parse(rawBody)
  } catch {
    return Response.json({ error: 'Invalid webhook payload.' }, { status: 400 })
  }

  const eventName = eventNameSchema.safeParse(payload)
  if (!eventName.success) {
    return Response.json({ error: 'Invalid webhook event.' }, { status: 400 })
  }
  if (eventName.data.event !== 'payment.captured') {
    return Response.json({ received: true })
  }

  const event = paymentCapturedEventSchema.safeParse(payload)
  if (!event.success) {
    return Response.json({ error: 'Invalid captured payment event.' }, { status: 400 })
  }
  const payment = event.data.payload.payment.entity
  const adminClient = createAdminClient()
  const { data: settledPaymentId, error } = await adminClient.rpc('process_razorpay_webhook', {
    p_event_id: eventId,
    p_event_type: event.data.event,
    p_order_id: payment.order_id,
    p_payment_id: payment.id,
    p_amount_paise: payment.amount,
    p_currency: payment.currency,
    p_method: mapRazorpayMethod(payment.method),
  })

  if (error || !settledPaymentId) {
    return Response.json({ error: 'Webhook processing failed.' }, { status: 500 })
  }
  return Response.json({ received: true })
}
