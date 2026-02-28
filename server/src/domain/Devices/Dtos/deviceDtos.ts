import { z } from 'zod';

// Shared pieces to avoid repetition
const deviceBase = {
  deviceName: z.string().max(100).nullable(),
  deviceType: z.enum(["mobile", "desktop", "tablet"]),
  platform: z.enum(["ios", "android", "windows", "macos", "linux"]),
  osVersion: z.string().max(20).nullable(),
  browser: z.string().max(50).nullable(),
  ipAddress: z.string().nullable(),
  userAgent: z.string().nullable(),
  pushToken: z.string().nullable(),
  isTrusted: z.boolean().default(false),
  timezone: z.string().nullable()
};

/**
 * Schema for Creating a Device
 */
export const createDeviceZodSchema = z.object({
  // CHANGED: Must be a string and valid UUID to match users.id
  userId: z.uuid(), // references users.id
  refreshToken: z.string().min(1),
  ...deviceBase,
});

/**
 * Schema for Updating a Device
 */
export const updateDeviceZodSchema = createDeviceZodSchema.partial();

// Types for your TypeScript code
export type CreateDeviceInput = z.infer<typeof createDeviceZodSchema>;
export type UpdateDeviceInput = z.infer<typeof updateDeviceZodSchema>;