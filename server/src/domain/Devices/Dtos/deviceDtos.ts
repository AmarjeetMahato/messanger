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


export type DeviceFilterDTO = {
  userId?: string;
  deviceType?: DeviceType;
  platform?: Platform;
  isTrusted?: boolean;
};

// --- Enums (Reusable) ---
export const DeviceTypeEnum = z.enum(["mobile", "desktop", "tablet", "web", "smarttv"]);
export const PlatformEnum = z.enum(["ios", "android", "windows", "macos", "linux", "browser"]);

export const deviceUserResponseSchema = z.object({
  id: z.uuid(),
  userId: z.uuid(),

  // System Info
  deviceName: z.string().nullable(),
  deviceType: DeviceTypeEnum,
  platform: PlatformEnum,
  osVersion: z.string().nullable(),
  browser: z.string().nullable(),

  // Optional (safe enough)
  ipAddress: z.string().nullable(),

  // DO NOT expose these
  // userAgent ❌
  // pushToken ❌

  isTrusted: z.boolean(),
  timezone: z.string().nullable(),

  lastActive: z.date().or(z.string()),
  createdAt: z.date().or(z.string()),
});


export const deviceAdminResponseSchema = z.object({
  id: z.uuid(),
  userId: z.uuid(),

  deviceName: z.string().nullable(),
  deviceType: DeviceTypeEnum,
  platform: PlatformEnum,
  osVersion: z.string().nullable(),
  browser: z.string().nullable(),

  ipAddress: z.string().nullable(),
  userAgent: z.string().nullable(),   // ✅ admin only
  pushToken: z.string().nullable(),   // ✅ admin only

  isTrusted: z.boolean(),
  timezone: z.string().nullable(),

  lastActive: z.date().or(z.string()),
  createdAt: z.date().or(z.string()),
});

type Platform = z.infer<typeof PlatformEnum>;
type DeviceType = z.infer<typeof DeviceTypeEnum>;
/**
 * Schema for Updating a Device
 */
export const updateDeviceZodSchema = createDeviceZodSchema.partial();
// Type for your frontend/client
export type DeviceUserResponse = z.infer<typeof deviceUserResponseSchema>;
export type DeviceAdminResponse = z.infer<typeof deviceAdminResponseSchema>;
// Types for your TypeScript code
export type CreateDeviceInput = z.infer<typeof createDeviceZodSchema>;
export type UpdateDeviceInput = z.infer<typeof updateDeviceZodSchema>;