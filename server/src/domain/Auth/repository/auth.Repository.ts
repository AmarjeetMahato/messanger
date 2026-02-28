import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../../helpers/tokens";
import {type DbOrTx } from "../../../config/database";
import { CreateUserSchemaDto, UpdateUserSchemaDto } from "../dtos/authDto";
import { users } from "../../../config/schema/User.model";
import { eq, sql } from "drizzle-orm";
import { roles } from "../../../config/schema/Role.model";
import { userRoles } from "../../../config/schema/UsersRole.model";


@injectable()
export class AuthRepository{

    constructor(@inject(TOKENS.DB) private db:DbOrTx ){}

    async createUser(data:CreateUserSchemaDto, roleId:string){

          const [result] = await this.db
                             .insert(users)
                             .values({
       email: data.email,
      username: data.username,
      fullName: data.fullName ?? null,
      avatarUrl: data.avatarUrl ?? null,
      mfaEnabled: data.mfaEnabled ?? false,
      passwordHash: data.password,
      roleId:roleId,              // required field
      isVerified: false,   // optional, defaults to false
      isBlocked: false,    // optional, defaults to false
      blockedUntil: null,
      failedLoginAttempts: 0,
    })
    .returning();

       return result; 
    }

    async fetchUserByEmail(email:string){
           const rows = await this.db.select({
                                   id: users.id,
                                  email: users.email,
                                  passwordHash: users.passwordHash,
                                  isVerified: users.isVerified,
                                  isBlocked: users.isBlocked,
                                  blockedUntil: users.blockedUntil,
                                  failedLoginAttempts: users.failedLoginAttempts,
                                  roleName: roles.name,
                                  })
                                  .from(users)
                                  .leftJoin(userRoles, eq(userRoles.userId, users.id))
                                  .leftJoin(roles, eq(userRoles.roleId, roles.roleId))
                                  .where(eq(users.email, email));
          if (!rows.length) return null;

  // 🧠 Convert flat rows into structured user object
  const user = {
    id: rows[0]?.id,
    email: rows[0]?.email,
    passwordHash: rows[0]?.passwordHash,
    isVerified: rows[0]?.isVerified,
    isBlocked: rows[0]?.isBlocked,
    blockedUntil: rows[0]?.blockedUntil,
    failedLoginAttempts: rows[0]?.failedLoginAttempts,
    roles: rows
      .filter(r => r.roleName !== null)
      .map(r => r.roleName),
  };    
  return user;                      
                           }

      async fetchUserByUserId(userId:string){
           const [result] = await this.db.select().from(users)
                                       .where(eq(users.id,userId))
                                       .limit(1);
            return result;                           
    }

    async updateUser(userId:string,data:UpdateUserSchemaDto){
          const [result] = await this.db.update(users)
                                   .set({...data,updatedAt: new Date})
                                   .where(eq(users.id, userId))
                                   .returning()
           
            return result;
    }

    // Increment failed login attempts
async incrementFailedAttempts(userId: string) {
  await this.db.update(users)
    .set({ failedLoginAttempts: sql`${users.failedLoginAttempts} + 1` })
    .where(eq(users.id,userId));
}

// Reset failed login attempts
async resetFailedAttempts(userId: string) {
  await this.db.update(users)
    .set({ failedLoginAttempts: 0, isBlocked: false, blockedUntil: null })
    .where(eq(users.id,userId));
}

// Block user temporarily
async blockUserTemporarily(userId: string, blockedUntil: Date) {
  await this.db.update(users)
    .set({ isBlocked: true, blockedUntil })
    .where(eq(users.id,userId));
}
    
}