import { createHmac, timingSafeEqual } from 'node:crypto'

export function verifyHmacSha256(secret: string, message: string, signature: string) {
  if (!/^[\da-f]{64}$/i.test(signature)) return false
  const expected = createHmac('sha256', secret).update(message).digest()
  const provided = Buffer.from(signature, 'hex')
  return expected.length === provided.length && timingSafeEqual(expected, provided)
}
