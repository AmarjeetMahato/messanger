import { CreateParticipantDto, ParticipantResponseDto, UpdateParticipantDto } from "../dtos/participantsDto";
import { PaginatedResponse } from "../repository/participants.Repository.interface";

export interface IParticipantsService {

  // ─────────────────────────────────────────────
  // ✅ Add user to conversation
  // ─────────────────────────────────────────────
  addParticipant(data: CreateParticipantDto): Promise<ParticipantResponseDto>;

  // ─────────────────────────────────────────────
  // ✅ Remove user from conversation
  // ─────────────────────────────────────────────
  removeParticipant(conversationId: string,userId: string): Promise<boolean>;

  // ─────────────────────────────────────────────
  // ✅ Get all participants (pagination + filters)
  // ─────────────────────────────────────────────
  getParticipants(
    query: {
      conversationId?: string;
      userId?: string;
      page?: number;
      limit?: number;
    }
  ): Promise<PaginatedResponse<ParticipantResponseDto>>;

  // ─────────────────────────────────────────────
  // ✅ Get single participant
  // ─────────────────────────────────────────────
  getParticipantById(conversationId: string,userId: string): Promise<ParticipantResponseDto>;

  // ─────────────────────────────────────────────
  // ✅ Update participant (role / lastReadMessageId)
  // ─────────────────────────────────────────────
  updateParticipant(conversationId: string,userId: string,data: UpdateParticipantDto): Promise<ParticipantResponseDto>;

  // ─────────────────────────────────────────────
  // ✅ Promote to admin
  // ─────────────────────────────────────────────
  promoteToAdmin(conversationId: string, userId: string): Promise<boolean>;

  // ─────────────────────────────────────────────
  // ✅ Demote to member
  // ─────────────────────────────────────────────
  demoteToMember(conversationId: string,userId: string): Promise<boolean>;

  // ─────────────────────────────────────────────
  // ✅ Mark message as read
  // ─────────────────────────────────────────────
  markAsRead(conversationId: string,userId: string,messageId: string): Promise<boolean>;
}