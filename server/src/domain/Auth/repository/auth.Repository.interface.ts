import { UserRow } from "../../../config/schema/User.model";
import { AuthEntity } from "../entity/authEntity";


export interface IAuthRepository{

     createUser(row: UserRow):Promise<UserRow>;
    
}