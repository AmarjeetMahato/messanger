/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import React, { useEffect, useMemo, useState } from "react";
import { Search, MoreHorizontal, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCreateConversationMutation, useFetchUserConversationQuery } from "@/redux/rest-api/conversationApi";
import { useGetAllUsersQuery ,useGetMeQuery} from "@/redux/rest-api/userApi";
import { User } from "@/@types/UserType";
import Image from "next/image";
import { socket } from "@/socket/socket";
import { formatSidebarTime } from "@/utils";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/redux/slices/userSlice";



type TabType = "all" | "unread" | "groups" | "people";

export default function WhatsAppSidebar() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [search, setSearch] = useState<string>("");
  const [active, setActive] = useState<string>("");
  const [tab, setTab] = useState<TabType>("all");
  const [page, setPage] = useState<number>(1)
 const { data } = useFetchUserConversationQuery(undefined);
const [lastMessageMap, setLastMessageMap] = useState<Record<string, any>>({});

const {data:userData,isLoading:userLoading} = useGetMeQuery(undefined);
console.log("userData" ,userData?.data);
if (userData?.data) {
  dispatch(setCredentials({ user: userData.data }));
}



useEffect(() => {
  if (!socket) return;
  const handleLastMessage = ({ chatId, lastMessage }: any) => {
    console.log("Live Sidebar Update for:", chatId);
    setLastMessageMap((prev) => ({
      ...prev,
      [chatId]: lastMessage,
    }));
  };
  socket.on("chat:lastMessage", handleLastMessage);
  return () => {
    socket.off("chat:lastMessage", handleLastMessage);
  };
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [socket]);

const contacts = useMemo(() => {
  const apiConversations = data?.data ?? [];

  return apiConversations.map((c: any) => {
    const liveUpdate = lastMessageMap[c.id];
    return {
      id: c.id,
      name: c.title,
      msg: liveUpdate ? liveUpdate.content : (c.lastMessage?.content || "No messages yet"),
      time: liveUpdate ? liveUpdate.createdAt : (c.lastMessage?.createdAt || c.createdAt),
      unread: 0,
      avatar: c.avatar,
      color: "#9b59b6",
      online: false,
    };
  });
}, [data, lastMessageMap]);


const {data:alluserData} =  useGetAllUsersQuery({limit:20,page}, 
{ skip: tab !== "people",  refetchOnFocus: true,  refetchOnMountOrArgChange: true },
)  

const [createConversation, { isLoading}] = useCreateConversationMutation();

const handleStartChat = async (userId: string) => {
  try {
    // 1️⃣ Call your API to create or fetch existing conversation
      const res = await createConversation({ receiverId:userId}).unwrap();
      if(res.success===true && res?.data?.id){
           router.push(`/chat/${res.data.id}`); 
      }
  } catch (err) {
    console.error("Error starting chat:", err);
  }
};

const filtered = contacts.filter((c) => {
    const matchesSearch = 
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.msg.toLowerCase().includes(search.toLowerCase());
    
    if (!matchesSearch) return false;
    if (tab === "unread") return c.unread > 0;
    if (tab === "groups") return c.name.includes("Team") || c.name.includes("Crew");
    return true;
  });

  const openChat = (conversationId: string) => {
  router.push(`/chat/${conversationId}`);
};
  const unreadCount = contacts.filter(c => c.unread > 0).length;

const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
  if (tab !== "people") return; // only load users in people tab

  const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;

  const bottom = scrollHeight - scrollTop <= clientHeight + 10;

  if (bottom) {
    setPage((prev) => prev + 1);
  }
};

