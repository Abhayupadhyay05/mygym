import Link from 'next/link'
import type { z } from 'zod'
import { paymentReceiptSchema } from '@/lib/validations/payment'
import { PrintReceiptButton } from './print-receipt-button'

const currency = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 })
const dateFormatter = new Intl.DateTimeFormat('en-IN', {
  dateStyle: 'long',
  timeStyle: 'short',
  timeZone: 'Asia/Kolkata',
})

export function PaymentReceipt({
  payment,
  backHref,
}: {
  payment: z.infer<typeof paymentReceiptSchema>
  backHref: string
}) {
  const paymentDate = payment.paid_at ?? payment.created_at

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <Link href={backHref} className="text-sm text-muted-foreground hover:text-foreground">← Back to payments</Link>
        <PrintReceiptButton />
      </div>
      <article className="rounded-xl border border-white/10 bg-white/[0.03] p-6 sm:p-8 print:border-0 print:bg-white print:p-0 print:text-black">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/10 pb-5 print:border-gray-300">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#00FF87] print:text-black">Payment record</p>
            <h1 className="mt-2 text-2xl font-bold">Gym Management</h1>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground print:text-gray-600">Receipt ID</p>
            <p className="mt-1 break-all font-mono text-xs">{payment.id}</p>
          </div>
        </div>
        <div className="grid gap-6 py-6 sm:grid-cols-2">
          <section>
            <h2 className="text-sm font-semibold">Member</h2>
            <p className="mt-2 font-medium">{payment.member.full_name}</p>
            <p className="text-sm text-muted-foreground print:text-gray-600">{payment.member.member_number}</p>
            <p className="mt-2 text-sm text-muted-foreground print:text-gray-600">{payment.member.email ?? payment.member.phone}</p>
          </section>
          <section>
            <h2 className="text-sm font-semibold">Payment details</h2>
            <dl className="mt-2 space-y-1 text-sm">
              <div className="flex justify-between gap-3"><dt className="text-muted-foreground print:text-gray-600">Date</dt><dd>{dateFormatter.format(new Date(paymentDate))}</dd></div>
              <div className="flex justify-between gap-3"><dt className="text-muted-foreground print:text-gray-600">Method</dt><dd>{payment.method.replaceAll('_', ' ')}</dd></div>
              <div className="flex justify-between gap-3"><dt className="text-muted-foreground print:text-gray-600">Status</dt><dd>{payment.status}</dd></div>
              {payment.membership?.plan && (
                <div className="flex justify-between gap-3"><dt className="text-muted-foreground print:text-gray-600">Plan</dt><dd>{payment.membership.plan.name}</dd></div>
              )}
            </dl>
          </section>
        </div>
        {payment.membership && (
          <div className="border-t border-white/10 py-4 text-sm print:border-gray-300">
            Membership period: {payment.membership.starts_on} – {payment.membership.ends_on}
          </div>
        )}
        <div className="flex items-center justify-between border-t border-white/10 pt-5 text-lg font-semibold print:border-gray-300">
          <span>Amount</span>
          <span>{currency.format(payment.amount)}</span>
        </div>
        <p className="mt-6 text-xs text-muted-foreground print:text-gray-600">This receipt reflects payment records currently stored in the gym system.</p>
      </article>
    </div>
  )
}
