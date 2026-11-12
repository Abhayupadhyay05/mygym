import { describe, expect, it } from 'vitest'
import { notificationInputSchema } from './notification'

describe('notificationInputSchema', () => {
  const validNotification = {
    memberNumber: 'M-1001',
    subject: 'Membership reminder',
    body: 'Please contact reception about your membership.',
  }

  it('accepts a complete in-app message', () => {
    expect(notificationInputSchema.safeParse(validNotification).success).toBe(true)
  })

  it('rejects empty message content and oversized subjects', () => {
    expect(notificationInputSchema.safeParse({ ...validNotification, body: ' ' }).success).toBe(false)
    expect(notificationInputSchema.safeParse({ ...validNotification, subject: 'S'.repeat(201) }).success).toBe(false)
  })
})
