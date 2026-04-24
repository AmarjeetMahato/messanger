import { promises } from "dns";
import { CreateUserSchemaDto, RegisterResponseDto } from "../dtos/authDto";
import { UUID } from "crypto";


export interface IAuthService {

     createUser( data:CreateUserSchemaDto,roleId:UUID):Promise<RegisterResponseDto>

     verificationEmailWithToken(userId:string,Otp: string):Promise<void>;
}