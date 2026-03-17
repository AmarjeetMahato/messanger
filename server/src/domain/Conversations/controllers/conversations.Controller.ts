import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../../helpers/tokens";
import { ConversationServices } from "../services/conversation.Service";
import {Request,Response, NextFunction } from "express";
import { CreateDirectConversationSchema } from "../dtos/conversationDto";
import { HTTPSTATUS } from "../../../utils/https.config";
import { userIdSchema } from "../../Auth/dtos/authDto";


@injectable()
export class ConversationsController{
    constructor(@inject(TOKENS.ConversationServices) private service:ConversationServices){}


    createConversation = async (req:Request, res:Response, next:NextFunction):Promise<void> => {
                 const parsed = CreateDirectConversationSchema.safeParse(req.body);
                if(!parsed.success){
                    res.status(HTTPSTATUS.BAD_REQUEST).json({
                         message:"Invalid fields",
                         success:false
                    })
                    return;
                }
                const userId = req?.userId;
                if(!userId){
                  res.status(400).json({
                             message: "Invalid user id",
                             success: false
                      });
                     return
                    }

                try {     
                    const receiverId = parsed.data.receiverId;
                    const result = await this.service.createDirectConversation( 
                             userId,
                             receiverId);
                     res.status(HTTPSTATUS.CREATED).json({
                         message:"conversation created",
                         success:true,
                         data:result
                     })
                } catch (error) {
                    console.log(error);
                    next(error);  
                }
    }

    fetchConversationById = async (req:Request, res:Response, next:NextFunction):Promise<void> => {
                      const {convoId} = req.params;
                         if(typeof convoId != "string"){
                res.status(HTTPSTATUS.BAD_REQUEST).json({
                     message:"UserId must be valid string",
                     success:false
                })
                return;
               }
                      try {
                          const result = await this.service.getConversationById(convoId);
                          res.status(HTTPSTATUS.OK).json({
                              message:"conversation fetch by successfully",
                              success:true,
                              data:result

                          })
                      } catch (error) {
                          console.log(error);
                          next(error);
                          
                      }
    }

    // GET /api/conversations
    fetchConversationbyUserid = async (req:Request, res:Response, next:NextFunction):Promise<void> =>{
            const userId = req.userId;
              if(typeof userId != "string"){
                res.status(HTTPSTATUS.BAD_REQUEST).json({
                     message:"UserId must be valid string",
                     success:false
                })
                return;
               }
            try {
                  const result = await this.service.fetchConversationbyUserId(userId);
                  res.status(HTTPSTATUS.OK).json({
                              message:"conversation fetch with userId  successfully",
                              success:true,
                              data:result

                          })
            } catch (error) {
                console.log(error);
                next(error)
                
            }
    }

 getSidebarConversations=async (req:Request, res:Response, next:NextFunction):Promise<void>=> {
  const userId = req.userId;
   if(typeof userId != "string"){
                res.status(HTTPSTATUS.BAD_REQUEST).json({
                     message:"UserId must be valid string",
                     success:false
                })
                return;
               }
  try {
     const result = await this.service.getSidebarConversations(userId);
  res.status(200).json({
    success: true,
    message: "Sidebar conversations fetched",
    data: result,
  });
  } catch (error) {
      console.log(error);
      next(error)
      
  }

}

}