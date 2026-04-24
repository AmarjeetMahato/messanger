import { z } from "zod";

export const participantRoleEnum = z.enum(["admin", "member"], { message: "Role must be either 'admin' or 'member'" });

export const ParticipantSchemaParams  = z.object({
   conversationId: z.uuid({ message: "Invalid conversationId format" }),
})

export const createParticipantSchema = z.object({
  conversationId: z
    .uuid({ message: "Invalid conversationId format" }),

  userId: z
    .uuid({ message: "Invalid userId format" }),

  role: participantRoleEnum.optional(),

  lastReadMessageId: z
    .uuid({ message: "Invalid lastReadMessageId format" })
    .nullable()
    .optional(),
});


export const updateParticipantSchema = z.object({
  role: participantRoleEnum.optional(),

  lastReadMessageId: z
    .uuid({ message: "Invalid lastReadMessageId format" })
    .nullable()
    .optional(),
});


export const participantParamsSchema = z.object({
  conversationId: z
    .uuid({ message: "Invalid conversationId in params" }),

  userId: z
    .uuid({ message: "Invalid userId in params" }),
});

export const participantQuerySchema = z.object({
  conversationId: z
    .uuid({ message: "Invalid conversationId" })
    .optional(),

  userId: z
    .uuid({ message: "Invalid userId" })
    .optional(),

  role: participantRoleEnum.optional(),
});

export const markAsReadParamsSchema = z.object({
  conversationId: z
    .uuid({ message: "Invalid conversationId" }),

  messageId: z
    .uuid({ message: "Invalid messageId" }),
});

export const participantResponseSchema = z.object({
  conversationId: z.uuid(),
  userId: z.uuid(),
  role: participantRoleEnum,
  joinedAt: z.iso.datetime(),
  lastReadMessageId: z.uuid().nullable(),
});

export type CreateParticipantDto = z.infer<typeof createParticipantSchema>;

export type UpdateParticipantDto = z.infer<typeof updateParticipantSchema>;

export type ParticipantParamsDto = z.infer<typeof participantParamsSchema>;

export type ParticipantQueryDto = z.infer<typeof participantQuerySchema>;

export type ParticipantResponseDto = z.infer<typeof participantResponseSchema>;
