import { z } from "zod";

export const tokenTypeEnum = z.enum([
  "email_verification",
  "password_reset",
  "device_verification",
  "otp",
]);

export const createTokenSchema = z.object({
  tokenId: z.uuid().optional(),
  tokenHash: z.string().min(64), // sha256 hex length
  type: tokenTypeEnum,
  userId: z.uuid(),
  otpGeneratedAt: z.date().optional(),
  otpExpiresAt: z.date().optional(),
  lastOtpRequestedAt: z.date().optional(),

  validatedAt: z.date().nullable().optional(),
});

export const updateTokenSchema = z.object({
  tokenId: z.uuid().optional(),
  tokenHash: z.string().min(64).optional(), // sha256 hex length
  type: tokenTypeEnum.optional(),
  userId: z.uuid().optional(),
  otpGeneratedAt: z.date().optional(),
  otpExpiresAt: z.date().optional(),
  lastOtpRequestedAt: z.date().optional(),

  validatedAt: z.date().nullable().optional(),
});


export const tokenResponseSchema = z.object({
  tokenId: z.uuid().optional(),

  type: z.enum([
    "email_verification",
    "password_reset",
    "device_verification",
    "otp",
  ]),

  userId: z.uuid(),
  tokenHash: z.string(),
  otpGeneratedAt: z.date().nullable().optional(),
  otpExpiresAt: z.date().nullable().optional(),
  lastOtpRequestedAt: z.date().nullable().optional(),

  validatedAt: z.date().nullable().optional(),
});


export type CreateTokenInput = z.infer<typeof createTokenSchema>;
export type UpdateTokenInput = z.infer<typeof updateTokenSchema>;
export type TokenResponseDto = z.infer<typeof tokenResponseSchema>;