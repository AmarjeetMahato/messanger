import { ParticipantsRow } from "../../../config/schema/Participants.model";
import { CreateParticipantDto, UpdateParticipantDto, ParticipantResponseDto } from "../dtos/participantsDto";
import { ParticipantRole, ParticipantsEntity } from "../entity/participantsEntity";

export class ParticipantsMapper {

  constructor() {}

  // ─────────────────────────────────────────────
  // ✅ DB Row → Entity
  // ─────────────────────────────────────────────
  static toEntity(row: ParticipantsRow): ParticipantsEntity {
    return new ParticipantsEntity(
      row.conversationId,
      row.userId,
      (row.role ?? "member") as ParticipantRole,
      row.joinedAt ?? new Date(),
      row.lastReadMessageId ?? null
    );
  }

  // ─────────────────────────────────────────────
  // ✅ Entity → DB Insert
  // ─────────────────────────────────────────────
  static toInsert(entity: ParticipantsEntity): ParticipantsRow {
    return {
      conversationId: entity.conversationId,
      userId: entity.userId,
      role: entity.role ?? "member",

      joinedAt: entity.joinedAt ?? new Date(),
      lastReadMessageId: entity.lastReadMessageId ?? null,
    };
  }

   // ─────────────────────────────────────────────
  // ✅ Entity → DB Insert
  // ─────────────────────────────────────────────
  static toUpdate(entity: Partial<ParticipantsEntity>): Partial<ParticipantsRow> {
    return {
      conversationId: entity.conversationId ?? "",
      userId: entity.userId ?? "",
      role: entity.role ?? "member",

      joinedAt: entity.joinedAt ?? new Date(),
      lastReadMessageId: entity.lastReadMessageId ?? null,
    };
  }

  // ─────────────────────────────────────────────
  // ✅ DTO → Entity (CREATE)
  // ─────────────────────────────────────────────
  static toCreateEntity(dto: CreateParticipantDto): ParticipantsEntity {
    return new ParticipantsEntity(
      dto.conversationId,
      dto.userId,
      dto.role ?? "member",
      new Date(),
      dto.lastReadMessageId ?? null
    );
  }

  // ─────────────────────────────────────────────
  // ✅ DTO → Partial Update Entity
  // ─────────────────────────────────────────────
  static toUpdateEntity(
    dto: UpdateParticipantDto
  ): Partial<ParticipantsEntity> {

    const update: Partial<ParticipantsEntity> = {};

    if (dto.role !== undefined) {
      update.role = dto.role;
    }

    if (dto.lastReadMessageId !== undefined) {
      update.lastReadMessageId = dto.lastReadMessageId;
    }

    return update;
  }

  // ─────────────────────────────────────────────
  // ✅ Entity → Response DTO
  // ─────────────────────────────────────────────
  static toResponse(entity: ParticipantsEntity): ParticipantResponseDto {
    return {
      conversationId: entity.conversationId,
      userId: entity.userId,
      role: entity.role,
      joinedAt: entity.joinedAt.toISOString(),
      lastReadMessageId: entity.lastReadMessageId,
    };
  }

  // ─────────────────────────────────────────────
  // ✅ Row List → Entity List
  // ─────────────────────────────────────────────
  static toEntityList(rows: ParticipantsRow[]): ParticipantsEntity[] {
    return rows.map((row) => this.toEntity(row));
  }

  // ─────────────────────────────────────────────
  // ✅ Entity List → Response List
  // ─────────────────────────────────────────────
  static toResponseList(
    entities: ParticipantsEntity[]
  ): ParticipantResponseDto[] {
    return entities.map((entity) => this.toResponse(entity));
  }
}