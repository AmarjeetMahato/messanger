import { UUID } from "crypto";
import { TokenRow } from "../../../config/schema/Token.model";
import { TokenType } from "../entity/tokenEntity";
import { UpdateTokenInput } from "../dtos/tokenDto";

export interface ITokenRepository {
  createToken(data: TokenRow): Promise<TokenRow>;

  fetchOTPwithUserId(userId: string, type: TokenType): Promise<TokenRow | null>;

  fetchTokenById(tokenId: string): Promise<TokenRow | null>;

  markedTokenValidate(tokenId: string): Promise<boolean>;

  updateToken(tokenId: string, data: UpdateTokenInput): Promise<void>;

  invalidateOtherTokens(
    userId: string,
    type: TokenType,
    excludeTokenId: string,
  ): Promise<TokenRow | null>;
}
