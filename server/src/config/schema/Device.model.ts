import { } from "drizzle-orm/gel-core";
import { pgEnum, pgTable,uuid,integer,varchar, text, timestamp, boolean, index  } from "drizzle-orm/pg-core";
import { users } from "./User.model";
import { relations } from "drizzle-orm";

// Enums for strict data integrity
export const deviceTypeEnum = pgEnum("device_type", ["mobile", "desktop", "tablet", "web","smarttv"]);
export const platformEnum = pgEnum("platform", ["ios", "android", "windows", "macos", "linux", "browser"]);

export const devices = pgTable("devices", {
  id: uuid().defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: 'cascade' }).notNull(),
  
  // System Data
  deviceName: varchar("device_name", { length: 100 }), // e.g., "iPhone 15 Pro" or "Chrome on Windows"
  deviceType: deviceTypeEnum("device_type").notNull(),
  platform: platformEnum("platform").notNull(),
  osVersion: varchar("os_version", { length: 20 }),
  browser: varchar("browser", { length: 50 }),
  
  // Security Data
  ipAddress: varchar("ip_address", { length: 45 }), // Supports IPv6
  userAgent: text("user_agent"),
  refreshToken: text("refresh_token"), // For persistent login
  lastActive: timestamp("last_active").defaultNow(),
  isTrusted: boolean("is_trusted").default(false),
  timezone: text("timezone"),
  pushToken: text("push_token"), // For FCM/APNS notifications
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [({
  userDeviceIdx: index("user_device_idx").on(table.userId),
  tokenLookupIdx: index("token_lookup_idx").on(table.refreshToken),
  lastActiveIdx: index("devices_last_active_idx").on(table.lastActive),
  browserIdx: index("browser").on(table.browser),
  deviceName:index("device_name").on(table.deviceName)
})]);



export const deviceRelations = relations(devices, ({ one }) => ({
  user: one(users, {
    fields: [devices.userId],
    references: [users.id],
  }),
}));