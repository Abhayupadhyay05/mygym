import { describe, expect, it } from 'vitest'
import { trainerInputSchema } from './trainer'

describe('trainerInputSchema', () => {
  it('trims and deduplicates comma-separated specialties', () => {
    const result = trainerInputSchema.parse({
      displayName: '  Alex Trainer ',
      bio: '',
      specialties: 'Strength, Mobility, Strength',
    })

    expect(result.displayName).toBe('Alex Trainer')
    expect(result.specialties).toEqual(['Strength', 'Mobility'])
  })

  it('rejects too many or oversized specialties', () => {
    expect(trainerInputSchema.safeParse({
      displayName: 'Alex Trainer',
      bio: '',
      specialties: Array.from({ length: 21 }, (_, index) => `Type${index}`).join(','),
    }).success).toBe(false)
    expect(trainerInputSchema.safeParse({
      displayName: 'Alex Trainer',
      bio: '',
      specialties: 'S'.repeat(61),
    }).success).toBe(false)
  })
})
