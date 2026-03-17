"use client";

import React from 'react';
import { MessageCircle, Users, Zap, Shield } from 'lucide-react';

const Chat = () => {
  return (
    // Main Background Container
    <div className="flex flex-col h-screen bg-[#0a0a0f] font-sans items-center justify-center p-8 overflow-hidden relative">
      
      {/* Decorative Background Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Card Container */}
      <div className="relative max-w-4xl w-full bg-[#0d001f] rounded-3xl overflow-hidden shadow-[0_32px_80px_rgba(120,0,200,0.25),0_0_0_1px_rgba(150,80,220,0.15)] flex flex-col items-center p-12 text-center">
        
        {/* Header Section with the Specific Gradient */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-[#1a0030] via-[#2d0057] to-[#0d001a] opacity-50 pointer-events-none" />

        {/* Icon Container */}
        <div className="relative z-10 inline-block mb-8">
          <div className="w-28 h-28 bg-gradient-to-br from-purple-600 to-indigo-700 rounded-3xl flex items-center justify-center shadow-[0_0_40px_rgba(147,51,234,0.3)]">
            <MessageCircle className="w-14 h-14 text-white" />
          </div>
          {/* Status Indicators */}
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-[3px] border-[#0d001f]"></div>
        </div>

        {/* Text Content */}
        <div className="relative z-10">
          <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">
            Start a Conversation
          </h1>
          <p className="text-purple-200/60 text-lg mb-12 max-w-lg mx-auto">
            Select a contact from your list to begin chatting, or search for someone to start a new conversation.
          </p>
        </div>

        {/* Features Grid */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 w-full">
          {[
            { Icon: Zap, label: "Instant Messages", desc: "Real-time delivery", color: "text-blue-400", bg: "bg-blue-500/10" },
            { Icon: Shield, label: "Secure & Private", desc: "End-to-end encrypted", color: "text-purple-400", bg: "bg-purple-500/10" },
            { Icon: Users, label: "Group Chats", desc: "Connect with teams", color: "text-indigo-400", bg: "bg-indigo-500/10" }
          ].map((feature, i) => (
            <div key={i} className="bg-[#160a2d]/50 rounded-2xl p-6 border border-purple-500/10 hover:border-purple-500/30 transition-all group">
              <div className={`w-12 h-12 ${feature.bg} rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                <feature.Icon className={`w-6 h-6 ${feature.color}`} />
              </div>
              <h3 className="font-semibold text-white mb-1">{feature.label}</h3>
              <p className="text-xs text-purple-300/50">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="relative z-10 w-full bg-gradient-to-r from-purple-600/20 to-indigo-600/20 rounded-2xl p-8 border border-purple-500/20">
          <h2 className="text-xl font-bold text-white mb-2">Ready to Connect?</h2>
          <p className="text-purple-200/60 mb-6 text-sm">
            Choose a contact from the sidebar to start chatting
          </p>
          <div className="flex items-center justify-center gap-3 text-purple-400 animate-pulse">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium text-sm">Select a user from the left panel</span>
          </div>
        </div>

        {/* Bottom Tips */}
        <div className="mt-8 flex flex-wrap justify-center gap-6 text-xs text-purple-300/40">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
            <span>Online users shown in green</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-purple-500 rounded-full shadow-[0_0_8px_rgba(168,85,247,0.5)]"></div>
            <span>Click any user to begin</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const ArrowLeft = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);

export default Chat;