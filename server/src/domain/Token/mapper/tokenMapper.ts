import { TokenRow, TokenInsert } from "../../../config/schema/Token.model";
import { CreateTokenInput, UpdateTokenInput } from "../dtos/tokenDto";
import { TokenEntity, TokenType } from "../entity/tokenEntity";

export class TokenMapper {

  constructor() {}

  // ─────────────────────────────────────────────
  // ✅ DB Row → Entity
  // ─────────────────────────────────────────────
  static toEntity(row: TokenRow): TokenEntity {
    return new TokenEntity(
      row.tokenId!,
      row.tokenHash,
      row.type as TokenType ,

      row.otpGeneratedAt ?? null,
      row.otpExpiresAt ?? null,

      row.lastOtpRequestedAt ?? null,
      row.validatedAt ?? null,

      row.userId,
      row.createdAt!
    );
  }

  // ─────────────────────────────────────────────
  // ✅ DTO → Entity (CREATE)
  // ─────────────────────────────────────────────
  static toCreateEntity(input: CreateTokenInput): TokenEntity {
    return new TokenEntity(
      input.tokenId!, // or DB generated if preferred
      input.tokenHash,
      input.type,

      input.otpGeneratedAt ?? null,
      input.otpExpiresAt ?? null,

      input.lastOtpRequestedAt ?? null,
      input.validatedAt ?? null,

      input.userId,
      new Date(0)
    );
  }

  // ─────────────────────────────────────────────
  // ✅ DTO → Partial Update Entity
  // ─────────────────────────────────────────────
static toUpdateEntity(input: UpdateTokenInput): Partial<TokenEntity> {

  const update: Partial<TokenEntity> = {};

  if (input.tokenHash !== undefined) {
    update.tokenHash = input.tokenHash;
  }

  if (input.type !== undefined) {
    update.type = input.type;
  }

  if (input.otpGeneratedAt !== undefined) {
    update.otpGeneratedAt = input.otpGeneratedAt;
  }

  if (input.otpExpiresAt !== undefined) {
    update.otpExpiresAt = input.otpExpiresAt;
  }

  if (input.lastOtpRequestedAt !== undefined) {
    update.lastOtpRequestedAt = input.lastOtpRequestedAt;
  }

  if (input.validatedAt !== undefined) {
    update.validatedAt = input.validatedAt;
  }

  return update;
}

  // ─────────────────────────────────────────────
  // ✅ Entity → DB Insert
  // ─────────────────────────────────────────────
  static toInsert(entity: TokenEntity): TokenRow {
    return {
      tokenId: entity.tokenId,
      tokenHash: entity.tokenHash,
      type: entity.type,

      otpGeneratedAt: entity.otpGeneratedAt,
      otpExpiresAt: entity.otpExpiresAt,

      lastOtpRequestedAt: entity.lastOtpRequestedAt,
      validatedAt: entity.validatedAt,

      userId: entity.userId,
      createdAt: entity.createdAt ?? new Date(),
    };
  }

  // ─────────────────────────────────────────────
  // ✅ Entity → Response DTO (SAFE OUTPUT)
  // ─────────────────────────────────────────────
  static toResponse(entity: TokenEntity) {
    return {
      tokenId: entity.tokenId,
      type: entity.type,
      userId: entity.userId,
      tokenHash: entity.tokenHash,
      otpGeneratedAt: entity.otpGeneratedAt,
      otpExpiresAt: entity.otpExpiresAt,
      lastOtpRequestedAt: entity.lastOtpRequestedAt,
      validatedAt: entity.validatedAt,
      createdAt: entity.createdAt,
    };
  }

  // ─────────────────────────────────────────────
  // ✅ List Mapping
  // ─────────────────────────────────────────────
  static toEntityList(rows: TokenRow[]): TokenEntity[] {
    return rows.map((row) => this.toEntity(row));
  }

  static toResponseList(entities: TokenEntity[]) {
    return entities.map((entity) => this.toResponse(entity));
  }
}