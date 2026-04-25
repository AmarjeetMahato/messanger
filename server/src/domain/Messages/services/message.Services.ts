import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../../helpers/tokens";
import { MessageRepository } from "../repository/message.Repository";
import { BadRequestException, InternalServerException, NotFoundExceptions, UnauthorizedException } from "../../../utils/Catch-error";
import { ParticipantsService } from "../../Participants/services/participants.Services";
import { emitLastMessageToParticipants, emitNewMessageToChatRoom } from "../../../socket/socket";
import { IMessageService } from "./message.service.Interface";
import { CreateMessageDto, MessageResponseDto, UpdateMessageDto } from "../dtos/messageDto";
import { MessageMapper } from "../mapper/messageMapper";

@injectable()
export class MessageServices implements IMessageService{
   
    constructor(
        @inject(TOKENS.MessageRepository) private messageRepo:MessageRepository,
        @inject(TOKENS.ParticipantsService) private participantService:ParticipantsService
    ){}

   async markAsDelivered(messageId: string): Promise<boolean> {
        if(!messageId){
            throw new BadRequestException("messageId should not be null or empty")
        }

        const result = await this.messageRepo.updateStatus(messageId,"delivered")
        if(!result){
            throw new InternalServerException("Failed to update status")
        }
        return result
  }

  async  markAsRead(messageId: string): Promise<boolean> {
             if(!messageId){
            throw new BadRequestException("messageId should not be null or empty")
        }

        const result = await this.messageRepo.updateStatus(messageId,"read")
        if(!result){
            throw new InternalServerException("Failed to update status")
        }
        return result
  }


async editMessage (messageId: string,userId: string,content: UpdateMessageDto): Promise<MessageResponseDto> {

  if (!messageId) {
    throw new BadRequestException("messageId should not be null or empty");
  }

  if (!content || !content) {
    throw new BadRequestException("content should not be empty");
  }

  // 🔹 Fetch existing
  const existing = await this.messageRepo.findById(messageId);

  if (!existing) {
    throw new NotFoundExceptions("Message not found");
  }
  const entity = MessageMapper.toEntity(existing);
  // 🔹 Authorization check
  if (entity.senderId !== userId) {
    throw new UnauthorizedException("unauthorized user");
  }
  // 🔹 Prevent editing deleted message
  if (entity.deletedAt) {
    throw new BadRequestException("Cannot edit deleted message");
  }
  // 🔹 Update via repository
  const updatedRow = await this.messageRepo.update(messageId,content);
  // 🔹 Map response
  const updatedEntity = MessageMapper.toEntity(updatedRow);
  return MessageMapper.toResponse(updatedEntity);
}

 async deleteMessage(messageId: string, userId:string): Promise<void> {
        if(!messageId){
                throw new BadRequestException("messageId should not be null or empty");
        }

        const  existing = await  this.messageRepo.findById(messageId);
        if(!existing){
           throw new NotFoundExceptions("Message not found");
        }
        const entity = MessageMapper.toEntity(existing);
         if (entity.senderId !== userId) {
    throw new UnauthorizedException("unauthorized user");
  }
         // 🔹 Prevent editing deleted message
  if (entity.deletedAt) {
    throw new BadRequestException("Message already deleted");
  }
   
     await this.messageRepo.softDelete(messageId);
  }

    async sendMessage(conversationId:string, senderId:string, content:string): Promise<MessageResponseDto>{
           // 1️⃣ Validation
  if (!conversationId || !senderId || !content?.trim()) {
    throw new BadRequestException("ConversationId, senderId and content are required");
  }

          // 2️⃣ Save message (DB transaction happens in repository)
  const message = await this.messageRepo.sendMessage(conversationId,senderId,content);
           // 2️⃣ Get participants
  const participantIds  = await this.participantService.getConversationParticipants(conversationId);

           // ⚡ Emit full message to chat room
           emitNewMessageToChatRoom(senderId,conversationId,message);
               // 4️⃣ Emit last message to sidebar/chat list
           emitLastMessageToParticipants(participantIds,conversationId,message)
     const entity = MessageMapper.toEntity(message)
     return MessageMapper.toResponse(entity)
    }

async getMessages(
  conversationId: string,
  limit: number,
  cursor?: string
): Promise<{ messages: MessageResponseDto[]; nextCursor?: string }> {

  if (!conversationId) {
    throw new BadRequestException("Conversation Id is required !");
  }

  const rows = await this.messageRepo.findByConversationId(
    conversationId,
    limit,
    cursor
  );

  const entities = MessageMapper.toEntityList(rows);
  const messages = MessageMapper.toResponseList(entities);

  if (rows.length === 0) {
    return { messages: [] };
  }

  const nextCursor = rows[rows.length - 1]!.createdAt.toISOString();

  return {
    messages,
    nextCursor,
  };
}
    
}