import { describe, expect, it } from 'vitest'
import { attendanceCheckInInputSchema } from './attendance'

describe('attendanceCheckInInputSchema', () => {
  it('trims and accepts a member number', () => {
    expect(attendanceCheckInInputSchema.parse({ memberNumber: ' M-1001 ' }).memberNumber).toBe('M-1001')
  })

  it('rejects a missing or oversized member number', () => {
    expect(attendanceCheckInInputSchema.safeParse({ memberNumber: ' ' }).success).toBe(false)
    expect(attendanceCheckInInputSchema.safeParse({ memberNumber: 'M'.repeat(51) }).success).toBe(false)
  })
})
