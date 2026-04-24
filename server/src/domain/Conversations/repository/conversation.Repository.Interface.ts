
import { ConversationsRow } from "../../../config/schema/Conversations.model";
import { ConversationListItemDto, ConversationWithDetails } from "../dtos/conversationDto";


export interface IConversationRepository {

  findDirectConversation(userA: string,userB: string): Promise<ConversationsRow | null>;

  createDirectConversationWithParticipants(userA: string,userB: string): Promise<ConversationsRow>;

  getConversationById(convoId: string): Promise<ConversationsRow | null>;

  getUserConversationsWithDetails(userId: string): Promise<ConversationWithDetails[]>;

  getUserConversationList(userId: string): Promise<ConversationListItemDto[]>;

}