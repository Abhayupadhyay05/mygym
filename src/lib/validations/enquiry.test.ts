import { describe, expect, it } from 'vitest'
import { enquiryInputSchema, enquiryUpdateInputSchema } from './enquiry'

describe('enquiryInputSchema', () => {
  const validEnquiry = {
    fullName: 'Sample Lead',
    email: '',
    phone: '+91 98765 43210',
    message: '',
  }

  it('accepts a lead without an email address', () => {
    expect(enquiryInputSchema.safeParse(validEnquiry).success).toBe(true)
  })

  it('rejects invalid email addresses and short phone values', () => {
    expect(enquiryInputSchema.safeParse({ ...validEnquiry, email: 'bad' }).success).toBe(false)
    expect(enquiryInputSchema.safeParse({ ...validEnquiry, phone: '123' }).success).toBe(false)
    expect(enquiryInputSchema.safeParse({ ...validEnquiry, phone: 'abcdefgh' }).success).toBe(false)
  })
})

describe('enquiryUpdateInputSchema', () => {
  it('requires a member number when converting a lead', () => {
    const update = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      status: 'CONVERTED',
      followUpAt: '',
      assignedTo: 'false',
      memberNumber: '',
    }

    expect(enquiryUpdateInputSchema.safeParse(update).success).toBe(false)
    expect(enquiryUpdateInputSchema.safeParse({ ...update, memberNumber: 'M-1001' }).success).toBe(true)
  })
})
