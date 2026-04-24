import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../../helpers/tokens";
import {type DbOrTx } from "../../../config/database";
import { ConversationListItemDto, ConversationWithDetails, CreateDirectConversationDto } from "../dtos/conversationDto";
import { conversations, ConversationsRow } from "../../../config/schema/Conversations.model";
import { and, eq, inArray, sql,ne } from "drizzle-orm";
import { participants } from "../../../config/schema/Participants.model";
import { InternalServerException } from "../../../utils/Catch-error";
import { users } from "../../../config/schema/User.model";
import { messages } from "../../../config/schema/Messages.model";
import { alias } from "drizzle-orm/pg-core";
import { IConversationRepository } from "./conversation.Repository.Interface";
import { UUID } from "crypto";


@injectable()
export class ConversationRepository implements IConversationRepository{
    
    constructor(@inject(TOKENS.DB) private db:DbOrTx){}

async findDirectConversation(userA: string,userB: string): Promise<ConversationsRow | null> {

const [result] = await this.db
                           .select()
                           .from(conversations)
                           .innerJoin(
                                     participants,
                                     eq(participants.conversationId, conversations.id)
                                      )
                           .where(inArray(participants.userId, [userA, userB]))
                           .groupBy(conversations.id)
                           .having(sql`count(*) = 2`)
                           .limit(1);

  return result?.conversations ?? null;
}


async createDirectConversationWithParticipants(userA: string,userB: string) :Promise<ConversationsRow> {

  return await this.db.transaction(async (tx) => {

    const [conversation] = await tx
      .insert(conversations)
      .values({
        type: "direct",
        createdBy: userA,
      })
      .returning();

     if (!conversation) {
  throw new InternalServerException("Failed to create conversation");
} 

    await tx.insert(participants).values([
      {
        conversationId: conversation.id,
        userId: userA,
        role: "member",
      },
      {
        conversationId: conversation.id,
        userId: userB,
        role: "member",
      },
    ]);

    return conversation;
  });
}


async getConversationById(ConvoId:string) : Promise<ConversationsRow | null>{
       return await this.db.select()
                           .from(conversations)
                           .where(eq(conversations.id,ConvoId))
                           .then(row => row[0] || null)                                     
}

async getUserConversationsWithDetails(userId:string): Promise<ConversationWithDetails[]>{

    // 1️⃣ Get all conversations current user participates in
    const convs = await this.db
      .select({
        conversationId: conversations.id,
        type: conversations.type,
        title: conversations.title,
        lastMessageId: conversations.lastMessageId,
      })
      .from(conversations)
      .innerJoin(participants, eq(participants.conversationId, conversations.id))
      .where(eq(participants.userId, userId));

    // 2️⃣ Map conversations and fetch last message + other participant
    const convWithDetails = await Promise.all(
      convs.map(async (conv) => {
        // Last message
        let lastMessage = null;
        if (conv.lastMessageId) {
          const [msg] = await this.db
            .select({
              id: messages.id,
              content: messages.content,
              senderId: messages.senderId,
              createdAt: messages.createdAt,
              type: messages.type,
            })
            .from(messages)
            .where(eq(messages.id, conv.lastMessageId));
          lastMessage = msg || null;
        }

        // For direct chat, get the other participant info
        let otherUser = null;
        if (conv.type === "direct") {
          const [user] = await this.db
            .select({ id: users.id, username: users.username, avatar: users.avatarUrl })
            .from(users)
            .innerJoin(participants, eq(participants.userId, users.id))
            .where(
              and(
                eq(participants.conversationId, conv.conversationId),
                ne(users.id, userId)
              )
            );
          otherUser = user || null;
        }

        return {
  id: conv.conversationId,
  type: conv.type as "direct" | "group",

  title:
    conv.type === "group"
      ? conv.title ?? null
      : otherUser?.username ?? null,

  avatar:
    conv.type === "group"
      ? null
      : otherUser?.avatar ?? null,

  lastMessage,
};
      })
    );

    return convWithDetails;

}

async getUserConversationList(userId: string): Promise<ConversationListItemDto[]> {

  const p1 = alias(participants, "p1");
  const p2 = alias(participants, "p2");

  const result = await this.db
    .select({
      conversationId: conversations.id,
      username: users.username,
      avatarUrl: users.avatarUrl,
      lastMessage: messages.content,
      lastMessageCreatedAt: messages.createdAt,
    })
    .from(conversations)
    .innerJoin(p1, eq(p1.conversationId, conversations.id))
    .innerJoin(p2, eq(p2.conversationId, conversations.id))
    .innerJoin(users, eq(users.id, p2.userId))
    .leftJoin(messages, eq(messages.id, conversations.lastMessageId))
    .where(
      and(
        eq(p1.userId, userId),
        ne(p2.userId, userId)
      )
    );

  return result;
}

}