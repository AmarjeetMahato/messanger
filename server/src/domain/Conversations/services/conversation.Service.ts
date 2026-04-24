import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../../helpers/tokens";
import { ConversationRepository } from "../repository/conversation.Repository";
import { BadRequestException, ConflictExceptions, NotFoundExceptions } from "../../../utils/Catch-error";
import { emitNewChatToParticipants } from "../../../socket/socket";
import { IConversationService } from "./conversation.Service.Interface";
import { ConversationMapper } from "../mapper/conversationMapper";
import { ConversationListItemDto, conversationListItemsSchema, ConversationListResponseDto, conversationListResponseSchema, conversationResponseSchema, conversationResponseSchemaDto, CreateDirectConversationDto, SidebarConversationResponseDto } from "../dtos/conversationDto";
import { EntityConversation } from "../entity/entityConversation";


@injectable()
export class ConversationServices implements IConversationService{

    constructor(@inject(TOKENS.ConversationRepository) private repo:ConversationRepository){}


async getUserConversationsWithDetails(userId: string): Promise<ConversationListResponseDto> {

  if (!userId) {
    throw new BadRequestException("UserId is required");
  }
  const convs = await this.repo.getUserConversationsWithDetails(userId);
  if (!convs || convs.length === 0) {
    return []; // empty list is valid
  }
  // ✅ Validate + transform
  return conversationListResponseSchema.parse(convs);
}

async getUserConversationList(userId: string): Promise<ConversationListItemDto[]> {

  // 1️⃣ Validation
  if (!userId) {
    throw new BadRequestException("UserId is required");
  }

  // 2️⃣ Fetch
  const result = await this.repo.getUserConversationList(userId);

  // 3️⃣ Handle empty (valid case)
  if (!result || result.length === 0) {
    return [];
  }

  // 4️⃣ Return directly (already correct shape)
  return result;
}

  async findDirectConversation(userA: string, userB: string): Promise<conversationResponseSchemaDto> {
        if(!userA || !userB){
           throw new BadRequestException("Both user required")
        }

        const convo = await this.repo.findDirectConversation(userA,userB);
        if(!convo || !convo.id){
            throw new NotFoundExceptions("Participants conversation not  found")
        }
        const  entity = ConversationMapper.toEntity(convo)
        if(!entity.isDirect()){
            throw new NotFoundExceptions("Direct convorsation not found")
        }
        return ConversationMapper.toResponse(entity)
  }

  
 async createDirectConversationWithParticipants(dto: CreateDirectConversationDto,userId:string): Promise<conversationResponseSchemaDto> {
         if(!dto || !dto.receiverId){
                throw new BadRequestException("ReceiverId is required");
         }

        if (dto.receiverId === userId) {
              throw new BadRequestException("You cannot create a conversation with yourself");
       }

         const findFirst = await this.repo.findDirectConversation(dto.receiverId,userId);
         if(findFirst){
            throw new ConflictExceptions("Conversation already exists")
         }

  // 4️⃣ Persist (DB transaction handles participants)
  const createdRow = await this.repo.createDirectConversationWithParticipants(userId,dto.receiverId);
   
      // 5️⃣ Convert DB → Entity
  const createdEntity = ConversationMapper.toEntity(createdRow);

  // 6️⃣ Entity → Response DTO
  const resposne =   ConversationMapper.toResponse(createdEntity);
  return conversationResponseSchema.parse(resposne)
        }

  async getConversationById(convoId:string):Promise<conversationResponseSchemaDto>{
           if(!convoId){
              throw new BadRequestException("Conversation Id is reqiured");
           }
           const result = await this.repo.getConversationById(convoId);
           if(!result){
               throw new NotFoundExceptions("Failed to fetch Conversation");   
           }
           const entity = ConversationMapper.toEntity(result);
           return ConversationMapper.toResponse(entity)
  }

 
  async getSidebarConversations(userId: string):Promise<SidebarConversationResponseDto[]>{

  const convs = await this.repo.getUserConversationList(userId);
  return convs.map((c) => {
  const avatar = c.username?.charAt(0).toUpperCase() ?? "?";

    return {
      id: c.conversationId,
      name: c.username,
      msg: c.lastMessage ?? "Start chatting",
      time: c.lastMessageCreatedAt
        ? new Date(c.lastMessageCreatedAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        : "",
      unread: 0,
      online: false,
      avatar,
      color: "#9b59b6"
    };
  });

}


}