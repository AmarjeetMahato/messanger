import {Server as HTTPServer} from "http"
import {Server,Socket} from "socket.io"
import jwt from "jsonwebtoken";
import { db } from "../config/database";
import { participants } from "../config/schema/Participants.model";
import { and, eq } from "drizzle-orm";
import * as cookie from "cookie"; // यह तरीका आजमाएं

interface AuthenticatedSocket extends Socket {
  userId?: string;
}

let io:Server | null = null
let onlineUsers = new Map<string,string>();

export function intitializeSocket(httpServer:HTTPServer){
     
     io = new Server(httpServer,{
         cors:{
            origin:process.env.FRONTEND_URL!,
            methods:["POST","GET"],
            credentials:true
         }
     })

       // Correct middleware
  io.use((socket: AuthenticatedSocket, next) => {
    try {
      const rawCookies = socket.handshake.headers.cookie;

      if (!rawCookies) {
      console.log("No cookies found in handshake");
      return next(new Error("Unauthorized"));
    }

     // सुरक्षित तरीके से कुकी पार्स करें
    const parsedCookies = cookie.parse(rawCookies);
    const token = parsedCookies.accessToken; // आपकी कुकी का नाम 'token' होना चाहिए

    if (!token) {
      return next(new Error("Unauthorized"));
    }
        const decodedToken = jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as { userId: string };
      
      if (!decodedToken) return next(new Error("Unauthorized"));
      socket.userId = decodedToken.userId;
      next();
    } catch (error:any | unknown) {
      next(error);
    }
  });


//   Create Connection
io.on("connection",(socket:AuthenticatedSocket)=>{

    const userId = socket.userId;
    const newSocketId = socket.id!;

    if(!userId){
          socket.disconnect(true)
          return;
    }
      // store online user
    onlineUsers.set(userId,newSocketId);
        // broadcast online users
    io?.emit("online:users",Array.from(onlineUsers.keys()))

      // personal room for this user
  socket.join(`users:${userId}`)
  // join chat room
    socket.on("chat:room", async(chatId:string, callback?:(err?: string) => void)=>{
                     try {
                        const member = await db.select()
                                          .from(participants)
                                          .where(and(
                                              eq(participants.conversationId,chatId),
                                              eq(participants.userId,userId)
                                          )).limit(1)
                   if (!member) {
                         throw new Error("User not participant");
                      }

          socket.join(`chat:${chatId}`);

          callback?.();
             } catch (error) {
                         callback?.("Error joining chat")
                     }
    })

    // leave chat room
    socket.on("chat:leave",(chatId:string)=>{
        if(chatId){
              socket.leave(`chat:${chatId}`)
              console.log(`User ${userId} left room chat:${chatId}`)
        }
    })

    // disconnect
  socket.on("disconnect", () => {
    if (onlineUsers.get(userId) === newSocketId) {
      onlineUsers.delete(userId)
      io?.emit("online:users", Array.from(onlineUsers.keys()))
      console.log("socket disconnected", { userId, newSocketId })
    }
  })   
})

}

// -----------------------------
// Emit new chat to participants
// -----------------------------
export  function emitNewChatToParticipants(participantIds:string[], chat:any){
         participantIds.forEach((userId)=>{
               const socketId = onlineUsers.get(userId)
               if(socketId){
                   io?.to(socketId).emit("chat:new", chat)
               }
         })
}

// -----------------------------
// Emit new message to chat room
// -----------------------------
export function emitNewMessageToChatRoom(senderId: string, chatId: string, message: any){
    io?.to(`chat:${chatId}`).emit("chat:message:new",{senderId,chatId,message})
}

// -----------------------------
// Emit last message to participants
// -----------------------------
export  function emitLastMessageToParticipants(participantIds:string[], chatId: string, lastMessage: any){
       participantIds.forEach((userId)=>{
            const socketId = onlineUsers.get(userId);
             const roomName = `users:${userId}`;
             console.log(`Emitting to room: ${roomName}`);
            if(roomName){
                io?.to(roomName).emit("chat:lastMessage",{chatId,lastMessage})
            }
       })
}