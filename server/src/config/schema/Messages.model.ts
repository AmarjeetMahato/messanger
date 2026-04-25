

// 3️⃣ messages Table (Core of Chat)

import { index, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { conversations } from "./Conversations.model";
import { users } from "./User.model";
import { relations } from "drizzle-orm";

export const messages = pgTable("messages", {
  id: uuid("id").defaultRandom().primaryKey(),

  conversationId: uuid("conversation_id")
    .references(() => conversations.id, { onDelete: "cascade" })
    .notNull(),

  senderId: uuid("sender_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),

  content: text("content"),

  type: varchar("type", { length: 20 }).default("text"),
  // "text" | "image" | "video" | "file"

  status: varchar("status", { length: 20 }).default("sent"),
  // "sent" | "delivered" | "read"

  editedAt: timestamp("edited_at"),
  deletedAt: timestamp("deleted_at"),

  createdAt: timestamp("created_at").defaultNow().notNull(),

}, (table) => [({
  convIdx: index("messages_conv_idx").on(table.conversationId),
  senderIdx: index("messages_sender_idx").on(table.senderId),
  createdAtIdx: index("messages_created_idx").on(table.createdAt),
  statusIdx:index("status_idx").on(table.status)
})]);


export const messageRelations = relations(messages, ({ one }) => ({
  sender: one(users, {
    fields: [messages.senderId],
    references: [users.id],
  }),

  conversation: one(conversations, {
    fields: [messages.conversationId],
    references: [conversations.id],
  }),
}));


export type MessageRow    = typeof messages.$inferSelect;
export type MessageInsert = typeof messages.$inferInsert;