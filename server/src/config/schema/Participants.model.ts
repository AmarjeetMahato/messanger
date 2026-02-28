

import { index, pgTable, primaryKey, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { users } from "./User.model";
import { conversations } from "./Conversations.model";
import { relations } from "drizzle-orm";


// 2️⃣ participants Table (VERY IMPORTANT)
// This is the bridge between users and conversations.


export const participants = pgTable("participants", {
  conversationId: uuid("conversation_id")
    .references(() => conversations.id, { onDelete: "cascade" })
    .notNull(),

  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),

  role: varchar("role", { length: 20 }).default("member"),
  // "admin" | "member"

  joinedAt: timestamp("joined_at").defaultNow(),

  lastReadMessageId: uuid("last_read_message_id"),

}, (table) => [({
  pk: primaryKey({ columns: [table.conversationId, table.userId] }),
  userIdx: index("participants_user_idx").on(table.userId),
})]);


export const participantRelations = relations(participants, ({ one }) => ({
  user: one(users, {
    fields: [participants.userId],
    references: [users.id],
  }),

  conversation: one(conversations, {
    fields: [participants.conversationId],
    references: [conversations.id],
  }),
}));