return (
    <div className="flex items-center justify-center min-h-screen bg-[#0a0a0f] font-sans">
      <div className="relative flex flex-col w-full  h-180  overflow-hidden bg-[#0d001f] shadow-[0_32px_80px_rgba(120,0,200,0.35),0_0_0_1px_rgba(150,80,220,0.2)]">
        
        {/* Header Section */}
        <header className="relative p-5 pb-0 overflow-hidden bg-linear-to-br from-[#1a0030] via-[#2d0057] to-[#0d001a]">
          {/* Decorative Glows */}
          <div className="absolute -top-15 -right-10 w-48 h-48 bg-purple-500/25 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -top-5 -left-7.5 w-36 h-36 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative flex items-center justify-between mb-4">
            <div>
              <h1 className="text-[22px] font-semibold text-[#f0e6ff] tracking-tight">Messages</h1>
              <p className="text-[11px] text-purple-400/70">{unreadCount} unread conversations</p>
            </div>
            <div className="flex gap-2.5 items-center">
  {/* 1. Menu Button (Three Dots) */}
  <button 
    className="flex items-center justify-center w-9 h-9 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 hover:bg-purple-500/20 transition-colors"
    aria-label="More options"
  >
    <MoreHorizontal size={18} />
  </button>

  {/* 2. User Profile Button */}
  <button 
  className="relative flex items-center justify-center w-9 h-9 rounded-full bg-purple-500/10 border border-purple-500/20 hover:bg-purple-500/20 transition-all overflow-hidden"
  aria-label="User profile"
>
  {userLoading ? (
    /* --- Loading Preview (Skeleton) --- */
    <div className="w-full h-full bg-purple-500/20 animate-pulse flex items-center justify-center">
      <div className="w-4 h-4 border-2 border-purple-400/30 border-t-purple-400 rounded-full animate-spin" />
    </div>
  ) : userData?.data?.avatarUrl ? (
    /* --- Next.js Optimized Image --- */
    <Image
      src={userData.data.avatarUrl}
      alt={userData.data.fullName || "Profile"}
      fill // Makes image fill the button container
      sizes="36px"
      className="object-cover"
    />
  ) : (
    /* --- Fallback: Initials --- */
    <span className="text-sm font-medium text-purple-400 uppercase">
      {userData?.data?.fullName &&  userData?.data?.fullName?.charAt(0) || "U"}
    </span>
  )}
</button>
</div>
          </div>

          {/* Search Bar */}
          <div className="relative flex items-center gap-2.5 px-3.5 py-2.5 mb-4 bg-white/5 border border-purple-500/20 rounded-xl backdrop-blur-md transition-all focus-within:border-purple-500/40">
            <Search size={16} className="text-purple-400/60" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search conversations..."
              className="flex-1 bg-transparent border-none text-[14px] text-purple-100 placeholder-purple-400/40 outline-none"
            />
            {search && (
              <button onClick={() => setSearch("")} className="p-0.5 rounded-full bg-purple-500/20 text-purple-400 hover:bg-purple-500/40 transition-colors">
                <X size={12} />
              </button>
            )}
          </div>

          {/* Tabs */}
                        <nav className="flex gap-1"> 
            {(["all", "unread", "groups", "people"] as TabType[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 py-2 text-[12px] font-medium capitalize transition-all border-b-2 
                  ${tab === t ? "text-purple-400 border-purple-500" : "text-purple-400/40 border-transparent hover:text-purple-400/60"}`}
              >
                {t}
                {t === "unread" && (
                  <span className="ml-1.5 px-1.5 py-0.5 bg-violet-600 text-white text-[10px] font-bold rounded-full">
                    {unreadCount}
                  </span>
                )}
              </button>
            ))}
          </nav>
     
        
{tab === "people" && (
  <div className="flex flex-col" onScroll={handleScroll}>
    {alluserData?.data.data?.map((user: User) => (
      <div
        key={user.id}
        className="flex items-center justify-between gap-3 p-3 hover:bg-purple-500/10 cursor-pointer"
      >
        {/* Avatar */}
        <div className="flex items-center gap-3">
          {user.avatarUrl ? (
            <div className="w-10 h-10 relative rounded-full overflow-hidden">
  <Image
    src={user.avatarUrl || "/default-avatar.png"} // fallback avatar
    alt={`${user.fullName}'s avatar`}
    fill
    className="object-cover"
    sizes="40px"
  />
</div>
          ) : (
            <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-semibold">
              {user.fullName.charAt(0)}
            </div>
          )}

          {/* User info */}
          <div className="flex flex-col">
            <span className="text-sm text-white font-medium">{user.fullName}</span>
            <span className="text-xs text-gray-400">@{user.username}</span>
          </div>
        </div>

        {/* Chat Button */}
        <button
          onClick={() => handleStartChat(user.id)}
          className="px-3 py-1.5 bg-purple-500 hover:bg-purple-600 text-white text-xs rounded-lg transition-colors"
        >
         {user.id && (
          <>
              {isLoading ? "Creating.." : "Chat"} 
          </>
                 
         )} 
       
        </button>
      </div>
    ))}
  </div>
)}
        </header>

        {/* Contact List */}
        {tab !== "people" && (
                 <main className="flex-1 overflow-y-auto bg-linear-to-b from-[#0d001f] to-[#080010] [&::-webkit-scrollbar]:w-0.75 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-purple-900/60 [&::-webkit-scrollbar-thumb]:rounded-full">         
          {filtered.length === 0 ? (
            <div className="text-center text-purple-400/40 py-10 text-[13px]">No conversations found</div>
          ) : (
            filtered.map((c, i) => (
              <div
                key={c.id}
                onClick={() => openChat(c.id.toString())}
                style={{ animationDelay: `${i * 40}ms` }}
                className={`flex items-center gap-3.5 px-4.5 py-3.25 cursor-pointer transition-colors animate-in fade-in slide-in-from-bottom-2 duration-300
                  ${active === c.id ? "bg-purple-500/20 border-l-[3px] border-purple-500" : "bg-transparent border-l-[3px] border-transparent hover:bg-purple-500/10"}`}
              >
                {/* Avatar */}
             <div className="relative shrink-0 w-12 h-12">
  {c.avatar && c.avatar.startsWith("http")  ? (
    <div className=" relative w-12 h-12 rounded-full overflow-hidden">
                  <Image
      src={c.avatar || "/default-avatar.png"} // this must be a full URL or configured in next.config.js
      alt={`${c.name}'s avatar`}
      fill
        className="object-cover absolute"
    />
    </div>
   
  ) : (
    <div
      className={`w-12 h-12 rounded-full flex items-center justify-center text-[13px] font-semibold text-purple-50 border-2 transition-all`}
      style={{ background: `linear-gradient(135deg, ${c.color}, ${c.color}88)` }}
    >
      {c.name.charAt(0)}
    </div>
  )}

  {c.online && (
    <div className="absolute bottom-0.5 right-0.5 w-2.75 h-2.75 bg-green-500 border-2 border-[#0d001f] rounded-full animate-pulse" />
  )}
</div>
                {/* Text Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-0.5">
                    <h3 className={`text-[14px] truncate max-w-40 ${c.unread > 0 ? "font-semibold text-purple-50" : "font-normal text-purple-200"}`}>
                      {c.name}
                    </h3>
                    <span className={`text-[11px] ${c.unread > 0 ? "text-purple-500 font-semibold" : "text-purple-400/40"}`}>
                        {formatSidebarTime(c.time)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className={`text-[12px] truncate max-w-47.5 ${c.unread > 0 ? "text-purple-400/80 font-medium" : "text-purple-400/50"}`}>
                      {c.msg}
                    </p>
                    {c.unread > 0 && (
                      <span className="min-w-5 h-5 px-1.5 flex items-center justify-center bg-linear-to-br from-purple-600 to-violet-700 text-white text-[10px] font-bold rounded-full shadow-[0_2px_8px_rgba(147,51,234,0.5)]">
                        {c.unread}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </main>
        )}
       

      </div>
    </div>
  );
}

