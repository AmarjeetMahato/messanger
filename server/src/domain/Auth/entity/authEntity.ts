export class AuthEntity {
  constructor(
    public readonly id: string,
    public email: string,
    public passwordHash: string,
    public username: string,
    public fullName: string | null,
    public avatarUrl: string | null,
    public isVerified: boolean,
    public lastSeen: Date | null,

    // Security fields
    public isBlocked: boolean,
    public blockedUntil: Date | null,
    public failedLoginAttempts: number,

    public roleId: string,
    public mfaEnabled: boolean,

    public readonly createdAt: Date,
    public updatedAt: Date | null
  ) {}

  // ✅ Domain Logic Methods (VERY IMPORTANT)

  isAccountLocked(): boolean {
    if (this.isBlocked) return true;

    if (this.blockedUntil && this.blockedUntil > new Date()) {
      return true;
    }

    return false;
  }

  incrementFailedAttempts(): void {
    this.failedLoginAttempts += 1;
  }

  resetFailedAttempts(): void {
    this.failedLoginAttempts = 0;
  }

  blockAccount(durationMinutes: number): void {
    this.isBlocked = true;
    this.blockedUntil = new Date(Date.now() + durationMinutes * 60 * 1000);
  }

  unblockAccount(): void {
    this.isBlocked = false;
    this.blockedUntil = null;
    this.failedLoginAttempts = 0;
  }

  verifyAccount(): void {
    this.isVerified = true;
  }
}