import { RolesRow } from "../../../config/schema/Role.model";



export interface IRoleRepository {
       
      createRole(data: RolesRow):Promise<RolesRow>;

      fetchRoleByName(name: string):Promise<RolesRow | null >;

      deleteRole(roleId:string): Promise<void>
}