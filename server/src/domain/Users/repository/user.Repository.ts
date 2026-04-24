import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../../helpers/tokens";
import {type DbOrTx } from "../../../config/database";
import {  UserRow, users } from "../../../config/schema/User.model";
import { eq, sql } from "drizzle-orm";
import { IUserRepository, PaginatedUsersResponse } from "./user.Repository.Interface";
import { UUID } from "crypto";

@injectable()
export class UserRepositoy implements IUserRepository {
    
    constructor(@inject(TOKENS.DB) private db:DbOrTx){}

    async markUserVerified(userId:UUID): Promise<boolean>{
         const [result] = await this.db.update(users)
                                    .set({isVerified:true})
                                    .where(eq(users.id, userId))
                                    .returning();
         return !!result;                           
                                     
    }

    async getUserById(userId:UUID):Promise<UserRow | null>{
           return  await this.db.select().from(users)
                                      .where(eq(users.id, userId))
                                      .then(row => row[0] || null)
                                      
    }

async getAllUsers(limit: number,page: number): Promise<PaginatedUsersResponse> {

  const offset = (page - 1) * limit;
  const allUsers = await this.db
    .select()
    .from(users)
    .limit(limit)
    .offset(offset);
  const [countResult] = await this.db
    .select({ count: sql<number>`count(*)` })
    .from(users);
  const total = countResult?.count ?? 0; // ✅ fix undefined
  const totalPages = Math.ceil(total / limit);
  return {
    data: allUsers,
    pagination: {
      total,
      page,
      limit,
      totalPages,
    },
  };
}
}