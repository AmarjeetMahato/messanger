import express from "express";
import { container } from "tsyringe";
import { ConversationsController } from "../domain/Conversations/controllers/conversations.Controller";
import { verifyToken } from "../middleware/tokenVerification";


const router = express.Router();

const conversationController =  container.resolve(ConversationsController);
router.get("/sidebar", verifyToken, conversationController.getSidebarConversations)
router.get("/fetch_convo_by_userId",verifyToken,conversationController.fetchConversationbyUserid)
router.post("/create",verifyToken,conversationController.createConversation);
router.get("/:convoId",conversationController.fetchConversationById)

export default router;