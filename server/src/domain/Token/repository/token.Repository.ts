import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../../helpers/tokens";
import {type DbOrTx } from "../../../config/database";
import { CreateTokenInput } from "../dtos/tokenDto";
import { tokens } from "../../../config/schema/Token.model";
import { eq, ne, and, isNull } from "drizzle-orm"; 


@injectable()
export class TokenRepository{
   constructor(@inject(TOKENS.DB) private db:DbOrTx){}

   async createToken(data:CreateTokenInput){

      const [result] = await this.db.insert(tokens).values({
        tokenHash: data.tokenHash,
        type: data.type,
        userId: data.userId,
        otpGeneratedAt: data.otpGeneratedAt ?? new Date(),
        otpExpiresAt: data.otpExpiresAt ?? new Date(Date.now() + 1000 * 60 * 60), // 1 hour default
        lastOtpRequestedAt: data.lastOtpRequestedAt ?? new Date(),
        validatedAt: null, // always null when creating
      }).returning()
 
      return result;
   }

   async fetchOTPwithUserId(userId:string){
          const [otp] = await this.db.select().from(tokens)
                                    .where(eq(tokens.userId,userId))
                                    .limit(1);
           return otp;                         
   }

   async markedTokenValidate(tokenId:string){
        const [result] = await this.db.update(tokens)
        .set({validatedAt: new Date()})
        .where(eq(tokens.tokenId, tokenId))
        .returning()
     return result;   
   }

        // Invalidate other tokens (optional cleanup)
     async invalidateOtherTokens(userId: string, type: string, excludeTokenId: string) {
       const [result] = await this.db
    .update(tokens)
    .set({ validatedAt: new Date() })
    .where(
      and(
        eq(tokens.userId, userId),
        eq(tokens.type, type),
        ne(tokens.tokenId, excludeTokenId),
        isNull(tokens.validatedAt) // must import isNull
      )
    )
    .returning();
    return result;
   }
}