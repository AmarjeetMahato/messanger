import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../../helpers/tokens";
import {type DbOrTx } from "../../../config/database";
import { participants, ParticipantsRow } from "../../../config/schema/Participants.model";
import { and, eq, sql } from "drizzle-orm";
import { IParticipantsRepository, PaginatedResponse } from "./participants.Repository.interface";
import { InternalServerException } from "../../../utils/Catch-error";


@injectable()
export class ParticipantsRepository implements IParticipantsRepository{
     
     constructor(@inject(TOKENS.DB) private db:DbOrTx){}

     async addParticipant(data: ParticipantsRow): Promise<ParticipantsRow> {
          const [result] = await this.db.insert(participants)
                                         .values(data)
                                         .returning()
          if(!result){
                 throw new InternalServerException("Failed to create Participant")
          }   
          return result                            
     }

     async removeParticipant(conversationId: string, userId: string): Promise<boolean> {
          const result =  await this.db.delete(participants)
                                     .where(
                                         and(
                                             eq(participants.conversationId, conversationId),
                                             eq(participants.userId, userId)
                                         )
                                     )
           return !!result                          
     }

     async getParticipant(conversationId: string, userId: string): Promise<ParticipantsRow | null> {
             return  await this.db.select().from(participants)
                                     .where(
                                         and(
                                             eq(participants.conversationId, conversationId),
                                             eq(participants.userId, userId)
                                         )
                                     )
                                     .then(row => row[0] || null)
     }

    async  updateParticipant( data: Partial<ParticipantsRow>): Promise<ParticipantsRow> {
                const [result] = await this.db.update(participants)
                                         .set(data)
                                         .where(and(
                                              eq(participants.conversationId, data.conversationId!),
                                              eq(participants.userId, data.userId!)
                                         ))
                                         .returning()
          if(!result){
                 throw new InternalServerException("Failed to upadte Participant")
          }   
          return result    
     }

    async updateRole(conversationId: string, userId: string, role: "admin" | "member"): Promise<boolean> {
           
          const result = await this.db.update(participants)
                                      .set({
                                         role:role,  
                                      }).where(
                                           and(
                                               eq(participants.conversationId, conversationId),
                                               eq(participants.userId, userId)
                                           )
                                      ).returning()

          return !!result                            
                                    
     }

async markAsRead(conversationId: string,userId: string,messageId: string): Promise<boolean> {

  const result = await this.db
    .update(participants)
    .set({
      lastReadMessageId: messageId,
    })
    .where(
      and(
        eq(participants.conversationId, conversationId),
        eq(participants.userId, userId)
      )
    )
    .returning();

  return result.length > 0;
}
     async isParticipant(conversationId: string, userId: string): Promise<boolean> {
        const  result  = await this.db.select().from(participants)
                                              .where(
                                                   and(
                                                        eq(participants.conversationId, conversationId),
                                                        eq(participants.userId, userId)
                                                   )
                                              )
                                              .limit(1)
         return !!result                                      
     }

     async getConversationParticipants(conversationId:string) :Promise<string[]>{
          const result = await this.db
    .select({ userId: participants.userId })
    .from(participants)
    .where(eq(participants.conversationId, conversationId)); // limit हटा दिया गया

  // चूँकि select एक array return करता है, इसे map करके सिर्फ IDs निकालें
  return result.map(p => p.userId);                           
     }

  async getAllConversationParticipants(
     conversationId:string,userId:string,limit:number,page:number)
     :Promise<PaginatedResponse<ParticipantsRow>>
  {

  const offset = (page - 1) * limit;

  // ─────────────────────────────
  // Build dynamic conditions
  // ─────────────────────────────
  const conditions = [];

  if (conversationId) {
    conditions.push(eq(participants.conversationId, conversationId));
  }

  if (userId) {
    conditions.push(eq(participants.userId, userId));
  }

  // ─────────────────────────────
  // Data query
  // ─────────────────────────────
  const data = await this.db
    .select()
    .from(participants)
    .where(conditions.length ? and(...conditions) : undefined)
    .limit(limit)
    .offset(offset);

  // ─────────────────────────────
  // Count query
  // ─────────────────────────────
  const [countResult] = await this.db
    .select({ count: sql<number>`count(*)` })
    .from(participants)
    .where(conditions.length ? and(...conditions) : undefined);

  const total = countResult?.count ?? 0;

  return {
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}
}