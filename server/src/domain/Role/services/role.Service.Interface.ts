import { RoleResponseDto, roleSchemaDto } from "../dtos/roleDtos";

export interface IRoleService {
  createRole(data: roleSchemaDto): Promise<RoleResponseDto>;

  fetchRoleById(id: string): Promise<RoleResponseDto>;

  fetchRoleByName(name: string): Promise<RoleResponseDto>;

  deleteRole(roleId: string): Promise<void>;
}
