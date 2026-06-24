/* eslint-disable @next/next/no-page-custom-font */
"use client";
import { Paperclip, Smile, Send, Mic } from "lucide-react";
import { Conversation } from "@/@types/ConversationTypes";
import { RawMessage, Message } from "@/@types/MessageTypes";
import { User } from "@/@types/UserType";
import { useEffect, useMemo, useRef, useState } from "react";
import { Check, CheckCheck, Reply, MoreHorizontal } from "lucide-react";
import { socket } from "@/socket/socket";
import { useSendMessagesMutation } from "@/redux/rest-api/messageAPI";
import Image from "next/image";

export interface ChatAreaProps {
  currentUser: User;
  conversations: Conversation[];
  initialMessages: RawMessage[];
  conversationId: string;
}

interface StatusTickProps {
  status?: Message["status"];
}

const EMOJI_LIST = ["❤️", "😂", "😮", "😢", "👍", "🙏"];

export const StatusTick = ({ status }: StatusTickProps) => {
  if (!status) return null;

  switch (status) {
    case "sent":
      return <Check size={14} className="text-white/40" />;

    case "delivered":
      return <CheckCheck size={14} className="text-white/40" />;

    case "read":
      return <CheckCheck size={14} className="text-indigo-400" />;

    default:
      return null;
  }
};

const dateLabel = "Today";

