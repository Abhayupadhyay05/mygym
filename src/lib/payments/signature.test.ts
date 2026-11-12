import { createHmac } from 'node:crypto'
import { describe, expect, it } from 'vitest'
import { verifyHmacSha256 } from './signature'

describe('verifyHmacSha256', () => {
  it('accepts a matching SHA-256 signature', () => {
    const secret = 'test-secret'
    const message = 'order_123|payment_456'
    const signature = createHmac('sha256', secret).update(message).digest('hex')

    expect(verifyHmacSha256(secret, message, signature)).toBe(true)
  })

  it('rejects malformed or mismatched signatures', () => {
    expect(verifyHmacSha256('test-secret', 'message', 'not-a-signature')).toBe(false)
    expect(verifyHmacSha256('test-secret', 'message', '0'.repeat(64))).toBe(false)
  })
})
