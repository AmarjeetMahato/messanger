import { ConversationListItemDto, ConversationListResponseDto, conversationResponseSchemaDto, CreateDirectConversationDto, SidebarConversationResponseDto } from "../dtos/conversationDto";

export interface IConversationService {

  findDirectConversation(userA: string,userB: string): Promise<conversationResponseSchemaDto>;

  createDirectConversationWithParticipants(dto: CreateDirectConversationDto, userId:string): Promise<conversationResponseSchemaDto>;

  getConversationById(convoId: string): Promise<conversationResponseSchemaDto>;

  getUserConversationsWithDetails(userId: string): Promise<ConversationListResponseDto>;

  getUserConversationList(userId: string): Promise<ConversationListItemDto[]>;
  
  getSidebarConversations(userId: string):Promise<SidebarConversationResponseDto[]>
}