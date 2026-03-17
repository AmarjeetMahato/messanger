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

    async getUserByuserId(userId:string){
               if(!userId){
                  throw  new BadRequestException("User Id should not be null");
               }
               const result = await this.repo.getUserById(userId);
               if(!result?.id){
                 throw new InternalServerException("Failed to fetch User");
               }
               return result;
    }

    async getAllUsers(limit:number, page:number){
         if(!limit || !page || page < 1){
           throw new BadRequestException("limit and page should not be empty");
         }
         const allUsers = await this.repo.getAllUsers(limit, page)
         if(!allUsers?.data){
            throw new InternalServerException("Failed to fetch users")
         }
         return allUsers;
    }
}