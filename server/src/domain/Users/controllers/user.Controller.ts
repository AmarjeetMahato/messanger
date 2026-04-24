import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../../helpers/tokens";
import { Request,Response, NextFunction } from "express";
import { UserService } from "../services/user.Service";
import { HTTPSTATUS } from "../../../utils/https.config";
import {userIdSchemaDto} from "../dtos/userDtos"
import { UUID } from "crypto";

@injectable()
export class UserController {

    constructor(@inject(TOKENS.UserService) private service:UserService){}

    fetchuserById = async (req:Request, res:Response, next:NextFunction):Promise<void> => {
               const {userId} = req.params
         try {
               const result = await this.service.getUserByuserId(userId as UUID);
               res.status(HTTPSTATUS.OK).json({
                  message:"User fetch successfully",
                  success:true,
                  data:result
               })
         } catch (error) {
           console.log(error);
           next(error); 
         }
    }


    fetchAllusers = async (req:Request, res:Response, next:NextFunction):Promise<void> => {
                 
                   const limit = Number(req.query.limit) || 20;
                   const page  = Number(req.query.page) || 1;

                 
       try {
               const allUsers = await this.service.getAllUsers(limit,page)
               res.status(HTTPSTATUS.OK).json({
                  message:"User fetch successfully",
                  success:true,
                  data:allUsers  
               })
       } catch (error) {
            console.log(error);
            next(error)
            
       }
    }
}