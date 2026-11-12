import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { requireRole } from '@/lib/auth/authorization'
import { paymentReceiptSchema } from '@/lib/validations/payment'
import { PaymentReceipt } from '@/components/shared/payment-receipt'

export const metadata: Metadata = { title: 'Payment Receipt' }

export default async function PaymentReceiptPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) {
    notFound()
  }

  const { supabase } = await requireRole(['OWNER', 'RECEPTIONIST'])
  const { data, error } = await supabase
    .from('payments')
    .select('id, amount, currency, method, status, paid_at, created_at, member:members!inner(member_number, full_name, email, phone), membership:memberships(id, starts_on, ends_on, plan:membership_plans(name))')
    .eq('id', id)
    .maybeSingle()

  if (error) {
    throw new Error('Unable to load this payment receipt.')
  }
  if (!data) {
    notFound()
  }
  const receipt = paymentReceiptSchema.safeParse(data)
  if (!receipt.success) {
    throw new Error('This payment receipt returned an unexpected response.')
  }

  return <PaymentReceipt payment={receipt.data} backHref="/admin/payments" />
}
