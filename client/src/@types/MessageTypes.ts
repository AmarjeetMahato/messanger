// TypeScript interface for a message
export interface Message {
  id: string;                       // UUID
  conversationId: string;           // UUID of conversation
  senderId: string;                 // UUID of sender
  content?: string;                 // message content, optional for non-text
  type: "text" | "image" | "video" | "file";   // message type
  status: "sent" | "delivered" | "read";      // message status
  editedAt?: string | null;         // ISO string of edited date, optional
  deletedAt?: string | null;        // ISO string of deleted date, optional
  createdAt: string;                // ISO string of creation date
}

export interface MessageRequest{
   conversationId:string,
   content:string
}

export interface MessageResponse {
   success:boolean,
   message:string,
   data:Message
}