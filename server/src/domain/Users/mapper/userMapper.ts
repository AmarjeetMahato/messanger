import { UserRow } from "../../../config/schema/User.model";
import { CreateUserSchemaDto, RegisterResponseDto, LoginResponseDto } from "../../Auth/dtos/authDto";
import { AuthEntity } from "../../Auth/entity/authEntity";
import { UserResponseDto } from "../dtos/userDtos";
import { UserEntity } from "../entity/userEntity";

export class UserMapper{

     constructor(){}

  // ─────────────────────────────────────────────
  // ✅ Row → Entity
  // ─────────────────────────────────────────────

     static  toEntity(user:UserRow):AuthEntity{

        return new AuthEntity(
        user.id,
    user.email,
    user.passwordHash,
    user.username,
    user.fullName ?? null,
    user.avatarUrl ?? null,
    user.isVerified ?? false,
    user.lastSeen ?? null,

    // Security fields
    user.isBlocked ?? false,
    user.blockedUntil ?? null,
    user.failedLoginAttempts ?? 0,

    user.roleId,
    user.mfaEnabled ?? false,

    user.createdAt,
    user.updatedAt ?? null
        )

     }


   static toResponse(entity: AuthEntity): UserResponseDto {
    return {
      id: entity.id,
      email: entity.email,
      username: entity.username,
      fullName: entity.fullName,
      avatarUrl: entity.avatarUrl,
      isVerified: entity.isVerified,
      lastSeen: entity.lastSeen,

      mfaEnabled: entity.mfaEnabled,
      roleId: entity.roleId,

      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }



  // ─────────────────────────────────────────────
  // ✅ Entity → Safe User DTO
  // ─────────────────────────────────────────────
  static toUserDto(entity: AuthEntity) {
    return {
      id: entity.id,
      email: entity.email,
      username: entity.username,
      fullName: entity.fullName,
      avatarUrl: entity.avatarUrl,
      roleId: entity.roleId,
      isVerified: entity.isVerified,
    };
  }



  // ─────────────────────────────────────────────
  // ✅ Login Persistence
  // ─────────────────────────────────────────────
  static toPersistence(entity: AuthEntity): UserRow{
  return {
    id: entity.id,
    email: entity.email,
    passwordHash: entity.passwordHash,
    username: entity.username,
    fullName: entity.fullName,
    avatarUrl: entity.avatarUrl,
    isVerified: entity.isVerified,
    lastSeen: entity.lastSeen,

    isBlocked: entity.isBlocked,
    blockedUntil: entity.blockedUntil,
    failedLoginAttempts: entity.failedLoginAttempts,

    roleId: entity.roleId,
    mfaEnabled: entity.mfaEnabled,

    createdAt: entity.createdAt,
    updatedAt: new Date(), // ✅ always update timestamp
  };
}


  // ── DB Rows → Domain Entities ──────────────────────────────────────
  static toEntityArray(rows: UserRow[]): UserEntity[] {
    return rows.map(this.toEntity);
  }

  // ── Domain Entities → Response DTOs ────────────────────────────────
  static toResponseDtoArray(entities: UserEntity[]): UserResponseDto[] {
       return entities.map(this.toResponse);
  }

 
}