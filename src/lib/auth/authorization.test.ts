import { describe, expect, it } from 'vitest'
import { getActiveAppRole } from './authorization'

describe('getActiveAppRole', () => {
  it('rejects an inactive profile even when it has a valid role', () => {
    expect(getActiveAppRole({ role: 'MEMBER', is_active: false })).toBeNull()
  })

  it.each(['OWNER', 'RECEPTIONIST', 'TRAINER', 'MEMBER'] as const)(
    'preserves the active %s role',
    (role) => {
      expect(getActiveAppRole({ role, is_active: true })).toBe(role)
    },
  )
})
