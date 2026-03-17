import { eq } from "drizzle-orm";
import { db } from "../config/database";
import { roles } from "../config/schema/Role.model";


export async function SeedRoles(){
    const count = await db.select({ c: roles.roleId }).from(roles);
  if (count.length > 0) return; // already seeded
  const defaultRoles = ["ADMIN", "USER", "MODERATOR"];

   for (const roleName of defaultRoles) {
    const existing = await db.select().from(roles)
                             .where(eq(roles.name, roleName))
                             .limit(1);
       if (existing.length === 0) {   // ✅ check array length
      await db.insert(roles).values({ name: roleName });
      console.log(`Role created: ${roleName}`);
    } else {
      console.log(`Role already exists: ${roleName}`);
    }
  }
} 