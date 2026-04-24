import { ParticipantsRow } from "../../../config/schema/Participants.model";

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

export interface IParticipantsRepository {

  // ─────────────────────────────────────────────
  // ✅ Add participant
  // ─────────────────────────────────────────────
  addParticipant(data: ParticipantsRow): Promise<ParticipantsRow>;

  // ─────────────────────────────────────────────
  // ✅ Remove participant
  // ─────────────────────────────────────────────
  removeParticipant(conversationId: string,userId: string): Promise<boolean>;

  // ─────────────────────────────────────────────
  // ✅ Get all userIds in a conversation
  // (useful for chat broadcast / notifications)
  // ─────────────────────────────────────────────
  getConversationParticipants(conversationId: string): Promise<string[]>;

  // ─────────────────────────────────────────────
  // ✅ Get paginated participants (with filters)
  // ─────────────────────────────────────────────
  getAllConversationParticipants(
    conversationId: string,
    userId: string,
    limit: number,
    page: number
  ): Promise<PaginatedResponse<ParticipantsRow>>;

  // ─────────────────────────────────────────────
  // ✅ Get single participant
  // ─────────────────────────────────────────────
  getParticipant(conversationId: string,userId: string): Promise<ParticipantsRow | null>;

  // ─────────────────────────────────────────────
  // ✅ Update participant (role / last read)
  // ─────────────────────────────────────────────
  updateParticipant(data: Partial<ParticipantsRow>): Promise<ParticipantsRow>;

  // ─────────────────────────────────────────────
  // ✅ Promote / Demote helper
  // ─────────────────────────────────────────────
  updateRole(
    conversationId: string,
    userId: string,
    role: "admin" | "member"
  ): Promise<boolean>;

  // ─────────────────────────────────────────────
  // ✅ Mark last read message
  // ─────────────────────────────────────────────
  markAsRead(conversationId: string,userId: string,messageId: string): Promise<boolean>;

  // ─────────────────────────────────────────────
  // ✅ Check if user exists in conversation
  // ─────────────────────────────────────────────
  isParticipant(conversationId: string,userId: string): Promise<boolean>;
}