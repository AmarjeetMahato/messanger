import {
  CreateTokenInput,
  TokenResponseDto,
  UpdateTokenInput,
} from "../dtos/tokenDto";
import { TokenType } from "../entity/tokenEntity";

export interface ITokenService {
  createToken(tokenData: CreateTokenInput): Promise<TokenResponseDto>;

  fetchOtp(userId: string, type: TokenType): Promise<TokenResponseDto>;

  markTokenValidated(tokenId: string): Promise<boolean>;

  updateToken(tokenId: string, data: UpdateTokenInput): Promise<void>;

  invalidateToken(
    userId: string,
    type: TokenType,
    tokenId: string,
  ): Promise<TokenResponseDto>;
}
