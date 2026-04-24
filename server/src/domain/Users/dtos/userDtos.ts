import { z } from "zod";


export const userIdSchema = z.object({
    userId: z.uuid()
})

export const userResponseSchema = z.object({
  id: z.uuid(),

  email: z.email(),
  username: z.string().min(3).max(50),

  fullName: z.string().max(100).nullable(),
  avatarUrl: z.url().nullable(),

  isVerified: z.boolean(),

  lastSeen: z.coerce.date().nullable(),

  mfaEnabled: z.boolean(),

  roleId: z.uuid(),

  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date().nullable(),
});

export type userIdSchemaDto = z.infer<typeof userIdSchema>
export type UserResponseDto = z.infer<typeof userResponseSchema>