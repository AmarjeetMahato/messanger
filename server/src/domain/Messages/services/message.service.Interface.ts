import { CreateMessageDto, MessageResponseDto, UpdateMessageDto } from "../dtos/messageDto";

export interface IMessageService {
  // 🔹 Send message
  sendMessage(conversationId: string,senderId: string,content: string): Promise<MessageResponseDto>;

  // 🔹 Get messages (cursor pagination)
  getMessages(conversationId: string,limit?: number,cursor?: string): Promise<{
    messages: MessageResponseDto[];
    nextCursor?: string;
  }>;

  // 🔹 Mark as delivered
  markAsDelivered(messageId: string): Promise<boolean>;

  // 🔹 Mark as read
  markAsRead(messageId: string): Promise<boolean>;

  // 🔹 Edit message
  editMessage(messageId: string,userId:string,content: UpdateMessageDto): Promise<MessageResponseDto>;

  // 🔹 Delete message (soft delete)
  deleteMessage(messageId: string, userId:string): Promise<void>;
}