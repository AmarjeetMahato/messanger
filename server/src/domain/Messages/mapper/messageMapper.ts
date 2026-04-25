import { MessageRow, MessageInsert } from "../../../config/schema/Messages.model";
import { MessageResponseDto, CreateMessageDto } from "../dtos/messageDto";
import { MessageEntity } from "../entity/messageEntity";

export class MessageMapper {
  constructor() {}

  // 🔹 DB → Entity
  static toEntity(row: MessageRow): MessageEntity {
    return new MessageEntity(
      row.id,
      row.conversationId,
      row.senderId,
      row.content ?? null,
      row.type as "text" | "image" | "video" | "file",
      row.status as "sent" | "delivered" | "read",
      row.editedAt ?? null,
      row.deletedAt ?? null,
      row.createdAt
    );
  }

  // 🔹 Entity → Response DTO
  static toResponse(entity: MessageEntity): MessageResponseDto {
    return {
      id: entity.id,
      conversationId: entity.conversationId,
      senderId: entity.senderId,

      content: entity.content ?? undefined,

      type: entity.type,
      status: entity.status,

      editedAt: entity.editedAt,
      deletedAt: entity.deletedAt,

      createdAt: entity.createdAt,
    };
  }

  // 🔹 Create DTO → Insert (for DB)
  static toInsert(dto: CreateMessageDto): MessageInsert {
    return {
      conversationId: dto.conversationId,
      senderId: dto.senderId,
      content: dto.content ?? null,
      type: dto.type ?? "text",
      // ⚠️ NEVER trust client for status
      status: "sent",
      editedAt: null,
      deletedAt: null,

      // createdAt handled by DB default
    };
  }

  // 🔹 Entity → Insert (useful for internal creation)
  static entityToInsert(entity: MessageEntity): MessageInsert {
    return {
      id: entity.id,
      conversationId: entity.conversationId,
      senderId: entity.senderId,

      content: entity.content,

      type: entity.type,
      status: entity.status,

      editedAt: entity.editedAt,
      deletedAt: entity.deletedAt,

      createdAt: entity.createdAt,
    };
  }

  // 🔹 Bulk mapping (VERY useful in real apps)
  static toEntityList(rows: MessageRow[]): MessageEntity[] {
    return rows.map(this.toEntity);
  }

  static toResponseList(entities: MessageEntity[]): MessageResponseDto[] {
    return entities.map(this.toResponse);
  }
}