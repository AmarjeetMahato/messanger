import { CreateTokenInput, TokenResponseDto } from "../dtos/tokenDto";
import { TokenType } from "../entity/tokenEntity";

export interface ITokenService{
   
 
    createToken(tokenData:CreateTokenInput): Promise<TokenResponseDto>;

      fetchOtp(userId:string):Promise<TokenResponseDto>

      markTokenValidated(tokenId:string):Promise<boolean>

      invalidateToken(userId:string, type:TokenType,tokenId:string):Promise<TokenResponseDto>

}