import { z } from "zod";

export const createMessageSchemaParams = z.object({
    conversationId:z.uuid({ message:"Invalid message Id"})
})
export const createMessageSchema = z.object({
  conversationId: z.uuid("Invalid conversation ID"),
  senderId: z.uuid("Invalid sender ID"),

  content: z.string().optional(),

  type: z.enum(["text", "image", "video", "file"]).default("text"),
  status: z.enum(["sent", "delivered", "read"]).default("sent"),

  editedAt: z.preprocess(
    (val) => (val ? new Date(val as string) : undefined),
    z.date().optional()
  ),

  deletedAt: z.preprocess(
    (val) => (val ? new Date(val as string) : undefined),
    z.date().optional()
  ),
});

export const updateMessageSchema = z.object({
  content: z.string().optional(),

  status: z.enum(["sent", "delivered", "read"]).optional(),

  editedAt: z.preprocess(
    (val) => (val ? new Date(val as string) : undefined),
    z.date().optional()
  ),

  deletedAt: z.preprocess(
    (val) => (val ? new Date(val as string) : undefined),
    z.date().optional()
  ),
});

export const MessageResponseSchema = z.object({
  id: z.string().uuid().or(z.string()), // Optional .uuid() if you use UUIDs
  conversationId: z.string(),
  senderId: z.string(),
  
  // content is optional in the DTO, so we use .optional()
  content: z.string().optional(),

  // Enums for strict type checking
  type: z.enum(["text", "image", "video", "file"]),
  status: z.enum(["sent", "delivered", "read"]),

  // Using .nullable() and .optional() to match the Date | null | undefined logic
  editedAt: z.date().nullable().optional(),
  deletedAt: z.date().nullable().optional(),

  createdAt: z.date(),
});

// To extract the TypeScript type from the schema if needed:
export type MessageResponseDto = z.infer<typeof MessageResponseSchema>;

export type UpdateMessageDto = z.infer<typeof updateMessageSchema>;

// TypeScript type inference
export type CreateMessageDto = z.infer<typeof createMessageSchema>;