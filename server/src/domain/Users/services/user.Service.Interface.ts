import { UserResponseDto } from "../dtos/userDtos";


export interface IUserService {

     markedUserVerify(userId:string):Promise<boolean>;

     getUserByuserId(userId:string): Promise<UserResponseDto>

     getAllUsers(limit:number, page:number):Promise<UserResponseDto[]>
}