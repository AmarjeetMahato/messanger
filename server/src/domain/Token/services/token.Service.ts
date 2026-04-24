import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../../helpers/tokens";
import { TokenRepository } from "../repository/token.Repository";
import { CreateTokenInput, TokenResponseDto } from "../dtos/tokenDto";
import { BadRequestException, ConflictExceptions, InternalServerException, NotFoundExceptions } from "../../../utils/Catch-error";
import { ITokenService } from "./token.Service.Interface";
import { UUID } from "crypto";
import { TokenMapper } from "../mapper/tokenMapper";
import type { ITokenRepository } from "../repository/token.Repository.Interface";
import { TokenRow } from "../../../config/schema/Token.model";
import { TokenType } from "../entity/tokenEntity";

@injectable()
export class TokenService implements ITokenService{
   
     constructor(@inject(TOKENS.TokenRepository) private  repo:ITokenRepository){}

     async createToken(tokenData:CreateTokenInput):Promise<TokenResponseDto>{
            if(!tokenData){
                  throw new BadRequestException("token Data is required !!");    
            }
            const token  = await this.repo.fetchOTPwithUserId(tokenData.userId as UUID)
            if(token?.tokenId){
                  throw new ConflictExceptions("Token already created with userId")
            }
            const createTokenEntity = TokenMapper.toCreateEntity({...tokenData})

            const Persistence  =  TokenMapper.toInsert(createTokenEntity)

            const createToken =   await this.repo.createToken(Persistence);

            const entity = TokenMapper.toEntity(createToken)

            return TokenMapper.toResponse(entity);
     }

     async fetchOtp(userId:string) :Promise<TokenResponseDto>{

          if(!userId){
                throw new BadRequestException("User is required")
          }

          const result = await this.repo.fetchOTPwithUserId(userId as UUID);
          if(!result?.tokenId){
                 throw new NotFoundExceptions("OTP not found or already used");    
          }
        
           const entity = TokenMapper.toEntity(result)

             // ─────────────────────────────
  // 4. Check expiry
  // ─────────────────────────────
  if (entity.isExpired()) {
    throw new BadRequestException("OTP has expired");
  }

  // ─────────────────────────────
  // 5. Optional: check if already validated
  // ─────────────────────────────
  if (entity.isValidated()) {
    throw new BadRequestException("OTP already used");
  }

      return TokenMapper.toResponse(entity);
     }

     async markTokenValidated(tokenId: UUID): Promise<boolean> {

  if (!tokenId) {
    throw new BadRequestException("TokenId is required");
  }

  const result = await this.repo.markedTokenValidate(tokenId);

  if (!result) {
    throw new InternalServerException("Failed to validate the token");
  }

  return result
}

     async invalidateToken(userId:string, type:TokenType,tokenId:string): Promise<TokenResponseDto>{
                 
         const  result = await this.repo.invalidateOtherTokens(userId,type,tokenId);
         if(!result?.tokenId){
             throw new InternalServerException("Failed to invalidate OTP")
         }
         const entity  = TokenMapper.toEntity(result);
         return TokenMapper.toResponse(entity)
     }


}