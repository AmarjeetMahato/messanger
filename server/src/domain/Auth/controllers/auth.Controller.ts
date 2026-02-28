import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../../helpers/tokens";
import { AuthService } from "../services/auth.Service";
import { NextFunction,Response, Request } from "express";
import { createUserSchema, loginSchema, userIdSchema } from "../dtos/authDto";
import { HTTPSTATUS } from "../../../utils/https.config";


@injectable()
export class  AuthControllers {

    constructor(@inject(TOKENS.AuthService) private service: AuthService){}


    createUser = async (req:Request, res:Response, next:NextFunction) :Promise<void> => {
               const parsed = createUserSchema.safeParse(req.body);
               if(!parsed.success){
                res.status(400).json({message:"Invalid fields"})
                return;
               }
           try {
                  await this.service.createUser(parsed.data);
                  res.status(HTTPSTATUS.ACCEPTED).json({
                      message:"A verification email send to your email",
                      success:true,
                  })
           } catch (error) {
             console.log(error);
              next(error);
           }
    }

    loginUser = async (req:Request, res:Response, next:NextFunction) :Promise<void> => {
                    const parsed = loginSchema.safeParse(req.body);
               if(!parsed.success){
                res.status(400).json({message:"Invalid fields"})
                return;
               }
           try {
                  const result = await this.service.loginUser(parsed.data,req,res);
                  res.status(HTTPSTATUS.ACCEPTED).json({
                      message:"A verification email send to your email",
                      success:true,
                  })
           } catch (error) {
             console.log(error);
              next(error);
           }
    }

    verificationEmailWithOTP  = async (req:Request, res:Response, next:NextFunction) :Promise<void> => {
                try {
                    
                } catch (error) {
                     next(error)
                }
    }  

    getMe =  async (req:Request, res:Response, next:NextFunction) :Promise<void> => {
                 const result = userIdSchema.safeParse(req.params);
                 if(!result.success){
              res.status(400).json({
                             message: "Invalid user id",
                             errors: result.error
                                      });
                             return}
           try {
                  const  user = await this.service.fetchUser(result.data.id);
                  res.status(HTTPSTATUS.OK).json({
                      message:"A verification email send to your email",
                      success:true,
                      user
                  })
           } catch (error) {
             next(error)
           }
    }

    logoutUser = async (req:Request, res:Response, next:NextFunction) :Promise<void> => {
          try {
            
          } catch (error) {
             console.log(error);
             
          }
    }





    
}