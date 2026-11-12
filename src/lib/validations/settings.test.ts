import { describe, expect, it } from 'vitest'
import { profileSettingsSchema } from './settings'

describe('profileSettingsSchema', () => {
  it('accepts a name with an optional phone number', () => {
    expect(profileSettingsSchema.safeParse({ fullName: 'Gym Owner', phone: '' }).success).toBe(true)
    expect(profileSettingsSchema.safeParse({ fullName: 'Gym Owner', phone: '+91 98765 43210' }).success).toBe(true)
  })

  it('rejects blank names and invalid phone characters', () => {
    expect(profileSettingsSchema.safeParse({ fullName: ' ', phone: '' }).success).toBe(false)
    expect(profileSettingsSchema.safeParse({ fullName: 'Gym Owner', phone: 'abcdefgh' }).success).toBe(false)
  })
})
