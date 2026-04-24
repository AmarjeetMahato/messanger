import express from "express"
import { container } from "tsyringe";
import { ParticipantsController } from "../domain/Participants/controllers/participants.Controller";
import { validateRequest } from "../middleware/zodValidations";
import { createParticipantSchema,markAsReadParamsSchema,ParticipantSchemaParams,updateParticipantSchema } from "../domain/Participants/dtos/participantsDto";
import { verifyToken } from "../middleware/tokenVerification";


const router = express.Router();

const participentsController = container.resolve(ParticipantsController)

router.get("/get_all_participents",participentsController.getAllConversationParticipants)

router.post("/add_participant", 
    validateRequest({ body:createParticipantSchema }), participentsController.addParticipant)

router.patch("/:conversationId/update",verifyToken,validateRequest({
         body:updateParticipantSchema, params:ParticipantSchemaParams
    }), participentsController.updateParticipant)

router.get("/:conversationId/get_participant", verifyToken,
     validateRequest({params:ParticipantSchemaParams}), participentsController.getParticipantById)

router.get("/:conversationId/add_participant",verifyToken,
     validateRequest({params:ParticipantSchemaParams}),participentsController.removeParticipant)    
     
router.get("/:conversationId/promote_to_admin", verifyToken,
     validateRequest({params:ParticipantSchemaParams}), participentsController.promoteToAdmin)  
     
router.get("/:conversationId/demote_to_member", verifyToken,
     validateRequest({params:ParticipantSchemaParams}), participentsController.demoteToMember) 
     
router.get("/:conversationId/markasread/:messageId", verifyToken,
    validateRequest({params:markAsReadParamsSchema,}), participentsController.markAsRead,)     

export default router