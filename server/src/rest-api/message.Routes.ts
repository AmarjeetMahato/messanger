import express from "express"
import { container } from "tsyringe";
import { MessageController } from "../domain/Messages/controllers/message.Controller";
import { verifyToken } from "../middleware/tokenVerification";


const router = express.Router();


const messageController = container.resolve(MessageController);

router.post("/send-message",verifyToken, messageController.sendMessage);
router.get("/:conversationId",messageController.getMessages);

export default router;