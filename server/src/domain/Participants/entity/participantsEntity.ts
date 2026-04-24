export type UUID = string;

export type ParticipantRole = "admin" | "member";

export class ParticipantsEntity {

  constructor(
    public readonly conversationId: UUID,
    public readonly userId: UUID,

    public role: ParticipantRole,

    public joinedAt: Date,
    public lastReadMessageId: UUID | null
  ) {}

  // ─────────────────────────────────────
  // 🧠 Domain logic
  // ─────────────────────────────────────

  isAdmin(): boolean {
    return this.role === "admin";
  }

  promoteToAdmin(): void {
    this.role = "admin";
  }

  demoteToMember(): void {
    this.role = "member";
  }

  markMessageAsRead(messageId: UUID): void {
    this.lastReadMessageId = messageId;
  }
}