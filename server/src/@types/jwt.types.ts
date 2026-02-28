// types/jwt.types.ts
export interface AccessTokenPayload {
  userId: string;
  email: string;
  roles?: string[];
}

export interface RefreshTokenPayload {
  userId: string;
}