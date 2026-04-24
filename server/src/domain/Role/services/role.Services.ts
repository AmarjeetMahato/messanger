import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../../helpers/tokens";
import { RoleRepository } from "../repository/role.Repository";
import { RoleResponseDto, roleSchemaDto } from "../dtos/roleDtos";
import { BadRequestException, ConflictExceptions, InternalServerException } from "../../../utils/Catch-error";
import { IRoleService } from "./role.Service.Interface";
import { RoleMapper } from "../mapper/roleMapper";

@injectable()
export class RoleService implements IRoleService{
    constructor(@inject(TOKENS.RoleRepository) private roleRepo:RoleRepository){}


    async createRole(data:roleSchemaDto):Promise<RoleResponseDto>{
             if(!data){
                 throw new BadRequestException("Role is required");    
             }
             const fetchRole = await this.roleRepo.fetchRoleByName(data.name)
             if(!fetchRole){
                  throw new ConflictExceptions("Role name already exists")
             }
             const createEntity = RoleMapper.toCreateEntity(data)
             const presistance = RoleMapper.toInsert(createEntity)
             const role = await this.roleRepo.createRole(presistance);
             const  entity = RoleMapper.toEntity(role)
             return RoleMapper.toResponse(entity)
    }

    async fetchRoleByName(name:string):Promise<RoleResponseDto>{
          if(!name){
              throw new BadRequestException("Role name not provided")
          }
          const role = await this.roleRepo.fetchRoleByName(name);
          if(!role?.roleId){
               throw new InternalServerException("Failed to fetch role name");   
          }
             const  entity = RoleMapper.toEntity(role)
             return RoleMapper.toResponse(entity)
    }

    async deleteRole(roleId:string):Promise<void>{
           if(!roleId){
                 throw new BadRequestException("Role is required !");   
           }
           return await this.roleRepo.deleteRole(roleId);
    }
}