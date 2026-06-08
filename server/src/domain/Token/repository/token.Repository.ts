import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../../helpers/tokens";
import { type DbOrTx } from "../../../config/database";
import { CreateTokenInput, UpdateTokenInput } from "../dtos/tokenDto";
import { TokenRow, tokens } from "../../../config/schema/Token.model";
import { eq, ne, and, isNull } from "drizzle-orm";
import { ITokenRepository } from "./token.Repository.Interface";
import { UUID } from "crypto";
import { InternalServerException } from "../../../utils/Catch-error";
import { token } from "morgan";
import { TokenType } from "../entity/tokenEntity";

@injectable()
export class TokenRepository implements ITokenRepository {
  constructor(@inject(TOKENS.DB) private db: DbOrTx) {}

  async createToken(data: TokenRow): Promise<TokenRow> {
    const [result] = await this.db.insert(tokens).values(data).returning();

    if (!result) {
      throw new InternalServerException("Failed to create token");
    }

    return result;
  }

  async fetchOTPwithUserId(
    userId: string,
    type: TokenType,
  ): Promise<TokenRow | null> {
    return await this.db
      .select()
      .from(tokens)
      .where(and(eq(tokens.userId, userId), eq(tokens.type, type)))
      .then((row) => row[0] || null);
  }

  async fetchTokenById(tokenId: string): Promise<TokenRow | null> {
    return await this.db
      .select()
      .from(tokens)
      .where(eq(tokens.tokenId, tokenId))
      .then((row) => row[0] || null);
  }

  async updateToken(tokenId: string, data: UpdateTokenInput): Promise<void> {
    await this.db
      .update(tokens)
      .set({
        tokenHash: data.tokenHash,
        otpGeneratedAt: data.otpGeneratedAt,
        otpExpiresAt: data.otpExpiresAt,
        lastOtpRequestedAt: data.lastOtpRequestedAt,
        validatedAt: data.validatedAt,
      })
      .where(eq(tokens.tokenId, tokenId));
  }

  async markedTokenValidate(tokenId: string): Promise<boolean> {
    const [result] = await this.db
      .update(tokens)
      .set({ validatedAt: new Date() })
      .where(eq(tokens.tokenId, tokenId))
      .returning();
    return !!result;
  }

  // Invalidate other tokens (optional cleanup)
  async invalidateOtherTokens(
    userId: string,
    type: string,
    excludeTokenId: string,
  ): Promise<TokenRow | null> {
    const [result] = await this.db
      .update(tokens)
      .set({ validatedAt: new Date() })
      .where(
        and(
          eq(tokens.userId, userId),
          eq(tokens.type, type),
          ne(tokens.tokenId, excludeTokenId),
          isNull(tokens.validatedAt), // must import isNull
        ),
      )
      .returning();

    if (!result) {
      throw new InternalServerException("Failed to create token");
    }

    return result;
  }
}
