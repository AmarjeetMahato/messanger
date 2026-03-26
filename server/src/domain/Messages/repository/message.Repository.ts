import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../../helpers/tokens";
import {type DbOrTx } from "../../../config/database";
import { messages } from "../../../config/schema/Messages.model";
import { and, desc, eq, lt, lte } from "drizzle-orm";
import { conversations } from "../../../config/schema/Conversations.model";


@injectable()
export class MessageRepository{
     constructor(@inject(TOKENS.DB) private db:DbOrTx) {} 


    async sendMessage(conversationId:string, senderId:string, content:string){

        return  await this.db.transaction(async(tx)=>{
                         // 1️⃣ Insert message
                        const [message] = await tx.insert(messages).values({
                            conversationId:conversationId,
                            senderId:senderId,
                            content:content})
                            .returning();

                       // 2️⃣ Update conversation
                       await tx.update(conversations)
                               .set({
                                    lastMessageId:message?.id,
                                    updatedAt: new Date()
                               })
                               .where(eq(conversations.id, conversationId))
                     
                        return message;       
        })
                    
    }

    async getMessages(conversationId: string, limit = 20, cursor?: string){
 
       const messagesList = await this.db
    .select()
    .from(messages)
    .where(
      cursor
        ? and(
            eq(messages.conversationId, conversationId),
            lt(messages.id, cursor)
          )
        : eq(messages.conversationId, conversationId)
    )
    .orderBy(desc(messages.createdAt))
    .limit(limit);
  // Optional: return in ascending order for UI
  return messagesList.reverse();
  }
    
}