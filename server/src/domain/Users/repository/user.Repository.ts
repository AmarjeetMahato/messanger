import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../../helpers/tokens";
import {type DbOrTx } from "../../../config/database";
import {  users } from "../../../config/schema/User.model";
import { eq, sql } from "drizzle-orm";

@injectable()
export class UserRepositoy {
    
    constructor(@inject(TOKENS.DB) private db:DbOrTx){}

    async markUserVerified(userId:string){
         const [result] = await this.db.update(users)
                                    .set({isVerified:true})
                                    .returning();
         return result;                           
                                     
    }

    async getUserById(userId:string){
           const [result] = await this.db.select().from(users)
                                      .where(eq(users.id, userId))
                                      .limit(1);
            return result;                           
    }

    async getAllUsers(limit: number,page:number){

          const offset = (page - 1) * limit;

        const allUsers = await this.db.select().from(users)
                                   .limit(limit)
                                   .offset(offset)

        const [result] = await this.db.select({count:sql<number>`count(*)`}) 
                                            .from(users) 
        
        if (!result) {
                  return null;
               }

        const totalPages = Math.ceil(result?.count/limit)  
        
      return {
        data:allUsers,
          pagination: {
      total: result.count,
      page,
      limit,
      totalPages,
    },
      }

    }
}