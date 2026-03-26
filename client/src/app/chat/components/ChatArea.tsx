/* eslint-disable @next/next/no-page-custom-font */
"use client";

import { useGetMessagesQuery, useSendMessagesMutation } from "@/redux/rest-api/messageAPI";
import { useGetMeQuery } from "@/redux/rest-api/userApi";
import { useState, useRef, useEffect, useMemo } from "react";
import { socket } from "@/socket/socket";
import { RawMessage } from "@/@types/MessageTypes";

interface Message{
  id: string;
  text: string;
  sender: "me" | "other";
  time: string;
  status?: "sent" | "delivered" | "read";
  reactions?: string[];
}



const EMOJI_LIST = ["❤️", "😂", "😮", "😢", "👍", "🙏"];

const StatusTick = ({ status }: { status?: Message["status"] }) => {
  if (!status) return null;
  if (status === "sent") return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white/40">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
  if (status === "delivered") return (
    <svg width="16" height="14" viewBox="0 0 28 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white/40">
      <polyline points="24 6 11 17 6 12" /><polyline points="17 6 11 11" />
    </svg>
  );
  return (
    <svg width="16" height="14" viewBox="0 0 28 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-400">
      <polyline points="24 6 11 17 6 12" /><polyline points="17 6 11 11" />
    </svg>
  );
};

