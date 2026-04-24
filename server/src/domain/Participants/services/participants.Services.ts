import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../../helpers/tokens";
import { ParticipantsRepository } from "../repository/participants.Repository";
import { BadRequestException, ConflictExceptions, InternalServerException, NotFoundExceptions } from "../../../utils/Catch-error";
import { IParticipantsService } from "./participants.service.interface";
import { CreateParticipantDto, ParticipantResponseDto, UpdateParticipantDto } from "../dtos/participantsDto";
import { PaginatedResponse } from "../repository/participants.Repository.interface";
import { ParticipantsMapper } from "../mapper/participantsMapper";

@injectable()
export class ParticipantsService implements IParticipantsService{

    constructor(@inject(TOKENS.ParticipantsRepository) private repo:ParticipantsRepository){}

     async addParticipant(data: CreateParticipantDto): Promise<ParticipantResponseDto> {
            if(!data){
                 throw new BadRequestException("Invalid field value")
            }
            const  existing = await this.repo.getParticipant(data.conversationId, data.userId);
            if(existing){
                 throw new ConflictExceptions("Participant already exists")
            }
            const createEntity = ParticipantsMapper.toCreateEntity(data)
            const payload = ParticipantsMapper.toInsert(createEntity)
            const Participant = await this.repo.addParticipant(payload)
            const entity = ParticipantsMapper.toEntity(Participant)
            return ParticipantsMapper.toResponse(entity)
     }

     // ─────────────────────────────────────────────
  // ✅ REMOVE PARTICIPANT
  // ─────────────────────────────────────────────
  async removeParticipant(
    conversationId: string,
    userId: string
  ): Promise<boolean> {

    if (!conversationId || !userId) {
      throw new BadRequestException("conversationId and userId are required");
    }

    const existing = await this.repo.getParticipant(conversationId, userId);

    if (!existing) {
      throw new NotFoundExceptions("Participant not found");
    }

    const result = await this.repo.removeParticipant(conversationId, userId);

    if (!result) {
      throw new InternalServerException("Failed to remove participant");
    }

    return true;
  }

  // ─────────────────────────────────────────────
  // ✅ GET PARTICIPANTS (PAGINATED)
  // ─────────────────────────────────────────────
  async getParticipants(query: {
    conversationId?: string;
    userId?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<ParticipantResponseDto>> {

    const result = await this.repo.getAllConversationParticipants(
      query.conversationId ?? "",
      query.userId ?? "",
      query.limit ?? 10,
      query.page ?? 1
    );

    return {
      data: ParticipantsMapper.toResponseList(
        ParticipantsMapper.toEntityList(result.data)
      ),
      pagination: result.pagination,
    };
  }

  // ─────────────────────────────────────────────
  // ✅ GET SINGLE PARTICIPANT
  // ─────────────────────────────────────────────
  async getParticipantById(
    conversationId: string,
    userId: string
  ): Promise<ParticipantResponseDto> {

    if (!conversationId || !userId) {
      throw new BadRequestException("Invalid conversationId or userId");
    }

    const result = await this.repo.getParticipant(conversationId, userId);

    if (!result) {
      throw new NotFoundExceptions("Participant not found");
    }

    const entity = ParticipantsMapper.toEntity(result);

    return ParticipantsMapper.toResponse(entity);
  }

  // ─────────────────────────────────────────────
  // ✅ UPDATE PARTICIPANT
  // ─────────────────────────────────────────────
  async updateParticipant(
    conversationId: string,
    userId: string,
    data: UpdateParticipantDto
  ): Promise<ParticipantResponseDto> {

    if (!conversationId || !userId) {
      throw new BadRequestException("Invalid identifiers");
    }

    const existing = await this.repo.getParticipant(conversationId, userId);

    if (!existing) {
      throw new NotFoundExceptions("Participant not found");
    }

    const updateEntity = ParticipantsMapper.toUpdateEntity(data)
    const presistance = ParticipantsMapper.toUpdate(updateEntity)
    const updated = await this.repo.updateParticipant(presistance);
    const entity = ParticipantsMapper.toEntity(updated);
    return ParticipantsMapper.toResponse(entity);
  }

  // ─────────────────────────────────────────────
  // ✅ PROMOTE TO ADMIN
  // ─────────────────────────────────────────────
  async promoteToAdmin(
    conversationId: string,
    userId: string
  ): Promise<boolean> {

    const existing = await this.repo.getParticipant(conversationId, userId);

    if (!existing) {
      throw new NotFoundExceptions("Participant not found");
    }

    const result = await this.repo.updateRole(
      conversationId,
      userId,
      "admin"
    );

    if (!result) {
      throw new InternalServerException("Failed to promote user");
    }

    return true;
  }

  // ─────────────────────────────────────────────
  // ✅ DEMOTE TO MEMBER
  // ─────────────────────────────────────────────
  async demoteToMember(
    conversationId: string,
    userId: string
  ): Promise<boolean> {

    const existing = await this.repo.getParticipant(conversationId, userId);

    if (!existing) {
      throw new NotFoundExceptions("Participant not found");
    }

    const result = await this.repo.updateRole(
      conversationId,
      userId,
      "member"
    );

    if (!result) {
      throw new InternalServerException("Failed to demote user");
    }

    return true;
  }
   async  markAsRead(conversationId: string, userId: string, messageId: string): Promise<boolean> {
           if(!conversationId || !userId){
                  throw new BadRequestException("conversationId or userId can't be null or empty")
           }

           if(!messageId){
                throw new BadRequestException("messageId can't be null or empty")
           }

           const participants = await this.repo.getParticipant(conversationId, userId);
           if(!participants){
                 throw  new NotFoundExceptions("No Participants found")
           }
           const result = await this.repo.markAsRead(conversationId,userId,messageId);
           return result
           
     }

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

}