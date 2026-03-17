import {Request,Response,NextFunction} from "express"
import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../../helpers/tokens";
import { MessageServices } from "../services/message.Services";

@injectable()
export class MessageController {

  constructor(@inject(TOKENS.MessageServices) private service:MessageServices){}

     sendMessage = async (req: Request, res: Response, next: NextFunction) : Promise<void> => {
    try {
      const senderId = req.userId;
        console.log("senderId ",senderId);
       
      const { conversationId, content } = req.body;

      if (!senderId) {
         res.status(400).json({ success: false, message: "Invalid user" });
         return;
      }
       console.log("conversationId ", conversationId);
       console.log("senderId ",senderId);
       
       
      const message = await this.service.sendMessage(conversationId, senderId, content);
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

      res.status(200).json({
        success: true,
        data: messagesList
      });

    } catch (error) {
      next(error);
    }
  }
    
}