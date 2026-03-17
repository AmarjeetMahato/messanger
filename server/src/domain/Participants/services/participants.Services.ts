import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../../helpers/tokens";
import { ParticipantsRepository } from "../repository/participants.Repository";
import { BadRequestException, InternalServerException, NotFoundExceptions } from "../../../utils/Catch-error";

@injectable()
export class ParticipantsService{

    constructor(@inject(TOKENS.ParticipantsRepository) private repo:ParticipantsRepository){}

    async getConversationParticipants(conversationId:string){
            if(!conversationId){
                 throw new BadRequestException("conversationId should not be empty !"); 
            }

            const result = await this.repo.getConversationParticipants(conversationId);
            if (!result.length) {
                 throw new NotFoundExceptions("Participants not found for this conversation");
            }
            return result;
    }

    async getAllConversationParticipants(){
           return this.repo.getAllConversationParticipants();
    }
}