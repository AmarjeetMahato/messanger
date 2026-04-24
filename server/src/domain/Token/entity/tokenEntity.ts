import { UUID } from "crypto";

export type TokenType =
  | "email_verification"
  | "password_reset"
  | "device_verification"
  | "otp";

export class TokenEntity {

  constructor(
    public readonly tokenId: string,
    public tokenHash: string,
    public type: TokenType,

    public otpGeneratedAt: Date | null,
    public otpExpiresAt: Date | null,

    public lastOtpRequestedAt: Date | null,
    public validatedAt: Date | null,

    public userId: string,

    public readonly createdAt: Date
  ) {}

  // ─────────────────────────────────────
  // 🔐 Domain logic
  // ─────────────────────────────────────

  isExpired(): boolean {
    if (!this.otpExpiresAt) return false;
    return new Date() > this.otpExpiresAt;
  }

  isValidated(): boolean {
    return this.validatedAt !== null;
  }

  markValidated(): void {
    this.validatedAt = new Date();
  }

  canRequestNewOtp(): boolean {
    if (!this.lastOtpRequestedAt) return true;

    const diff = Date.now() - this.lastOtpRequestedAt.getTime();
    return diff > 60 * 1000; // 1 min cooldown
  }
}