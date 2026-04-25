export class MessageEntity {
  constructor(
    public readonly id: string,
    public readonly conversationId: string,
    public readonly senderId: string,

    public content: string | null,

    public type: "text" | "image" | "video" | "file",
    public status: "sent" | "delivered" | "read",

    public editedAt: Date | null,
    public deletedAt: Date | null,

    public readonly createdAt: Date
  ) {}

  // 🔹 Business logic methods

  markAsDelivered() {
    this.status = "delivered";
  }

  markAsRead() {
    this.status = "read";
  }

  editContent(newContent: string) {
    this.content = newContent;
    this.editedAt = new Date();
  }

  softDelete() {
    this.deletedAt = new Date();
  }

  isDeleted(): boolean {
    return this.deletedAt !== null;
  }
}