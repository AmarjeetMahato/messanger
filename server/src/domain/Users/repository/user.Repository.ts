import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../../helpers/tokens";
import {type DbOrTx } from "../../../config/database";
import { users } from "../../../config/schema/User.model";

@injectable()
export class UserRepositoy {
    
    constructor(@inject(TOKENS.DB) private db:DbOrTx){}

    async markUserVerified(userId:string){
         const [result] = await this.db.update(users)
                                    .set({isVerified:true})
                                    .returning();
         return result;                           
                                     
    }
}