import { relations } from "drizzle-orm";
import { pgTable, uuid, varchar, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { userRoles } from "./UsersRole.model";
import { index } from "drizzle-orm/pg-core";

export const roles = pgTable("roles", {
  roleId: uuid("role_id")
    .defaultRandom()
    .primaryKey(),

  name: varchar("name", { length: 100 })
    .notNull(),

  createdDate: timestamp("created_date")
    .defaultNow()
    .notNull(),

  lastModifiedDate: timestamp("last_modified_date")
    .defaultNow(),
}, (table) => [({
  roleNameUnique: uniqueIndex("roles_name_unique").on(table.name),
  lastModifiedDate:index("last_modified_date").on(table.lastModifiedDate)
})]);



export const roleRelations = relations(roles, ({ many }) => ({
  userRoles: many(userRoles),
}));



export type RolesRow    = typeof roles.$inferSelect;
export type RolesInsert = typeof roles.$inferInsert;

