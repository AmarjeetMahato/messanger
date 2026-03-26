import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../../helpers/tokens";
import { MessageRepository } from "../repository/message.Repository";
import { BadRequestException, InternalServerException } from "../../../utils/Catch-error";
import { ParticipantsService } from "../../Participants/services/participants.Services";
import { emitLastMessageToParticipants, emitNewMessageToChatRoom } from "../../../socket/socket";

@injectable()
export class MessageServices{
   
    constructor(
        @inject(TOKENS.MessageRepository) private messageRepo:MessageRepository,
        @inject(TOKENS.ParticipantsService) private participantService:ParticipantsService
    ){}

    async sendMessage(conversationId:string, senderId:string, content:string){
           // 1️⃣ Validation
  if (!conversationId || !senderId || !content?.trim()) {
    throw new BadRequestException("ConversationId, senderId and content are required");
  }

          // 2️⃣ Save message (DB transaction happens in repository)
  const message = await this.messageRepo.sendMessage(
    conversationId,
    senderId,
    content
  );

  if (!message?.id) {
    throw new InternalServerException("Failed to save message");
  }

           // 2️⃣ Get participants
        const participantIds  = await this.participantService.getConversationParticipants(conversationId);

           // ⚡ Emit full message to chat room
           emitNewMessageToChatRoom(senderId,conversationId,message);
               // 4️⃣ Emit last message to sidebar/chat list
           emitLastMessageToParticipants(participantIds,conversationId,message)
         return message;
    }

    async getMessages(conversationId:string, limit:number, cursor?:string){
             if(!conversationId){
                 throw new BadRequestException("Conversation Id is required !");  
             }

             const result = await this.messageRepo.getMessages(conversationId,limit,cursor);
             if(!result){
                 throw new InternalServerException("Failed to fetch messages");  
             }
             return result;
    }
    
}