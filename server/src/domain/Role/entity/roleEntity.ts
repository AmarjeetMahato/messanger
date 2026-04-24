

export class RoleEntity {

  constructor(
    public readonly roleId: string,
    public name: string,

    public readonly createdDate: Date,
    public lastModifiedDate: Date | null
  ) {}

  // ─────────────────────────────────────
  // 🧠 Domain Logic (optional but useful)
  // ─────────────────────────────────────

  updateName(newName: string) {
    if (!newName || newName.trim().length === 0) {
      throw new Error("Role name cannot be empty");
    }

    this.name = newName;
    this.lastModifiedDate = new Date();
  }
}