const ChatArea = ({conversationId}:{conversationId:string}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [rawMessage, setRawMessage] = useState<RawMessage[]>([]);
  const [input, setInput] = useState("");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [emojiPickerFor, setEmojiPickerFor] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const {data} = useGetMeQuery()
  const currentUserId = data?.data?.id;

  const { data: messageData, isLoading } = useGetMessagesQuery(conversationId);

  // 1️⃣ Listen to new messages from socket
  useEffect(()=>{
      if(!socket) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function handleNewMessage({ chatId, message }: {chatId:string, message:RawMessage}){
          if(chatId !== conversationId) return // Ignore the other conversation;
          console.log("socket message ", message);
          
          setRawMessage(prev => [...prev, message])
    }
      socket.on("chat:message:new", handleNewMessage)
      return () => {
           socket.off("chat:message:new", handleNewMessage)
      }
  },[conversationId])

  console.log("rawMessage ", rawMessage)

const chatMessages = useMemo(() => {
  return rawMessage.map(msg => ({
    id: msg.id,
    text: msg.content ?? "",
    sender: msg.senderId === currentUserId ? "me" : "other",
    time: new Date(msg.createdAt).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    status: msg.status,
  }));
}, [rawMessage, currentUserId]);

console.log("chatMessage ", chatMessages);


  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
 const [sendMessages] = useSendMessagesMutation();

  const sendMessage = async () => {
    const text = input.trim();
    if (!text) return;
      try {
    const response = await sendMessages({
      conversationId,
      content: text,
    }).unwrap();

    const apiMsg = response.data;

    const msg: Message = {
      id: apiMsg.id,
      text: apiMsg.content ?? "",
      sender: "me",
      time: new Date(apiMsg.createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      status: apiMsg.status,
      reactions: [],
    };

    setMessages((prev) => [...prev, msg]);
    setInput("");
    inputRef.current?.focus();

  } catch (error) {
    console.error("Message send failed", error);
  }
  };

  const addReaction = (msgId: string, emoji: string) => {
    setMessages((p) =>
      p.map((m) =>
        m.id === msgId
          ? { ...m, reactions: m.reactions?.includes(emoji) ? m.reactions.filter((e) => e !== emoji) : [...(m.reactions || []), emoji] }
          : m
      )
    );
    setEmojiPickerFor(null);
  };

  // Group messages by date (simplified — just shows "Today")
  const dateLabel = "Today";

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Syne:wght@700;800&display=swap" rel="stylesheet" />

      <div
        className="flex flex-col w-full h-screen bg-[#070711] overflow-hidden"
        onClick={() => { setEmojiPickerFor(null); setHoveredId(null); }}
      >
        {/* ── Background orbs ── */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -left-40 w-125 h-125 bg-indigo-600 rounded-full blur-[140px] opacity-10 animate-pulse" />
          <div className="absolute -bottom-32 -right-32 w-105 h-105 bg-violet-600 rounded-full blur-[120px] opacity-10 animate-pulse delay-1000" />
        </div>

        {/* ── Message list ── */}
        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-1 relative z-10 scroll-smooth"
          style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(99,102,241,0.2) transparent" }}
        >
          {/* Date chip */}
          <div className="flex items-center justify-center mb-4">
            <span className="text-[11px] text-white/30 bg-white/5 border border-white/[0.07] px-3 py-1 rounded-full tracking-wide uppercase font-medium">
              {dateLabel}
            </span>
          </div>

          {chatMessages.map((msg, idx) => {
            const isMe = msg.sender === "me";
            const prevSame = idx > 0 && chatMessages[idx - 1].sender === msg.sender;
            const nextSame = idx < chatMessages.length - 1 && chatMessages[idx + 1].sender === msg.sender;

            return (
              <div
                key={msg.id}
                className={`flex items-end gap-2 ${isMe ? "justify-end" : "justify-start"} ${prevSame ? "mt-0.5" : "mt-3"}`}
                onMouseEnter={() => setHoveredId(msg.id)}
                onMouseLeave={() => { if (emojiPickerFor !== msg.id) setHoveredId(null); }}
              >
                {/* Other user avatar (only on last in group) */}
                {!isMe && (
                  <div className="shrink-0 w-7 self-end mb-1">
                    {!nextSame ? (
                      <div className="w-7 h-7 rounded-full bg-linear-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-[11px] font-bold text-white shadow shadow-indigo-500/30">
                        SJ
                      </div>
                    ) : <div className="w-7" />}
                  </div>
                )}

                <div className={`relative max-w-[72%] flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                  {/* Bubble */}
                  <div
                    className={`relative px-4 py-2.5 text-sm leading-relaxed shadow-md transition-all duration-150 ${
                      isMe
                        ? "bg-linear-to-br from-indigo-500 to-violet-600 text-white rounded-2xl rounded-br-sm shadow-indigo-500/20"
                        : "bg-white/[0.07] text-white/90 border border-white/[0.07] rounded-2xl rounded-bl-sm backdrop-blur-sm"
                    } ${prevSame && !isMe ? "rounded-tl-lg" : ""} ${prevSame && isMe ? "rounded-tr-lg" : ""}`}
                    style={{ fontFamily: "DM Sans, sans-serif" }}
                  >
                    {/* Link detection */}
                    {msg.text.startsWith("http") ? (
                      <a href={msg.text} target="_blank" rel="noreferrer"
                        className={`underline underline-offset-2 break-all ${isMe ? "text-white/80 hover:text-white" : "text-indigo-400 hover:text-indigo-300"}`}>
                        {msg.text}
                      </a>
                    ) : (
                      <span>{msg.text}</span>
                    )}

                    {/* Time + status */}
                    <div className={`flex items-center gap-1 mt-1 -mb-0.5 ${isMe ? "justify-end" : "justify-start"}`}>
                      <span className={`text-[10px] ${isMe ? "text-white/50" : "text-white/30"}`}>{msg.time}</span>
                      {isMe && <StatusTick status={msg.status} />}
                    </div>
                  </div>

                  {/* Reactions */}
                  {/* {msg.reactions && msg.reactions.length > 0 && (
                    <div className={`flex gap-0.5 mt-1 -translate-y-1 ${isMe ? "justify-end" : "justify-start"}`}>
                      {msg.reactions.map((r, ri) => (
                        <button
                          key={ri}
                          onClick={(e) => { e.stopPropagation(); addReaction(msg.id, r); }}
                          className="text-sm bg-white/8 border border-white/10 rounded-full px-1.5 py-0.5 hover:bg-white/[0.14] transition-colors cursor-pointer"
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  )} */}

                  {/* Hover actions */}
                  {hoveredId === msg.id && (
                    <div
                      className={`absolute -top-8 flex items-center gap-1 ${isMe ? "right-0" : "left-0"}`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* Emoji react */}
                      <div className="relative">
                        <button
                          onClick={() => setEmojiPickerFor((p) => p === msg.id ? null : msg.id)}
                          className="w-7 h-7 rounded-xl bg-[#13131f] border border-white/10 flex items-center justify-center text-white/50 hover:text-white/90 hover:bg-white/8 transition-all cursor-pointer text-sm"
                        >
                          😊
                        </button>
                        {emojiPickerFor === msg.id && (
                          <div className={`absolute top-8 flex gap-1 bg-[#13131f] border border-white/10 rounded-2xl px-2 py-1.5 shadow-2xl z-50 ${isMe ? "right-0" : "left-0"}`}>
                            {EMOJI_LIST.map((e) => (
                              <button
                                key={e}
                                onClick={() => addReaction(msg.id, e)}
                                className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors cursor-pointer text-base"
                              >
                                {e}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      {/* Reply */}
                      <button className="w-7 h-7 rounded-xl bg-[#13131f] border border-white/10 flex items-center justify-center text-white/50 hover:text-white/90 hover:bg-white/8 transition-all cursor-pointer">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="9 14 4 9 9 4" /><path d="M20 20v-7a4 4 0 0 0-4-4H4" />
                        </svg>
                      </button>
                      {/* More */}
                      <button className="w-7 h-7 rounded-xl bg-[#13131f] border border-white/10 flex items-center justify-center text-white/50 hover:text-white/90 hover:bg-white/8 transition-all cursor-pointer">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                          <circle cx="5" cy="12" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="19" cy="12" r="1.5" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>

                {/* My avatar */}
                {isMe && (
                  <div className="shrink-0 w-7 self-end mb-1">
                    {!nextSame ? (
                      <div className="w-7 h-7 rounded-full bg-linear-to-br from-cyan-400 to-indigo-500 flex items-center justify-center text-[11px] font-bold text-white shadow shadow-cyan-500/30">
                        ME
                      </div>
                    ) : <div className="w-7" />}
                  </div>
                )}
              </div>
            );
          })}

          {/* Typing indicator */}
          <div className="flex items-end gap-2 mt-3">
            <div className="w-7 h-7 rounded-full bg-linear-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-[11px] font-bold text-white shrink-0">
              SJ
            </div>
            <div className="bg-white/[0.07] border border-white/[0.07] rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1">
              {[0, 150, 300].map((delay) => (
                <span
                  key={delay}
                  className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce"
                  style={{ animationDelay: `${delay}ms`, animationDuration: "1s" }}
                />
              ))}
            </div>
          </div>

          <div ref={bottomRef} />
        </div>

        {/* ── Input bar ── */}
         <div className="relative z-10 px-4 py-3 border-t border-white/6 bg-[#0a0a14]/80 backdrop-blur-xl">
          <div className="flex items-end gap-2">

            <button className="shrink-0 w-10 h-10 rounded-xl bg-white/4 border border-white/[0.07] flex items-center justify-center text-white/40 hover:text-white/70 hover:bg-white/8 transition-all duration-150 cursor-pointer mb-0.5">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
              </svg>
            </button>

            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                placeholder="Type a message..."
                className="w-full bg-white/5 border border-white/8 rounded-2xl px-4 py-3 pr-12 text-white/90 text-sm placeholder:text-white/25 outline-none focus:border-indigo-500/50 focus:bg-indigo-500/5 focus:ring-2 focus:ring-indigo-500/10 transition-all duration-200 resize-none"
                style={{ fontFamily: "DM Sans, sans-serif" }}
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors cursor-pointer text-lg leading-none">
                😊
              </button>
            </div>

            {input.trim() ? (
              <button
                onClick={sendMessage}
                className="shrink-0 w-10 h-10 rounded-xl bg-linear-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-150 cursor-pointer mb-0.5"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            ) : (
              <button className="shrink-0 w-10 h-10 rounded-xl bg-white/4 border border-white/[0.07] flex items-center justify-center text-white/40 hover:text-white/70 hover:bg-white/8 transition-all duration-150 cursor-pointer mb-0.5">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" />
                </svg>
              </button>
            )}
          </div>
        </div> 
      </div>
    </>
  );
};

export default ChatArea;