import { Request } from "express";
import { AccessTokenPayload } from "./@types/jwt.types";

declare module "express-serve-static-core" {
  interface Request {
    userId?: string; // or uuid type if you prefer
    user?: AccessTokenPayload
  }
}