import { describe, expect, it } from 'vitest'
import { reportPeriodSchema } from './report'

describe('reportPeriodSchema', () => {
  it('accepts supported report periods', () => {
    expect(reportPeriodSchema.parse('12')).toBe(12)
  })

  it('rejects unbounded or unsupported report periods', () => {
    expect(reportPeriodSchema.safeParse('0').success).toBe(false)
    expect(reportPeriodSchema.safeParse('120').success).toBe(false)
    expect(reportPeriodSchema.safeParse('all').success).toBe(false)
  })
})
