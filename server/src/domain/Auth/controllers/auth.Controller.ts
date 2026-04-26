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
               const userData = {
                               ...parsed.data,
                               roleName: parsed.data.roleName ?? "USER", // ✅ default role
                             };
           try {
                  await this.service.createUser(userData);
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
                    console.log(req.body);
                    
                    const parsed = loginSchema.safeParse(req.body);
               if(!parsed.success){
                res.status(400).json({message:"Invalid fields"})
                return;
               }
           try {
                  const result = await this.service.loginUser(parsed.data,req,res);
                  res.status(HTTPSTATUS.OK).json({
                      message:"User Logged in Successfully",
                      success:true,
                  })
           } catch (error) {
             console.log(error);
              next(error);
           }
    }

    verificationEmailWithOTP  = async (req:Request, res:Response, next:NextFunction) :Promise<void> => {
                try {
                        const otp = req.body;
                        const {userId} = req.params;
                        await this.service.verificationEmailWithToken("userId",otp,req);
                         res.status(HTTPSTATUS.CREATED).json({
                              message:"Email verified successfully",
                              success:true
                         })
                } catch (error) {
                     next(error)
                }
    }  

    getMe =  async (req:Request, res:Response, next:NextFunction) :Promise<void> => {
                 const userId = req.userId

                 console.log("userId ", userId);
                 
                  if(typeof userId != "string"){
                res.status(HTTPSTATUS.BAD_REQUEST).json({
                     message:"UserId must be valid string",
                     success:false
                })
                return;
               }
           try {
                  const  user = await this.service.fetchUser(userId);
                  res.status(HTTPSTATUS.OK).json({
                      message:"user fetch successfully",
                      success:true,
                      data:user
                  })
           } catch (error) {
             next(error)
           }
    }

    logoutUser = async (req:Request, res:Response, next:NextFunction) :Promise<void> => {
          try {
                await this.service.logoutuser(res);
                res.status(HTTPSTATUS.OK).json({
                     message:"User logout successfully",
                     success:true
                })
          } catch (error) {
             console.log(error);
             next(error);
          }
    }





    
}