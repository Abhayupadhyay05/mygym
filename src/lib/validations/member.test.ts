import { describe, expect, it } from 'vitest'
import { memberInputSchema, memberSearchParamsSchema } from './member'

const validMember = {
  memberNumber: 'M-1001',
  fullName: 'Sample Member',
  email: 'member@example.test',
  phone: '+91 98765 43210',
  dateOfBirth: '2000-01-01',
  emergencyContactName: '',
  emergencyContactPhone: '',
  address: '',
  status: 'ACTIVE',
  notes: '',
}

describe('memberInputSchema', () => {
  it('accepts a valid member and normalizes optional fields', () => {
    const result = memberInputSchema.safeParse(validMember)

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.email).toBe('member@example.test')
      expect(result.data.emergencyContactPhone).toBeNull()
      expect(result.data.address).toBe('')
    }
  })

  it('rejects invalid email and phone input', () => {
    const result = memberInputSchema.safeParse({
      ...validMember,
      email: 'not-an-email',
      phone: '123',
    })

    expect(result.success).toBe(false)
  })
})

describe('memberSearchParamsSchema', () => {
  it('defaults to the first page and all member statuses', () => {
    expect(memberSearchParamsSchema.parse({})).toEqual({
      query: '',
      status: 'ALL',
      page: 1,
    })
  })

  it('rejects an out-of-range page number', () => {
    expect(memberSearchParamsSchema.safeParse({ page: '0' }).success).toBe(false)
  })
})
