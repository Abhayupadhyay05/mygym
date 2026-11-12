'use client'

import Script from 'next/script'
import { useActionState, useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  createRazorpayOrderAction,
  verifyRazorpayCheckoutAction,
  type RazorpayPaymentActionState,
} from './actions'

type CheckoutOrder = {
  orderId: string
  amountPaise: number
  keyId: string
}

type CheckoutResponse = {
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
}

type CheckoutOptions = {
  key: string
  amount: number
  currency: 'INR'
  name: string
  description: string
  order_id: string
  handler: (response: CheckoutResponse) => void
  modal: { ondismiss: () => void }
}

declare global {
  interface Window {
    Razorpay?: new (options: CheckoutOptions) => { open: () => void }
  }
}

const initialState: RazorpayPaymentActionState = { status: 'idle', message: '' }

export function RazorpayPaymentButton({ membershipId }: { membershipId: string }) {
  const router = useRouter()
  const [orderState, createOrder, isCreatingOrder] = useActionState(createRazorpayOrderAction, initialState)
  const [verifyState, verifyPayment, isVerifyingPayment] = useActionState(verifyRazorpayCheckoutAction, initialState)
  const [scriptReady, setScriptReady] = useState(false)
  const [scriptFailed, setScriptFailed] = useState(false)
  const [checkoutActive, setCheckoutActive] = useState(false)
  const [orderAttempt, setOrderAttempt] = useState(0)
  const [clientMessage, setClientMessage] = useState('')
  const openedAttempt = useRef(0)
  const idempotencyKeyInput = useRef<HTMLInputElement>(null)
  const verificationForm = useRef<HTMLFormElement>(null)
  const verifyOrderId = useRef<HTMLInputElement>(null)
  const verifyPaymentId = useRef<HTMLInputElement>(null)
  const verifySignature = useRef<HTMLInputElement>(null)

  const openCheckout = useCallback((order: CheckoutOrder) => {
    if (!window.Razorpay) {
      setClientMessage('Razorpay checkout did not load. Reload this page and try again.')
      return
    }

    setClientMessage('')
    setCheckoutActive(true)
    const checkout = new window.Razorpay({
      key: order.keyId,
      amount: order.amountPaise,
      currency: 'INR',
      name: 'Gym Management',
      description: 'Membership payment',
      order_id: order.orderId,
      handler: (response) => {
        setCheckoutActive(false)
        if (verifyOrderId.current) verifyOrderId.current.value = response.razorpay_order_id
        if (verifyPaymentId.current) verifyPaymentId.current.value = response.razorpay_payment_id
        if (verifySignature.current) verifySignature.current.value = response.razorpay_signature
        verificationForm.current?.requestSubmit()
      },
      modal: {
        ondismiss: () => setCheckoutActive(false),
      },
    })
    checkout.open()
  }, [])

  useEffect(() => {
    if (orderState.status !== 'success'
      || !orderState.orderId
      || !orderState.amountPaise
      || !orderState.keyId
      || !scriptReady
      || openedAttempt.current === orderAttempt) {
      return
    }
    openedAttempt.current = orderAttempt
    openCheckout({
      orderId: orderState.orderId,
      amountPaise: orderState.amountPaise,
      keyId: orderState.keyId,
    })
  }, [openCheckout, orderAttempt, orderState, scriptReady])

  useEffect(() => {
    if (verifyState.status === 'success') {
      router.refresh()
    }
  }, [router, verifyState.status])

  return (
    <div className="space-y-2">
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
        onReady={() => setScriptReady(true)}
        onError={() => setScriptFailed(true)}
      />
      <form
        action={createOrder}
        onSubmit={() => {
          setOrderAttempt((attempt) => attempt + 1)
          if (idempotencyKeyInput.current && !idempotencyKeyInput.current.value) {
            idempotencyKeyInput.current.value = crypto.randomUUID()
          }
        }}
      >
        <input type="hidden" name="membershipId" value={membershipId} />
        <input ref={idempotencyKeyInput} type="hidden" name="idempotencyKey" />
        <Button type="submit" size="sm" disabled={isCreatingOrder || isVerifyingPayment || checkoutActive}>
          {isCreatingOrder ? 'Preparing…' : checkoutActive ? 'Checkout open…' : 'Pay online'}
        </Button>
      </form>
      {scriptFailed && <p className="text-sm text-red-400" role="status">Razorpay checkout could not be loaded. Check your connection and reload.</p>}
      {clientMessage && <p className="text-sm text-red-400" role="status">{clientMessage}</p>}
      {orderState.message && (
        <p className={orderState.status === 'success' ? 'text-sm text-muted-foreground' : 'text-sm text-red-400'} role="status">
          {orderState.message}
        </p>
      )}
      {verifyState.message && (
        <p className={verifyState.status === 'success' ? 'text-sm text-[#00FF87]' : 'text-sm text-red-400'} role="status">
          {verifyState.message}
        </p>
      )}
      <form ref={verificationForm} action={verifyPayment} className="hidden" aria-hidden="true">
        <input ref={verifyOrderId} type="hidden" name="orderId" />
        <input ref={verifyPaymentId} type="hidden" name="paymentId" />
        <input ref={verifySignature} type="hidden" name="signature" />
      </form>
      {orderState.status === 'success' && !checkoutActive && !scriptFailed && (
        <button
          type="button"
          className="text-xs text-muted-foreground underline underline-offset-2"
          onClick={() => {
            if (orderState.orderId && orderState.amountPaise && orderState.keyId) {
              setOrderAttempt((attempt) => attempt + 1)
            }
          }}
        >
          Reopen checkout
        </button>
      )}
      {isVerifyingPayment && <p className="text-sm text-muted-foreground" role="status">Verifying payment…</p>}
    </div>
  )
}
