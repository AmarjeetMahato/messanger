import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../../helpers/tokens";
import { ConversationRepository } from "../repository/conversation.Repository";
import { BadRequestException, InternalServerException } from "../../../utils/Catch-error";
import { emitNewChatToParticipants } from "../../../socket/socket";


@injectable()
export class ConversationServices{

    constructor(@inject(TOKENS.ConversationRepository) private repo:ConversationRepository){}

   async createDirectConversation(
    currentUserId: string,
    receiverId: string
  ) {

    if (currentUserId === receiverId) {
      throw new Error("Cannot create conversation with yourself");
    }

    // 🔥 1. Check if already exists
    const existing = await this.repo.findDirectConversation(
      currentUserId,
      receiverId
    );

    if (existing) {
      return existing;
    }

    // 🔥 2. Create new conversation in transaction
    const conversation =  await this.repo.createDirectConversationWithParticipants(
      currentUserId,
      receiverId
    );

      // 3️⃣ Emit socket event to participants
  emitNewChatToParticipants(
    [currentUserId, receiverId],
    conversation
  );

  return conversation;
  }


  async getConversationById(convoId:string){
           if(!convoId){
              throw new BadRequestException("Conversation Id is reqiured");
           }
           const result = await this.repo.getConversationById(convoId);
           if(!result){
               throw new InternalServerException("Failed to fetch Conversation");   
           }
           return result;
  }

  async fetchConversationbyUserId(userId:string){
                    if(!userId){
                        throw new BadRequestException("user Id should not be null");   
                    }

                    const result = await this.repo.fetchConversationByUserId(userId);
                    return result;
  }

  async getSidebarConversations(userId: string) {

  const convs = await this.repo.fetchConversationByUser_Id(userId);

    console.log("convo ", convs);
    

  return convs.map((c) => {

    const avatar = c.username?.charAt(0).toUpperCase() ?? "?";

    return {
      id: c.conversationId,
      name: c.username,
      msg: c.lastMessage ?? "Start chatting",
      time: c.createdAt
        ? new Date(c.createdAt).toLocaleTimeString([], {
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