"use client";

import { Conversation, Contact } from "@/@types/ConversationTypes";
import { RawMessage } from "@/@types/MessageTypes";
import { User } from "@/@types/UserType";
import Navbar from "@/components/Navbar";
import ChatArea from "../components/ChatArea";

type Props = {
  currentUser: User;
  conversations: Conversation[];
  initialMessages: RawMessage[];
  conversationId: string;
};

export default function ChatPageClient({
  currentUser,
  conversations,
  initialMessages,
  conversationId,
}: Props) {
  // convert conversations → contacts HERE (IMPORTANT CLEAN ARCH)
  const contacts: Contact[] = conversations.map((c) => ({
    id: c.id,
    name: c.title,
    msg: c.lastMessage?.content ?? "Start chatting",
    time: c.lastMessage?.createdAt ?? "",
    unread: 0,
    online: false,
    avatar: c.avatar ?? "",
    color: "#9b59b6",
  }));

  const activeConversation = contacts.find((c) => c.id === conversationId);

  return (
    <div className="flex flex-col h-screen">
      <Navbar conversation={activeConversation} chatId={conversationId} />

      <ChatArea
        currentUser={currentUser}
        conversations={conversations}
        initialMessages={initialMessages}
        conversationId={conversationId}
      />
    </div>
  );
}
