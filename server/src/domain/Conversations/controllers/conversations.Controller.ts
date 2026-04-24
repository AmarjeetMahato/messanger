import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../../helpers/tokens";
import {Request,Response, NextFunction } from "express";
import { HTTPSTATUS } from "../../../utils/https.config";
import type { IConversationService } from "../services/conversation.Service.Interface";


@injectable()
export class ConversationsController{
    constructor(@inject(TOKENS.ConversationServices) private service:IConversationService){}


    createConversation = async (req:Request, res:Response, next:NextFunction):Promise<void> => {
                
                const userId = req?.userId;
                try {     
                    const result = await this.service.createDirectConversationWithParticipants(req.body,userId!);
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
                      const {convoId} = req.params as {convoId: string}

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
    getUserConversationList = async (req:Request, res:Response, next:NextFunction):Promise<void> =>{
            const userId = req.userId;
            try {
                  const result = await this.service.getUserConversationList(userId!);
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

getUserConversationsWithDetails = async (req:Request, res:Response, next:NextFunction):Promise<void> => {
                              const userId = req.userId; 
         try {
                const result = await this.service.getUserConversationsWithDetails(userId!);
                res.status(HTTPSTATUS.OK).json({
                              message:"conversation with details successfully",
                              success:true,
                              data:result
                          })
         } catch (error) {
             next(error)
         }
    }

getSidebarConversations = async (req:Request, res:Response, next:NextFunction):Promise<void>=> {
  const userId = req.userId;

  try {
     const result = await this.service.getSidebarConversations(userId!);
     res.status(200).json({
       success: true,
       message: "Sidebar conversations fetched",
       data: result,
    });
  } catch (error) {
      console.log(error);
      next(error)  
  }}
}