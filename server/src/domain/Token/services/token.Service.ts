import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../../helpers/tokens";
import { TokenRepository } from "../repository/token.Repository";
import { CreateTokenInput } from "../dtos/tokenDto";
import { BadRequestException, InternalServerException } from "../../../utils/Catch-error";

@injectable()
export class TokenService{
   
     constructor(@inject(TOKENS.TokenRepository) private  repo:TokenRepository){}

     async createToken(tokenData:CreateTokenInput){
            if(!tokenData){
                  throw new BadRequestException("token Data is required !!");    
            }

            const token = await this.repo.createToken(tokenData);
            if(!token?.tokenId){
                 throw new InternalServerException("Failed to create Token !!");  
            }
            return token;
     }

     async fetchOtp(userId:string){
          if(userId){
                throw new BadRequestException("User is required")
          }
          const result = await this.repo.fetchOTPwithUserId(userId);
          if(!result?.tokenId){
                 throw new InternalServerException("Failed to fetch Otp");    
          }
           return result;
     }

     async markTokenValidated(tokenId:string){
              if(!tokenId){
                 throw new BadRequestException("UserId is required")
              }
              const result = await this.repo.markedTokenValidate(tokenId);
              if(!result?.tokenId){
                  throw new InternalServerException("Failed to validated the token");
              }
              return result
     }

     async invalidateToken(userId:string, type:string,tokenId:string){
                 
         const  result = await this.repo.invalidateOtherTokens(userId,type,tokenId);
         if(!result?.tokenId){
             throw new InternalServerException("Failed to invalidate OTP")
         }
         return result;
     }


}