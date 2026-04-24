import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../../helpers/tokens";
import {type DbOrTx } from "../../../config/database";
import { roleSchemaDto } from "../dtos/roleDtos";
import { roles, RolesRow } from "../../../config/schema/Role.model";
import { eq } from "drizzle-orm";
import { IRoleRepository } from "./role.Repository.Interfaces";
import { InternalServerException } from "../../../utils/Catch-error";


@injectable()
export class RoleRepository  implements IRoleRepository {

    constructor(@inject(TOKENS.DB) private  db:DbOrTx){}

    async createRole(data:RolesRow):Promise<RolesRow>{
            const [result] = await this.db.insert(roles).values({
                   name:data.name
            }).returning()

    if(!result){
       throw new InternalServerException("Failed to create Role")
    }

          return   result;
    }

    // RoleRepository
async fetchRoleByName(name: string): Promise<RolesRow | null > {
  return await this.db
    .select()
    .from(roles)
    .where(eq(roles.name, name))
    .then(row => row[0] || null)
} 

   
    async  deleteRole(roleId:string):Promise<void> {
            
             await this.db.delete(roles)
                               .where(eq(roles.roleId,roleId))         
    }
}