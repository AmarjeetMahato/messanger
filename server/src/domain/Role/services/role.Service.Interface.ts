import { RoleResponseDto, roleSchemaDto } from "../dtos/roleDtos";


export interface IRoleService {

          createRole(data:roleSchemaDto):Promise<RoleResponseDto>
     
          fetchRoleByName(name:string):Promise<RoleResponseDto>
     
          deleteRole(roleId:string):Promise<void>
}