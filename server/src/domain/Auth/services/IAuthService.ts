import { Request, Response } from "express";
import {
  CreateUserSchemaDto,
  LoginUserDto,
  RegisterResponseDto,
} from "../dtos/authDto";
import { UUID } from "crypto";

export interface IAuthService {
  createUser(
    data: CreateUserSchemaDto,
    res: Response,
  ): Promise<RegisterResponseDto>;

  verificationEmailWithToken(
    userId: string,
    Otp: string,
    req: Request,
  ): Promise<void>;

  loginUser(data: LoginUserDto, req: Request, res: Response): Promise<void>;
}
