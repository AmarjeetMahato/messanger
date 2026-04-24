import { RolesInsert, RolesRow } from "../../../config/schema/Role.model";
import { roleSchemaDto } from "../dtos/roleDtos";
import { RoleEntity } from "../entity/roleEntity";

export class RoleMapper {

  constructor() {}

  // ─────────────────────────────────────────────
  // ✅ DB Row → Entity
  // ─────────────────────────────────────────────
  static toEntity(row: RolesRow): RoleEntity {
    return new RoleEntity(
      row.roleId,
      row.name,
      row.createdDate,
      row.lastModifiedDate ?? null
    );
  }

  // ─────────────────────────────────────────────
  // ✅ Entity → DB Insert
  // ─────────────────────────────────────────────
  static toInsert(entity: RoleEntity): RolesRow {
    return {
      roleId: entity.roleId,
      name: entity.name,

      createdDate: entity.createdDate,
      lastModifiedDate: entity.lastModifiedDate ?? null,
    };
  }

  // ─────────────────────────────────────────────
  // ✅ DTO → Entity (CREATE)
  // ─────────────────────────────────────────────
  static toCreateEntity(dto: roleSchemaDto): RoleEntity {
    return new RoleEntity(
      crypto.randomUUID(), // OR remove if DB handles it
      dto.name,
      new Date(),
      null
    );
  }

  // ─────────────────────────────────────────────
  // ✅ DTO → Partial Update
  // ─────────────────────────────────────────────
  static toUpdateEntity(dto: Partial<roleSchemaDto>): Partial<RoleEntity> {

    const update: Partial<RoleEntity> = {};

    if (dto.name !== undefined) {
      update.name = dto.name;
      update.lastModifiedDate = new Date();
    }

    return update;
  }

  // ─────────────────────────────────────────────
  // ✅ Entity → Response DTO
  // ─────────────────────────────────────────────
  static toResponse(entity: RoleEntity) {
    return {
      roleId: entity.roleId,
      name: entity.name,
      createdDate: entity.createdDate,
      lastModifiedDate: entity.lastModifiedDate,
    };
  }

  // ─────────────────────────────────────────────
  // ✅ Row List → Entity List
  // ─────────────────────────────────────────────
  static toEntityList(rows: RolesRow[]): RoleEntity[] {
    return rows.map((row) => this.toEntity(row));
  }

  // ─────────────────────────────────────────────
  // ✅ Entity List → Response List
  // ─────────────────────────────────────────────
  static toResponseList(entities: RoleEntity[]) {
    return entities.map((entity) => this.toResponse(entity));
  }
}