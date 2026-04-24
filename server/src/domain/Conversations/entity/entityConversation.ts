export type ConversationType = "direct" | "group";

export class EntityConversation {
  constructor(
    public readonly id: string,

    public type: ConversationType,
    public title: string | null,

    public createdBy: string,
    public lastMessageId: string | null,

    public readonly createdAt: Date,
    public updatedAt: Date
  ) {}

  // ─────────────────────────────────────────────
  // ✅ Domain Logic (important)
  // ─────────────────────────────────────────────

  isGroup(): boolean {
    return this.type === "group";
  }

  isDirect(): boolean {
    return this.type === "direct";
  }

  updateLastMessage(messageId: string): void {
    this.lastMessageId = messageId;
    this.touch();
  }

  updateTitle(title: string): void {
    if (!this.isGroup()) {
      throw new Error("Only group conversations can have a title");
    }
    this.title = title;
    this.touch();
  }

  private touch(): void {
    this.updatedAt = new Date();
  }
}