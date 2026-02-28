import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../../helpers/tokens";
import { RoleRepository } from "../repository/role.Repository";
import { roleSchemaDto } from "../dtos/roleDtos";
import { BadRequestException, InternalServerException } from "../../../utils/Catch-error";

@injectable()
export class RoleService{
    constructor(@inject(TOKENS.RoleRepository) private roleRepo:RoleRepository){}


    async createRole(data:roleSchemaDto){
             if(!data){
                 throw new BadRequestException("Role is required");    
             }
             const role = await this.roleRepo.createRole(data);
             if(!role?.roleId){
                throw new InternalServerException("Failed to create Roles")
             }
             return role;
    }

    async fetchRoleByName(name:string){
          if(!name){
              throw new BadRequestException("Role name not provided")
          }
          const role = await this.roleRepo.fetchRoleByName(name);
          if(!role?.roleId){
               throw new InternalServerException("Failed to fetch role name");   
          }
          return role;
    }

    async deleteRole(roleId:string){
           if(!roleId){
                 throw new BadRequestException("Role is required !");   
           }
           return await this.roleRepo.deleteRole(roleId);
    }
}