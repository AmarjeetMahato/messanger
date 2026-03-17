export interface LastMessage {
  id: string;
  content: string;
  senderId: string;
  createdAt: string;   // ISO date string
  type: "text" | "image" | "video" | "file";
}

export interface Conversation{
    id: string,
    type: string,
    title: string,
    avatar: null | string,
    lastMessage:LastMessage
}

export interface ConversationResponse {
   success:boolean,
   message:string,
   data:Conversation[]
}


// Types
export interface Contact {
  id: string;
  name: string;
  msg: string;
  time: string;
  unread: number;
  online: boolean;
  avatar?: string;
  color: string;
}

export interface CreateConversationResponse {
  message: string;
  success: boolean;
  data: {
    id: string; // conversation ID
  };
}

export interface CreateConversationRequest {
  receiverId: string; // the user you want to start a conversation with
}
