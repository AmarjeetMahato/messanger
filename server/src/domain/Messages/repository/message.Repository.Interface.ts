import { MessageInsert, MessageRow } from "../../../config/schema/Messages.model";

export interface IMessageRepository {
  // 🔹 Create
  sendMessage(conversationId:string, senderId:string, content:string): Promise<MessageRow>;

  // 🔹 Get messages with cursor-based pagination
  findByConversationId(conversationId: string,limit: number,cursor?: string): Promise<MessageRow[]>;

  // 🔹 Find single message
  findById(messageId: string): Promise<MessageRow | null>;

  // 🔹 Update message (generic)
  update( messageId: string, data: Partial<MessageInsert>): Promise<MessageRow>;

  // 🔹 Update status only (optimized path)
  updateStatus( messageId: string,status: "sent" | "delivered" | "read"): Promise<boolean>;

  // 🔹 Soft delete
  softDelete(messageId: string): Promise<void>;
}