import { ConversationsRow } from "../../../config/schema/Conversations.model";
import { conversationResponseSchemaDto } from "../dtos/conversationDto";
import { ConversationType, EntityConversation } from "../entity/entityConversation";

export class ConversationMapper {
  constructor() {}

  // ─────────────────────────────────────────────
  // ✅ Row (DB) → Entity
  // ─────────────────────────────────────────────
  static toEntity(row: ConversationsRow): EntityConversation {
   
    return new EntityConversation(
      row.id,
      row.type as ConversationType,
      row.title ?? null,
      row.createdBy,
      row.lastMessageId ?? null,
      row.createdAt,
      row.updatedAt
    );
  }

  // ─────────────────────────────────────────────
  // ✅ DTO → Entity (Create Conversation)
  // ─────────────────────────────────────────────
  static toCreateEntity(data: {
    type: "direct" | "group";
    title?: string | null;
    createdBy: string;
  }): EntityConversation {
    return new EntityConversation(
      crypto.randomUUID(), // or uuid lib
      data.type,
      data.title ?? null,
      data.createdBy,
      null,
      new Date(),
      new Date()
    );
  }

  // ─────────────────────────────────────────────
  // ✅ Entity → Persistence (DB Insert/Update)
  // ─────────────────────────────────────────────
  static toPersistence(entity: EntityConversation) {
    return {
      id: entity.id,
      type: entity.type,
      title: entity.title,
      createdBy: entity.createdBy,
      lastMessageId: entity.lastMessageId,
      createdAt: entity.createdAt,
      updatedAt: new Date(), // always refresh
    };
  }

  // ─────────────────────────────────────────────
  // ✅ Entity → Response DTO
  // ─────────────────────────────────────────────
  static toResponse(entity: EntityConversation):conversationResponseSchemaDto {
    return {
      id: entity.id,
      type: entity.type,
      title: entity.title,
      createdBy: entity.createdBy,
      lastMessageId: entity.lastMessageId,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  // ─────────────────────────────────────────────
  // ✅ List Mapping (DB rows → Response)
  // ─────────────────────────────────────────────
  static toResponseList(rows: any[]) {
    return rows.map((row) =>
      this.toResponse(this.toEntity(row))
    );
  }

  // ─────────────────────────────────────────────
  // ✅ Entity List → Response List
  // ─────────────────────────────────────────────
  static toEntityList(entities: EntityConversation[]) {
    return entities.map((entity) => this.toResponse(entity));
  }
}