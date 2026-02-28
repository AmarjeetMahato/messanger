import { uuid } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";
import { primaryKey } from "drizzle-orm/pg-core";
import { roles } from "./Role.model";
import { users } from "./User.model";
import { relations } from "drizzle-orm";


export const userRoles = pgTable("user_roles", {
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),

  roleId: uuid("role_id")
    .references(() => roles.roleId, { onDelete: "cascade" })
    .notNull(),
}, (table) => [({
  pk: primaryKey({ columns: [table.userId, table.roleId] }),
})]);


export const userRoleRelations = relations(userRoles, ({ one }) => ({
  user: one(users, {
    fields: [userRoles.userId],
    references: [users.id],
  }),
  role: one(roles, {
    fields: [userRoles.roleId],
    references: [roles.roleId],
  }),
}));