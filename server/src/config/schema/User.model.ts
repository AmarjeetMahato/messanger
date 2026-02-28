import { relations } from "drizzle-orm";
import { 
  pgTable, serial, text, timestamp, integer, 
  index, uniqueIndex, varchar, boolean, jsonb, pgEnum, 
  uuid
} from "drizzle-orm/pg-core";
import { devices } from "./Device.model";
import { tokens } from "./Token.model";
import { userRoles } from "./UsersRole.model";
import { participants } from "./Participants.model";
import { messages } from "./Messages.model";
import { roles } from "./Role.model";

// --- 1. Users Table (Core Identity) ---
export const users = pgTable("users", {
  id: uuid().defaultRandom().primaryKey(),
  email: varchar("email", { length: 255 }).notNull(),
  passwordHash: text("password_hash").notNull(), // Production apps don't store passwords!
  username: varchar("username", { length: 50 }).notNull(),
  fullName: varchar("full_name", { length: 100 }),
  avatarUrl: text("avatar_url"),
  isVerified: boolean("is_verified").default(false),
  lastSeen: timestamp("last_seen").defaultNow(),
    // ✅ New field for account status
  isBlocked: boolean("is_blocked").default(false),
  blockedUntil: timestamp("blocked_until"),
  failedLoginAttempts: integer("failed_login_attempts").default(0),
  roleId: uuid("role_id").references(() => roles.roleId).notNull(),
  mfaEnabled: boolean("mfa_enabled").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [({
  emailIdx: uniqueIndex("email_idx").on(table.email),
  userSearchIdx: index("user_search_idx").on(table.username),
  fullNameIdx: index("full_name_idx").on(table.fullName),
  lastSeenIdx:index("last_seen_idx").on(table.lastSeen)
})]);



export const userRelations = relations(users, ({ many }) => ({
  devices: many(devices),
  tokens: many(tokens),
  userRoles: many(userRoles),
  participants: many(participants),   // user joins conversations
  messages: many(messages),           // user sends messages
}));