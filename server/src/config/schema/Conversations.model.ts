


import { index, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { users } from "./User.model";
import { relations } from "drizzle-orm";
import { participants } from "./Participants.model";
import { messages } from "./Messages.model";



// 1️⃣ conversations Table
// Represents:
// 1-to-1 chat
// Group chat
// Channel

export const conversations = pgTable("conversations", {
  id: uuid("id").defaultRandom().primaryKey(),

  type: varchar("type", { length: 20 }).notNull(), 
  // "direct" | "group"

  title: varchar("title", { length: 255 }), // for group name

  createdBy: uuid("created_by")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),

  lastMessageId: uuid("last_message_id"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [({
  createdByIdx: index("conv_created_by_idx").on(table.createdBy),
})]);

export const conversationRelations = relations(conversations, ({ many, one }) => ({
  participants: many(participants),
  messages: many(messages),

  creator: one(users, {
    fields: [conversations.createdBy],
    references: [users.id],
  }),
}));


export type ConversationsRow    = typeof conversations.$inferSelect;
export type ConversationsInsert = typeof conversations.$inferInsert;