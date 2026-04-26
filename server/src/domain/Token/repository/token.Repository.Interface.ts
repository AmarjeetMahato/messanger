import { UUID } from "crypto";
import { TokenRow } from "../../../config/schema/Token.model";
import { TokenType } from "../entity/tokenEntity";

export interface ITokenRepository {

    createToken(data:TokenRow): Promise<TokenRow>;

    fetchOTPwithUserId(userId:string):Promise<TokenRow | null >

    markedTokenValidate(tokenId:string):Promise<boolean>;

      invalidateOtherTokens(userId: string,type: TokenType,excludeTokenId: string): Promise<TokenRow | null>;

}