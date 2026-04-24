import { pgTable, varchar, text, timestamp, uuid, index } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./User.model";

export const tokens = pgTable("tokens", {
  tokenId: uuid("token_id")
    .defaultRandom()
    .primaryKey(),

  tokenHash: text("token_hash").notNull(), // 🔐 store HASH, not raw token

  type: varchar("type", { length: 50 }).notNull(), 
  // "email_verification" | "password_reset" | "device_verification" | "otp"

  otpGeneratedAt: timestamp("otp_generated_at"),
  otpExpiresAt: timestamp("otp_expires_at"),

  lastOtpRequestedAt: timestamp("last_otp_requested_at"),

  validatedAt: timestamp("validated_at"),

  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),

  createdAt: timestamp("created_at").defaultNow(),


}, (table) => [({
  userIdx: index("tokens_user_idx").on(table.userId),
})]);

export const tokenRelations = relations(tokens, ({ one }) => ({
  user: one(users, {
    fields: [tokens.userId],
    references: [users.id],
  }),
}));


export type TokenRow    = typeof tokens.$inferSelect;
export type TokenInsert = typeof tokens.$inferInsert;