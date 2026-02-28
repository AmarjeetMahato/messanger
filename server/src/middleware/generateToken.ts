// utils/jwt.ts
import * as jwt from "jsonwebtoken";
import { AccessTokenPayload, RefreshTokenPayload } from "../@types/jwt.types";
import { SignOptions } from "jsonwebtoken";

const accessSecret = process.env.JWT_ACCESS_SECRET!;
const refreshSecret = process.env.JWT_REFRESH_SECRET!;

if (!accessSecret || !refreshSecret) {
  throw new Error("JWT secrets are not defined in environment variables");
}

/**
 * Generate Access Token
 */
export const generateAccessToken = (payload: AccessTokenPayload): string => {
  return jwt.sign(payload, accessSecret, {
    expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
    issuer: "messanger",
    audience: "All",
  } as SignOptions); // Add this cast here
};

/**
 * Generate Refresh Token
 */
export const generateRefreshToken = (payload: RefreshTokenPayload): string => {
  return jwt.sign(payload, refreshSecret, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
    issuer: "your-app-name",
    audience: "All",
  } as SignOptions);
};

/**
 * Generate Both Tokens
 */
export const generateTokens = (userId: string, email: string) => {
  const accessToken = generateAccessToken({ userId, email });
  const refreshToken = generateRefreshToken({ userId });

  return {
    accessToken,
    refreshToken,
  };
};