import { z } from 'zod'

export const memberAccountLinkSchema = z.object({
  memberId: z.string().uuid(),
  profileId: z.string().uuid(),
})

export const memberAccountLinkResultSchema = z.string().uuid()
