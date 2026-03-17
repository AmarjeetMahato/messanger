import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../../helpers/tokens";
import { ParticipantsService } from "../services/participants.Services";
import {Request,Response,NextFunction} from "express"
import { HTTPSTATUS } from "../../../utils/https.config";

@injectable()
export class ParticipantsController{

    constructor(@inject(TOKENS.ParticipantsService) private service:ParticipantsService){}

    getAllConversationParticipants = async (req:Request,res:Response,next:NextFunction):Promise<void> =>{
                  try {
                        const result = await this.service.getAllConversationParticipants();
                        res.status(HTTPSTATUS.OK).json({
                             success:true,
                             message:"Fetch successfully",
                             data:result
                        })
                  } catch (error) {
                    console.log(error);
                    next(error)
                    
                  }
    }
}