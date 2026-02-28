import { z } from "zod";

export const tokenTypeEnum = z.enum([
  "email_verification",
  "password_reset",
  "device_verification",
  "otp",
]);

export const createTokenSchema = z.object({
  tokenHash: z.string().min(64), // sha256 hex length
  type: tokenTypeEnum,
  userId: z.uuid(),
  otpGeneratedAt: z.date().optional(),
  otpExpiresAt: z.date().optional(),
  lastOtpRequestedAt: z.date().optional(),

  validatedAt: z.date().nullable().optional(),
});

export type CreateTokenInput = z.infer<typeof createTokenSchema>;