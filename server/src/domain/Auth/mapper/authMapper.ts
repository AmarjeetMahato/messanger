import { UserRow } from "../../../config/schema/User.model";
import { CreateUserSchemaDto, LoginResponseDto, RegisterResponseDto } from "../dtos/authDto";
import { AuthEntity } from "../entity/authEntity";

export class AuthMapper{

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

static fromCreateDto(data:CreateUserSchemaDto): AuthEntity {
  return new AuthEntity(
     data.id!, // ✅ generate ID here
    data.email!,
    data.password,
    data.username,
    null, // fullName
    null, // avatarUrl
    false, // isVerified
    null, // lastSeen

    false, // isBlocked
    null, // blockedUntil
    0, // failedLoginAttempts

    data.roleName!,
    false, // mfaEnabled

    new Date(0), // createdAt
    new Date(0)  // updatedAt
  );
}

   // ─────────────────────────────────────────────
  // ✅ Register Response
  // ─────────────────────────────────────────────
  static toRegisterResponse(entity: AuthEntity): RegisterResponseDto {
    return {
      email: entity.email,
      requiresVerification: !entity.isVerified,
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

  // ─────────────────────────────────────────────
  // ✅ Login Response
  // ─────────────────────────────────────────────
  static toLoginResponse(
    entity: AuthEntity,
    accessToken: string,
    refreshToken: string
  ): LoginResponseDto {
    return {
      accessToken,
      refreshToken,
      user: this.toUserDto(entity),
    };
  }
}