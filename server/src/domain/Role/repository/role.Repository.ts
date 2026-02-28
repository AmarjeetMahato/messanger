import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../../helpers/tokens";
import {type DbOrTx } from "../../../config/database";
import { roleSchemaDto } from "../dtos/roleDtos";
import { roles } from "../../../config/schema/Role.model";
import { eq } from "drizzle-orm";


@injectable()
export class RoleRepository{

    constructor(@inject(TOKENS.DB) private  db:DbOrTx){}

    async createRole(data:roleSchemaDto){
            const [result] = await this.db.insert(roles).values({
                   name:data.name
            }).returning()
          return   result;
    }

    // RoleRepository
async fetchRoleByName(name: string) {
  const [role] = await this.db
    .select()
    .from(roles)
    .where(eq(roles.name, name))
    .limit(1);
  return role;
} 

   
    async  deleteRole(roleId:string) {
            
             return await this.db.delete(roles)
                               .where(eq(roles.roleId,roleId))
                               
    }
}