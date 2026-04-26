import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../../helpers/tokens";
import { UserRepositoy } from "../repository/user.Repository";
import { BadRequestException, InternalServerException, NotFoundExceptions } from "../../../utils/Catch-error";
import { UserResponseDto } from "../dtos/userDtos";
import { IUserService } from "./user.Service.Interface";
import { UserMapper } from "../mapper/userMapper";
import { UUID } from "crypto";

@injectable()
export class UserService implements IUserService {
    
    constructor(@inject(TOKENS.UserRepositoy) private repo:UserRepositoy){}

    async markedUserVerify(userId: string): Promise<boolean> {
    if (!userId) {
          throw new BadRequestException("UserId is required");
  }
  const result = await this.repo.markUserVerified(userId);
  if (!result) {
    throw new InternalServerException("Failed to verify user");
  }
  return result
}

    async getUserByuserId(userId:UUID) : Promise<UserResponseDto>{
               if(!userId){
                  throw  new BadRequestException("User Id should not be null");
               }
               const result = await this.repo.getUserById(userId);
               if(!result?.id){
                 throw new NotFoundExceptions("Failed to fetch User");
               }
               const userEntity = UserMapper.toEntity(result)
               return UserMapper.toResponse(userEntity)
    }

    async getAllUsers(limit:number, page:number) :Promise<UserResponseDto[]> {
         if(!limit || !page || page < 1){
           throw new BadRequestException("limit and page should not be empty");
         }
         const allUsers = await this.repo.getAllUsers(limit, page)
         if(allUsers?.data.length === 0){
             return []
         }
         const entityArray = UserMapper.toEntityArray(allUsers.data)
         return UserMapper.toResponseDtoArray(entityArray)
    }
}