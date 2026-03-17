"use client"

import Navbar from "@/components/Navbar";
import ChatArea from "../components/ChatArea";
import { useFetchUserConversationQuery } from "@/redux/rest-api/conversationApi";
import { Contact, Conversation } from "@/@types/ConversationTypes";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { socket } from "@/socket/socket";

export default function ChatPage() {

    const params = useParams();
  const conversationId = params?.conversationId as string;
    const { data } = useFetchUserConversationQuery();

  const contacts: Contact[] =
    data?.data?.map((c: Conversation) => ({
      id: c.id,
      name: c.title,
      msg: c.lastMessage?.content ?? "Start chatting",
      time: c.lastMessage?.createdAt ?? "",
      unread: 0,
      online: false,
      avatar: c.avatar ?? "",
      color: "#9b59b6",
    })) ?? [];

    useEffect(()=>{
       if(!conversationId) return;
       socket.emit("chat:room", conversationId,(err?:string)=>{
           if(err){
                  console.error("Failed to join chat:", err);
           }else{
               console.error("Failed to join chat:", err);
           }
       })
       return ()=>{
          socket.emit("chat:leave", conversationId)
       }
    },[conversationId])


  const activeConversation = contacts.find(
    (c) => c.id === params.conversationId
  );
  return (
        <div className="flex flex-col h-screen">
       <div className="flex-none">
          <Navbar conversation={activeConversation} />
      </div>
          <ChatArea conversationId={conversationId} />;
        </div>
  )
  
}