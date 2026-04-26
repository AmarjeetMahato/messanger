import { UUID } from "crypto";
import { UserRow } from "../../../config/schema/User.model";

export type PaginatedUsersResponse = {
  data: UserRow[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export interface IUserRepository {
         
    markUserVerified(userId:string):Promise<boolean>;

    getUserById(userId:string):Promise<UserRow | null>;

    getAllUsers(limit: number,page:number):Promise<PaginatedUsersResponse>;
    
}