import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../../helpers/tokens";
import {type DbOrTx } from "../../../config/database";
import { participants } from "../../../config/schema/Participants.model";
import { eq } from "drizzle-orm";


@injectable()
export class ParticipantsRepository{
     
     constructor(@inject(TOKENS.DB) private db:DbOrTx){}

     async getConversationParticipants(conversationId:string){
          const result = await this.db
    .select({ userId: participants.userId })
    .from(participants)
    .where(eq(participants.conversationId, conversationId)); // limit हटा दिया गया

  // चूँकि select एक array return करता है, इसे map करके सिर्फ IDs निकालें
  return result.map(p => p.userId);                           
     }

     async getAllConversationParticipants(){
             return await this.db.select().from(participants)
     }
}