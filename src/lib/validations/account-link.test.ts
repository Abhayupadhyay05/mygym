import { describe, expect, it } from 'vitest'
import { memberAccountLinkResultSchema, memberAccountLinkSchema } from './account-link'

describe('memberAccountLinkSchema', () => {
  it('accepts existing member and profile UUIDs', () => {
    expect(memberAccountLinkSchema.safeParse({
      memberId: '550e8400-e29b-41d4-a716-446655440000',
      profileId: '8a5c1f60-f7b0-4a34-a152-d5edcb6d45ef',
    }).success).toBe(true)
  })

  it('rejects malformed or missing account IDs', () => {
    expect(memberAccountLinkSchema.safeParse({
      memberId: 'member',
      profileId: 'profile',
    }).success).toBe(false)
  })

  it('accepts a returned member UUID from the linking RPC', () => {
    expect(memberAccountLinkResultSchema.safeParse('550e8400-e29b-41d4-a716-446655440000').success).toBe(true)
    expect(memberAccountLinkResultSchema.safeParse('member').success).toBe(false)
  })
})
