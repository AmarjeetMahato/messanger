import { User } from "@/@types/UserType";
import ChatPageClient from "./ChatPageClient";
import { cookies } from "next/headers";
import { Conversation } from "@/@types/ConversationTypes";
import { RawMessage } from "@/@types/MessageTypes";

export default async function Page({
  params,
}: {
  params: Promise<{ conversationId: string }>;
}) {
  const { conversationId } = await params; // Await it here!
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  // console.log("token ", token);

  // ---------------- USER ----------------
  const meRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL!}/auth/me`, {
    headers: { Cookie: `accessToken=${token}` },
    cache: "no-store",
  });
  const me: { data: User } = await meRes.json();

  // ---------------- CONVERSATIONS ----------------
  const convoRes = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL!}/conversation/fetch_convo_by_userId`,
    {
      headers: { Cookie: `accessToken=${token}` },
      cache: "no-store",
    },
  );
  const conversations: { data: Conversation[] } = await convoRes.json();

  // ---------------- MESSAGES ----------------
  const msgRes = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL!}/message/${conversationId}`,
    {
      headers: { Cookie: `accessToken=${token}` },
      cache: "no-store",
    },
  );

  const messages: { data: { messages: RawMessage[] } } = await msgRes.json();

  return (
    <ChatPageClient
      currentUser={me.data}
      conversations={conversations.data}
      initialMessages={messages.data.messages}
      conversationId={conversationId}
    />
  );
}
