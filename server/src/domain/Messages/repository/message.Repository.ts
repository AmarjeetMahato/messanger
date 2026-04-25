import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../../helpers/tokens";
import {type DbOrTx } from "../../../config/database";
import { MessageInsert, MessageRow, messages } from "../../../config/schema/Messages.model";
import { and, desc, eq, lt, lte } from "drizzle-orm";
import { conversations } from "../../../config/schema/Conversations.model";
import { IMessageRepository } from "./message.Repository.Interface";
import { InternalServerException } from "../../../utils/Catch-error";
import { date } from "zod";


@injectable()
export class MessageRepository implements IMessageRepository{
     constructor(@inject(TOKENS.DB) private db:DbOrTx) {} 

 async findByConversationId(conversationId: string, limit: number, cursor?: string): Promise<MessageRow[]> {
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

 async findById(messageId: string): Promise<MessageRow | null> {
     return await this.db.select().from(messages)
                                  .where(
                                     eq(messages.id, messageId)
                                  )
                                  .then(row => row[0] || null)
  }

 async update(messageId: string, data: Partial<MessageInsert>): Promise<MessageRow> {
            
  const [message] = await this.db.update(messages)
                               .set({
                                   ...data,
                                   editedAt: new Date()
                               })
                               .where(eq(messages.id, messageId))
                               .returning()
   
     if(!message){
            throw new InternalServerException("Failed to create message");
        }

     return message 

  }

  
 async  updateStatus(messageId: string, status: "sent" | "delivered" | "read"): Promise<boolean> {
                 
         const result = await this.db.update(messages)
                                      .set({
                                            status:status,
                                             editedAt: new Date()
                                      })
                                      .where(eq(messages.id, messageId))
                                      .returning();

        return !!result                        

  }

  async softDelete(messageId: string): Promise<void> {
  const result = await this.db
    .update(messages)
    .set({
      deletedAt: new Date(),
    })
    .where(eq(messages.id, messageId))
    .returning({ id: messages.id });

  if (result.length === 0) {
    throw new Error("Message not found");
  }
}


 async sendMessage(conversationId:string, senderId:string, content:string) : Promise<MessageRow>{

        const message =   await this.db.transaction(async(tx)=>{
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

        if(!message){
            throw new InternalServerException("Failed to create message");
        }

        return message            
    }
    
}