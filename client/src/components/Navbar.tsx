/* eslint-disable @next/next/no-page-custom-font */
"use client";

import { Contact } from "@/@types/ConversationTypes";
import { useState, useRef, useEffect } from "react";
import { format, isToday, isYesterday, parseISO } from 'date-fns';
import Image from "next/image";

interface NavbarProps {
    conversation?: Contact;

}
export const formatWhatsAppTime = (dateInput: string | number | Date) => {
  let date: Date;

  // If string, parse as ISO
  if (typeof dateInput === 'string') {
    date = parseISO(dateInput);
  } else {
    date = new Date(dateInput);
  }

  if (isNaN(date.getTime())) {
    // Invalid date fallback
    return '';
  }

  if (isToday(date)) {
    return format(date, 'h:mm a'); // e.g., 10:30 AM
  }

  if (isYesterday(date)) {
    return 'Yesterday';
  }

  // Older dates
  return format(date, 'dd/MM/yy'); // e.g., 14/03/26
};
const Navbar = ({ conversation }: NavbarProps) => {

const avatarSrc =
  conversation?.avatar && conversation.avatar.trim() !== ""
    ? conversation.avatar
    : null;
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const menuItems = [
    {
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
      label: "View contact",
    },
    {
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ),
      label: "Starred messages",
    },
    {
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" />
        </svg>
      ),
      label: "Media, links & docs",
    },
    {
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8h1a4 4 0 0 1 0 8h-1" /><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
          <line x1="6" y1="1" x2="6" y2="4" /><line x1="10" y1="1" x2="10" y2="4" /><line x1="14" y1="1" x2="14" y2="4" />
        </svg>
      ),
      label: "Mute notifications",
    },
    { divider: true },
    {
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4h6v2" />
        </svg>
      ),
      label: "Clear chat",
      danger: true,
    },
    {
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" /><line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
        </svg>
      ),
      label: "Block",
      danger: true,
    },
  ] as const;

  // Avatar initials fallback
  const initials = conversation?.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Syne:wght@700;800&display=swap"
        rel="stylesheet"
      />

      <div className="w-full bg-[#0d0d18] border-b border-white/6 px-4 py-3 flex items-center justify-between gap-3 select-none">

        {/* Left — back arrow (mobile) + avatar + info */}
        <div className="flex items-center gap-3 min-w-0">

          {/* Back arrow (mobile feel) */}
          <button className="shrink-0 text-white/40 hover:text-white/70 transition-colors duration-150 cursor-pointer -ml-1 p-1">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
          </button>

          {/* Avatar */}
          <div className="relative shrink-0 cursor-pointer group">
            <div className="w-10 h-10 rounded-full bg-linear-to-br from-indigo-500 to-violet-600 flex items-center justify-center overflow-hidden ring-2 ring-white/[0.07] group-hover:ring-indigo-500/40 transition-all duration-200">
             {avatarSrc ? (
                            <Image 
    src={avatarSrc} 
    alt={conversation?.name || "User avatar"} 
    width={40} 
    height={40}
    className="w-full h-full object-cover"
    // Optional: handles broken links without crashing
    onError={(e) => console.error("Image failed to load", e)}
  />
      ) : (
        // 3. Fallback to the first letter
        <span 
          className="text-[14px] font-bold text-white uppercase" 
          style={{ fontFamily: "Syne, sans-serif" }}
        >
          {initials}
        </span>
      )}
            </div>
            {/* Online dot */}
            {conversation?.online && (
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#0d0d18] shadow shadow-emerald-400/50" />
            )}
          </div>

          {/* Name + status */}
          <div className="min-w-0 flex flex-col justify-center cursor-pointer">
            <h2
              className="text-[15px] font-semibold text-white/90 truncate leading-tight tracking-tight"
              style={{ fontFamily: "Syne, sans-serif" }}
            >
              {conversation?.name}
            </h2>
            <div className="flex items-center gap-1.5 mt-0.5">
              {conversation?.online  ? (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                  <span className="text-[12px] text-emerald-400/90 font-medium truncate">Online</span>
                </>
              ) : (
                <span className="text-[12px] text-white/30 truncate">{formatWhatsAppTime(conversation?.time ?? "")}</span>
              )}
            </div>
          </div>
        </div>

        {/* Right — action icons + three dots */}
        <div className="flex items-center gap-1 shrink-0">

          {/* Video call */}
          <button className="w-9 h-9 rounded-xl flex items-center justify-center text-white/40 hover:text-white/80 hover:bg-white/6 transition-all duration-150 cursor-pointer">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="23 7 16 12 23 17 23 7" />
              <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
            </svg>
          </button>

          {/* Voice call */}
          <button className="w-9 h-9 rounded-xl flex items-center justify-center text-white/40 hover:text-white/80 hover:bg-white/6 transition-all duration-150 cursor-pointer">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.84A16 16 0 0 0 16 16.91l.97-.97a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
          </button>

          {/* Search in chat */}
          <button className="w-9 h-9 rounded-xl flex items-center justify-center text-white/40 hover:text-white/80 hover:bg-white/6 transition-all duration-150 cursor-pointer">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>

          {/* Three dots menu */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((p) => !p)}
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-150 cursor-pointer ${
                menuOpen
                  ? "bg-white/8 text-white/90"
                  : "text-white/40 hover:text-white/80 hover:bg-white/6"
              }`}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="5" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="12" cy="19" r="1.5" />
              </svg>
            </button>

            {/* Dropdown */}
            {menuOpen && (
              <div className="absolute right-0 top-11 w-52 bg-[#13131f] border border-white/8 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden z-50 backdrop-blur-xl">
                {menuItems.map((item, i) => {
                  if ("divider" in item && item.divider) {
                    return <div key={i} className="h-px bg-white/6 my-1" />;
                  }
                  const { icon, label, danger } = item as { icon: React.ReactNode; label: string; danger?: boolean };
                  return (
                    <button
                      key={i}
                      onClick={() => setMenuOpen(false)}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-[13.5px] font-medium transition-colors duration-150 cursor-pointer text-left ${
                        danger
                          ? "text-red-400/80 hover:text-red-400 hover:bg-red-500/8"
                          : "text-white/60 hover:text-white/90 hover:bg-white/5"
                      }`}
                    >
                      <span className={danger ? "text-red-400/70" : "text-white/35"}>{icon}</span>
                      {label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;