const ChatArea = ({
  currentUser,
  conversations,
  initialMessages,
  conversationId,
}: ChatAreaProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [rawMessage, setRawMessage] = useState<RawMessage[]>([]);
  const [socketMessages, setSocketMessages] = useState<RawMessage[]>([]);
  const [input, setInput] = useState("");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [emojiPickerFor, setEmojiPickerFor] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // console.log("conversations Id ", conversationId);

  // console.log("initialMessages ", initialMessages);
  // console.log("currentUser ", currentUser);

  // console.log(" conversations ", conversations);

  const senderId = initialMessages?.[0]?.senderId;

  const [sendMessages] = useSendMessagesMutation();

  useEffect(() => {
    if (!conversationId || !socket) return;

    // 1️⃣ Function jo room join karega
    const joinChatRoom = () => {
      console.log(`Attempting to join room: chat:${conversationId}`);
      socket.emit("room:join", `chat:${conversationId}`);
    };

    // 2️⃣ Agar socket already connected hai, toh turant join karo
    if (socket.connected) {
      joinChatRoom();
    }

    // 3️⃣ 🔥 REFRESH FIX: Agar page refresh hua aur baad me reconnect hua,
    // toh reconnect hote hi auto-join ho jayega.
    socket.on("connect", joinChatRoom);

    return () => {
      // Cleanup hooks
      socket.off("connect", joinChatRoom);
      socket.emit("room:leave", `chat:${conversationId}`);
      console.log(`Left room: chat:${conversationId}`);
    };
  }, [conversationId]);

  // 1️⃣ Listen to new messages from socket
  useEffect(() => {
    function handleNewMessage({
      chatId,
      message,
    }: {
      chatId: string;
      message: RawMessage;
    }) {
      // 🔍 Sabse pehle poora data log karke dekho aa kya raha hai
      console.log("Raw Socket Data Received:", message);
      if (chatId !== conversationId) {
        console.log(`Mismatch! Expected ${conversationId} but got ${chatId}`);
        return;
      }

      setSocketMessages((prev) => {
        const exists = prev.some((m) => m.id === message.id);
        if (exists) {
          return prev;
        }
        return [...prev, message];
      });
    }

    socket.on("chat:message:new", handleNewMessage);
    return () => {
      socket.off("chat:message:new", handleNewMessage);
    };
  }, [conversationId]);

  const rawMessages = useMemo(() => {
    const merged = [...initialMessages, ...socketMessages];

    const uniqueMessages = new Map(
      merged.map((message) => [message.id, message]),
    );

    return Array.from(uniqueMessages.values()).sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );
  }, [socketMessages, initialMessages]);

  const chatMessages = useMemo(() => {
    return rawMessages.map((msg) => ({
      id: msg.id,
      text: msg.content ?? "",
      sender: msg.senderId === currentUser.id ? "me" : "other",
      time: new Date(msg.createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      status: msg.status,
    }));
  }, [rawMessages, currentUser.id]);

  useEffect(() => {
    // Thoda sa timeout dena safe rehta hai taaki DOM element render ho chuka ho
    const timeoutId = setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [chatMessages]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text) return;
    try {
      const response = await sendMessages({
        conversationId,
        content: text,
      }).unwrap();

      const apiMsg = response.data; // This is a RawMessage

      // ✅ Add the raw API response message straight to socketMessages state
      setSocketMessages((prev) => {
        const exists = prev.some((m) => m.id === apiMsg.id);
        if (exists) return prev;
        return [...prev, apiMsg];
      });

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
          ? {
              ...m,
              reactions: m.reactions?.includes(emoji)
                ? m.reactions.filter((e) => e !== emoji)
                : [...(m.reactions || []), emoji],
            }
          : m,
      ),
    );
    setEmojiPickerFor(null);
  };

  // console.log("sender details ", getSenderDetails);

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Syne:wght@700;800&display=swap"
        rel="stylesheet"
      />
      <div
        className="flex flex-col w-full h-screen bg-[#070711] overflow-hidden"
        onClick={() => {
          setEmojiPickerFor(null);
          setHoveredId(null);
        }}
      >
        {/* ── Background orbs ── */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -left-40 w-125 h-125 bg-indigo-600 rounded-full blur-[140px] opacity-10" />
          <div className="absolute -bottom-32 -right-32 w-105 h-105 bg-violet-600 rounded-full blur-[120px] opacity-10  delay-1000" />
        </div>
        {/* ── Message list ── */}
        <div
          ref={bottomRef}
          className="flex-1 overflow-y-auto px-4 py-5 space-y-1 relative z-10 scroll-smooth"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(99,102,241,0.2) transparent",
          }}
        >
          {/* Date chip */}
          <div className="flex items-center justify-center mb-4">
            <span className="text-[11px] text-white/30 bg-white/5 border border-white/[0.07] px-3 py-1 rounded-full tracking-wide uppercase font-medium">
              {dateLabel}
            </span>
          </div>

          {chatMessages.map((msg, idx) => {
            // console.log("msg ", msg);
            const isMe = msg.sender === "me";
            const prevSame =
              idx > 0 && chatMessages[idx - 1].sender === msg.sender;
            const nextSame =
              idx < chatMessages.length - 1 &&
              chatMessages[idx + 1].sender === msg.sender;

            return (
              <div
                key={msg.id}
                className={`flex items-end gap-2 ${isMe ? "justify-end" : "justify-start"} ${prevSame ? "mt-0.5" : "mt-3"}`}
                onMouseEnter={() => setHoveredId(msg.id)}
                onMouseLeave={() => {
                  if (emojiPickerFor !== msg.id) setHoveredId(null);
                }}
              >
                {/* Other user avatar (only on last in group) */}
                {!isMe && (
                  <div className="shrink-0 w-7 self-end mb-1">
                    {!nextSame ? (
                      <div
                        className="w-7 h-7 rounded-full bg-linear-to-br from-indigo-500 to-violet-600 flex items-center justify-center 
                        text-[11px] font-bold text-white shadow shadow-indigo-500/30"
                      >
                        SJ
                      </div>
                    ) : (
                      <div className="w-7" />
                    )}
                  </div>
                )}

                <div
                  className={`relative max-w-[72%] flex flex-col ${isMe ? "items-end" : "items-start"}`}
                >
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
                    {msg?.text?.startsWith("http") ? (
                      <a
                        href={msg.text}
                        target="_blank"
                        rel="noreferrer"
                        className={`underline underline-offset-2 break-all ${isMe ? "text-white/80 hover:text-white" : "text-indigo-400 hover:text-indigo-300"}`}
                      >
                        {msg.text}
                      </a>
                    ) : (
                      <span>{msg.text}</span>
                    )}

                    {/* Time + status */}
                    <div
                      className={`flex items-center gap-1 mt-1 -mb-0.5 ${isMe ? "justify-end" : "justify-start"}`}
                    >
                      <span
                        className={`text-[10px] ${isMe ? "text-white/50" : "text-white/30"}`}
                      >
                        {msg.time}
                      </span>
                      {isMe && <StatusTick status={msg.status} />}
                    </div>
                  </div>

                  {/* Hover actions */}
                  {hoveredId === msg.id && (
                    <div
                      className={`absolute -top-8 flex items-center gap-1 ${isMe ? "right-0" : "left-0"}`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* Emoji react */}
                      <div className="relative">
                        <button
                          onClick={() =>
                            setEmojiPickerFor((p) =>
                              p === msg.id ? null : msg.id,
                            )
                          }
                          className="w-7 h-7 rounded-xl bg-[#13131f] border border-white/10 flex items-center justify-center text-white/50 hover:text-white/90 hover:bg-white/8 transition-all cursor-pointer text-sm"
                        >
                          😊
                        </button>
                        {emojiPickerFor === msg.id && (
                          <div
                            className={`absolute top-8 flex gap-1 bg-[#13131f] border border-white/10 rounded-2xl px-2 py-1.5 shadow-2xl z-50 ${isMe ? "right-0" : "left-0"}`}
                          >
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
                        {/* Reply */}
                        <button className="w-7 h-7 rounded-xl bg-[#13131f] border border-white/10 flex items-center justify-center text-white/50 hover:text-white/90 hover:bg-white/8 transition-all cursor-pointer">
                          <Reply size={13} />
                        </button>
                        {/* More */}
                        <button className="w-7 h-7 rounded-xl bg-[#13131f] border border-white/10 flex items-center justify-center text-white/50 hover:text-white/90 hover:bg-white/8 transition-all cursor-pointer">
                          <MoreHorizontal size={13} />
                        </button>
                      </div>
                      {/* My avatar */}
                      {isMe && (
                        <div className="shrink-0 w-7 self-end mb-1">
                          {!nextSame ? (
                            <div className="w-7 h-7 rounded-full bg-linear-to-br from-cyan-400 to-indigo-500 flex items-center justify-center text-[11px] font-bold text-white shadow shadow-cyan-500/30">
                              {currentUser.username.charAt(0).toUpperCase()}
                            </div>
                          ) : (
                            <Image
                              src={currentUser.avatarUrl!}
                              alt="avatarUrl"
                              width={12}
                              height={12}
                            />
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        {/* ── Input bar ── */}
        <div className="relative z-10 px-4 py-3 border-t border-white/6 bg-[#0a0a14]/80 backdrop-blur-xl">
          <div className="flex items-end gap-2">
            {/* Attachment */}
            <button className="shrink-0 w-10 h-10 rounded-xl bg-white/4 border border-white/[0.07] flex items-center justify-center text-white/40 hover:text-white/70 hover:bg-white/8 transition-all duration-150 cursor-pointer mb-0.5">
              <Paperclip size={17} />
            </button>

            {/* Message Input */}
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="Type a message..."
                className="w-full bg-white/5 border border-white/8 rounded-2xl px-4 py-3 pr-12 text-white/90 text-sm placeholder:text-white/25 outline-none focus:border-indigo-500/50 focus:bg-indigo-500/5 focus:ring-2 focus:ring-indigo-500/10 transition-all duration-200"
                style={{ fontFamily: "DM Sans, sans-serif" }}
              />

              {/* Emoji */}
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors cursor-pointer"
              >
                <Smile size={18} />
              </button>
            </div>

            {/* Send / Mic Button */}
            {input.trim() ? (
              <button
                onClick={sendMessage}
                className="shrink-0 w-10 h-10 rounded-xl bg-linear-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-150 cursor-pointer mb-0.5"
              >
                <Send size={16} />
              </button>
            ) : (
              <button
                type="button"
                className="shrink-0 w-10 h-10 rounded-xl bg-white/4 border border-white/[0.07] flex items-center justify-center text-white/40 hover:text-white/70 hover:bg-white/8 transition-all duration-150 cursor-pointer mb-0.5"
              >
                <Mic size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatArea;
