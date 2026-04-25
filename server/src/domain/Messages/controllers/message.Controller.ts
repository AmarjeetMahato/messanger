import {Request,Response,NextFunction} from "express"
import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../../helpers/tokens";
import type { IMessageService } from "../services/message.service.Interface";
import { HTTPSTATUS } from "../../../utils/https.config";

@injectable()
export class MessageController {

  constructor(@inject(TOKENS.MessageServices) private service:IMessageService){}

  sendMessage = async (req: Request, res: Response, next: NextFunction) : Promise<void> => {
    try {
      const senderId = req.userId;
      const { conversationId, content } = req.body;       
      const message = await this.service.sendMessage(conversationId, senderId!, content);
      res.status(201).json({
        success: true,
        message: "Message sent",
        data: message
      });

    } catch (error) {
      next(error);
    }
  }

  getMessages  = async (req: Request, res: Response, next: NextFunction):Promise<void> => {
      try {
       const conversationId = Array.isArray(req.params.conversationId)
      ? req.params.conversationId[0]
      : req.params.conversationId;

    if (!conversationId) {
      res.status(400).json({
        success: false,
        message: "conversationId is required",
      });
      return;
    }
      const limit = parseInt(req.query.limit as string) || 20;
       // 3️⃣ Parse cursor
    const cursorRaw = Array.isArray(req.query.cursor) ? req.query.cursor[0] : req.query.cursor;
    let cursor: string | undefined;
    if (cursorRaw && typeof cursorRaw === "string") {
      cursor = cursorRaw;
    }
      const messagesList = await this.service.getMessages(conversationId, limit, cursor);
      console.log(messagesList);
      
      res.status(200).json({
        success: true,
        data: messagesList
      });

    } catch (error) {
      next(error);
    }
  }


  markAsDelivered = async(req: Request, res: Response, next: NextFunction):Promise<void> => {

          try {
                      const {messageId} = req.params as {messageId:string} 

                      const message = await this.service.markAsDelivered(messageId);
                      res.status(HTTPSTATUS.OK).json({
                         message:"Message is delivered",
                         success: true,
                         data: message
                      })
          } catch (error) {
              next(error)
          }
  }

  markAsRead = async(req: Request, res: Response, next: NextFunction):Promise<void> => {

          try {
                      const {messageId} = req.params as {messageId:string} 

                      const message = await this.service.markAsRead(messageId);
                      res.status(HTTPSTATUS.OK).json({
                         message:"Message is delivered",
                         success: true,
                         data: message
                      })
          } catch (error) {
              next(error)
          }
  }

  updateMessage = async(req: Request, res: Response, next: NextFunction):Promise<void> => {
                    const {messageId} = req.params as {messageId:string}
                    const userId = req.userId
             try {
                        const result = await this.service.editMessage(messageId,userId!,req.body)
             } catch (error) {
                next(error)
             }
  }


  deletedSoft = async (req:Request, res:Response, next: NextFunction): Promise<void> => {
                     const {messageId} = req.params as {messageId:string} 
                     const userId = req.userId
             try {
                     await this.service.deleteMessage(messageId, userId!);
                     res.status(HTTPSTATUS.OK).json({
                        message:"Message deleted successfully",
                        success: true
                     })
             } catch (error) {
                 next(error)
             }
  }
    
}