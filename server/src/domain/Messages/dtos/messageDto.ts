import { z } from "zod";

export const createMessageSchema = z.object({
  conversationId: z.uuid("Invalid conversation ID"), // UUID
  senderId: z.uuid("Invalid sender ID"),           // UUID
  content: z.string().optional(),                           // Optional for non-text messages
  type: z.enum(["text", "image", "video", "file"]).default("text"),
  status: z.enum(["sent", "delivered", "read"]).default("sent"),
  editedAt: z.preprocess((val) => val ? new Date(val as string) : undefined, z.date().optional()),
  deletedAt: z.preprocess((val) => val ? new Date(val as string) : undefined, z.date().optional()),
});

// TypeScript type inference
export type CreateMessageDto = z.infer<typeof createMessageSchema>;