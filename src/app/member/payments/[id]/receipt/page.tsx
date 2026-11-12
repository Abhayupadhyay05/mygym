import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PaymentReceipt } from '@/components/shared/payment-receipt'
import { requireRole } from '@/lib/auth/authorization'
import { paymentReceiptSchema } from '@/lib/validations/payment'

export const metadata: Metadata = { title: 'Payment Receipt' }

export default async function MemberPaymentReceiptPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) {
    notFound()
  }

  const { supabase, user } = await requireRole(['MEMBER'])
  const { data: member, error: memberError } = await supabase
    .from('members')
    .select('id')
    .eq('profile_id', user.id)
    .maybeSingle()
  if (memberError) {
    throw new Error('Unable to verify your member account.')
  }
  if (!member) {
    notFound()
  }

  const { data, error } = await supabase
    .from('payments')
    .select('id, amount, currency, method, status, paid_at, created_at, member:members!inner(member_number, full_name, email, phone), membership:memberships(id, starts_on, ends_on, plan:membership_plans(name))')
    .eq('id', id)
    .eq('member_id', member.id)
    .maybeSingle()
  if (error) {
    throw new Error('Unable to load your payment receipt.')
  }
  if (!data) {
    notFound()
  }

  const receipt = paymentReceiptSchema.safeParse(data)
  if (!receipt.success) {
    throw new Error('Your payment receipt returned an unexpected response.')
  }
  if (receipt.data.status !== 'PAID') {
    notFound()
  }

  return <PaymentReceipt payment={receipt.data} backHref="/member" />
}
