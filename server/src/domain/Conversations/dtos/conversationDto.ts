import {z} from "zod";


export  const CreateDirectConversationParams  = z.object({
    convoId:z.uuid("Invalid conversation Id format"),
})

export  const CreateDirectConversationSchema  = z.object({
    receiverId:z.uuid("Invalid receiverId format"),
})

export const CreateGroupConversationSchema = z.object({
  id:z.uuid(),
  title: z
    .string()
    .min(3, "Group title must be at least 3 characters")
    .max(100, "Group title too long"),

  memberIds: z
    .array(z.uuid())
    .min(1, "At least one member required"),
});

export const conversationResponseSchema = z.object({
  id: z.uuid(),
  type: z.enum(["direct", "group"]),
  title: z.string().max(255).nullable(),

  createdBy: z.uuid(),
  lastMessageId: z.uuid().nullable(),

  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});


export interface ConversationListItemDto {
  conversationId: string;
  username: string;
  avatarUrl: string | null;
  lastMessage: string | null;
  lastMessageCreatedAt: Date | null;
}

type ConversationType = "direct" | "group";

interface LastMessage {
  id: string;
  content: string | null;
  senderId: string;
  createdAt: Date;
  type: string | null;
}

export interface ConversationWithDetails {
  id: string;
  type: ConversationType; // or string if your schema is loose
  title: string | null;
  avatar: string | null;
  lastMessage: LastMessage | null;
}

// 🔹 Last message
export const lastMessageSchema = z.object({
  id: z.string().uuid(),
  content: z.string().nullable(),
  senderId: z.string().uuid(),
  createdAt: z.coerce.date(),
  type: z.string().nullable(), // or enum later
});

// 🔹 Conversation list item
export const conversationWithDetailsSchema = z.object({
  id: z.uuid(),
  type: z.enum(["direct", "group"]),
  title: z.string().nullable(),
  avatar: z.string().nullable(),
  lastMessage: lastMessageSchema.nullable(),
});


export const conversationListItemSchema = z.object({
  conversationId: z.string().uuid(),
  username: z.string().min(1),
  avatarUrl: z.string().nullable(),
  lastMessage: z.string().nullable(),
  lastMessageCreatedAt: z.coerce.date().nullable(),
});

export const sidebarConversationSchema = z.object({
  id: z.uuid(),
  name: z.string().min(1),
  msg: z.string().nullable().default("No messages yet"),
  time: z.string(), // Usually a formatted string like "12:45 PM"
  unread: z.number().int().min(0),
  online: z.boolean(),
  avatar: z.url().or(z.string().nullable()),
  color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/).default("#000000"),
});

// Automatically creates the TypeScript type
export type SidebarConversationResponseDto = z.infer<typeof sidebarConversationSchema>;

// For a list of conversations
export const sidebarConversationListSchemaDto = z.array(sidebarConversationSchema);

export const conversationListItemsSchema = z.array(
  conversationListItemSchema
);

export type ConversationListItemResponseDto = z.infer<
  typeof conversationListItemSchema
>;


// 🔹 Final response
export const conversationListResponseSchema = z.array(conversationWithDetailsSchema);


export type ConversationWithDetailsDto = z.infer< typeof conversationWithDetailsSchema>;

export type ConversationListResponseDto = z.infer<typeof conversationListResponseSchema>;



export type conversationResponseSchemaDto = z.infer<typeof conversationResponseSchema>;
export type CreateDirectConversationDto = z.infer<typeof CreateDirectConversationSchema>;
export type CreateGroupConversationDto = z.infer<typeof CreateGroupConversationSchema>;

