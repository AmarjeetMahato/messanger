import express from "express"
import { container } from "tsyringe";
import { ParticipantsController } from "../domain/Participants/controllers/participants.Controller";


const router = express.Router();

const participentsController = container.resolve(ParticipantsController)

router.get("/get_all_participents",participentsController.getAllConversationParticipants)



export default router