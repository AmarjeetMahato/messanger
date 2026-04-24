import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../../helpers/tokens";
import { ParticipantsService } from "../services/participants.Services";
import {Request,Response,NextFunction} from "express"
import { HTTPSTATUS } from "../../../utils/https.config";
import type { IParticipantsService } from "../services/participants.service.interface";

@injectable()
export class ParticipantsController{

    constructor(@inject(TOKENS.ParticipantsService) private readonly service: IParticipantsService){}

    getAllConversationParticipants = async (req:Request,res:Response,next:NextFunction):Promise<void> =>{
            
                    const { conversationId } = req.params as { conversationId: string };
                    const userId = req.userId as string;
                    const limit = Number(req.query.limit) || 10;
                    const page = Number(req.query.page) || 1;
 
                  try {
                        const result = await this.service.getParticipants({conversationId,userId,limit,page});
                        res.status(HTTPSTATUS.OK).json({
                             success:true,
                             message:"Fetch update successfully",
                             data:result
                        })
                  } catch (error) {
                    console.log(error);
                    next(error)
                  }
    }

    addParticipant = async (req:Request,res:Response,next:NextFunction):Promise<void> => {
            
                  try {
                         const result = await this.service.addParticipant(req.body)
                         res.status(HTTPSTATUS.CREATED).json({
                             message:"Participant add successfully",
                             success: true,
                             data: result
                         })
                  } catch (error) {
                      next(error)
                  }
    }

    removeParticipant = async (req:Request,res:Response,next:NextFunction):Promise<void> => {
                        
                       const {conversationId}  = req.params as {conversationId:string}
                       const userId = req.userId
           
              try {
                         await this.service.removeParticipant(conversationId,userId!)
                         res.status(HTTPSTATUS.OK).json({
                             message:"Participant remove successfully",
                             success: true,
                         })
                  } catch (error) {
                      next(error)
                  }
    } 

    updateParticipant = async (req:Request,res:Response,next:NextFunction):Promise<void> => {
                         
                  try {
                              const {conversationId} = req.params as {conversationId:string}
                              const userId = req.userId
                         const result = await this.service.updateParticipant(conversationId,userId!, req.body)
                         res.status(HTTPSTATUS.CREATED).json({
                             message:"Participant add successfully",
                             success: true,
                             data: result
                         })
                  } catch (error) {
                      next(error)
                  }
    }

    getParticipantById = async (req:Request,res:Response,next:NextFunction):Promise<void> => {
                 
              try {
                       const {conversationId}  = req.params as {conversationId:string}
                       const userId = req.userId

                       const result = await this.service.getParticipantById(conversationId,userId!);
                       res.status(HTTPSTATUS.OK).json({
                          message:"Participant fetch successfully",
                          success:true,
                          data: result
                       })
              } catch (error) {
                  next(error)
              }
    }

    promoteToAdmin  = async (req:Request,res:Response,next:NextFunction): Promise<void> => {
                       const {conversationId}  = req.params as {conversationId:string}
                       const userId = req.userId
                            
                     try {
                              const result = await this.service.promoteToAdmin(conversationId, userId!);
                            res.status(HTTPSTATUS.OK).json({
                                message:"Promote to Admin successfully",
                                success:true,
                                data: result
                       })
                     } catch (error) {
                          next(error) 
                     }
      }

    demoteToMember = async (req:Request,res:Response,next:NextFunction): Promise<void> => {
                       const {conversationId}  = req.params as {conversationId:string}
                       const userId = req.userId
             try {
                      const result = await this.service.promoteToAdmin(conversationId, userId!);
                            res.status(HTTPSTATUS.OK).json({
                                message:"Demote to Member successfully",
                                success:true,
                                data: result
                       })
             } catch (error) {
                  next(error)
             }
    }

    markAsRead =  async (req:Request,res:Response,next:NextFunction): Promise<void> =>{

                       const {conversationId}  = req.params as {conversationId:string}
                       const {messageId} = req.params as {messageId: string}
                       const userId = req.userId
            try {
                      const result = await this.service.markAsRead(conversationId, userId!,messageId);
                      res.status(HTTPSTATUS.OK).json({
                                message:"Message mark as read successfully",
                                success:true,
                                data: result
                       })
            } catch (error) {
                  next(error)
            }
      }









}