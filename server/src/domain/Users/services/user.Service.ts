import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../../helpers/tokens";
import { UserRepositoy } from "../repository/user.Repository";
import { BadRequestException, InternalServerException } from "../../../utils/Catch-error";

@injectable()
export class UserService {
    
    constructor(@inject(TOKENS.UserRepositoy) private repo:UserRepositoy){}

    async markedUserVerify(userId:string){
               if(!userId){
                  throw new BadRequestException("UserId is required"); 
               }

               const result = await this.repo.markUserVerified(userId);
               if(!result?.id){
                 throw new InternalServerException("Failed to verify User");
               }
               return
    }
}