import express from "express";
import { container } from "tsyringe";
import { ConversationsController } from "../domain/Conversations/controllers/conversations.Controller";
import { verifyToken } from "../middleware/tokenVerification";
import { validateRequest } from "../middleware/zodValidations";
import { CreateDirectConversationParams, CreateDirectConversationSchema } from "../domain/Conversations/dtos/conversationDto";


const router = express.Router();

const conversationController =  container.resolve(ConversationsController);


router.get("/sidebar", verifyToken, conversationController.getSidebarConversations)

router.get("/get_user_convo_list",verifyToken,conversationController.getUserConversationList)

router.post("/create",verifyToken, validateRequest({
       body: CreateDirectConversationSchema}), conversationController.createConversation);

router.get("/:convoId",verifyToken,validateRequest({
       params:CreateDirectConversationParams
}), conversationController.fetchConversationById)

export default router;