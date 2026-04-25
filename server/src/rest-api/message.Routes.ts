import express from "express"
import { container } from "tsyringe";
import { MessageController } from "../domain/Messages/controllers/message.Controller";
import { verifyToken } from "../middleware/tokenVerification";
import { validateRequest } from "../middleware/zodValidations";
import { createMessageSchema,updateMessageSchema, createMessageSchemaParams } from "../domain/Messages/dtos/messageDto";


const router = express.Router();


const messageController = container.resolve(MessageController);

router.post("/send-message",verifyToken,validateRequest({
          body:createMessageSchema}) ,messageController.sendMessage);

router.get("/:conversationId",verifyToken, validateRequest({
       params:createMessageSchemaParams }), messageController.getMessages);

router.patch("/:messageId/mark-as-read",verifyToken,validateRequest({
       params: createMessageSchemaParams }),messageController.markAsRead) 
       
router.patch("/:messageId/mark-as-delivered",verifyToken,validateRequest({
       params: createMessageSchemaParams }),messageController.markAsDelivered) 


router.patch("/:messageId/update",verifyToken, validateRequest({
         body: updateMessageSchema
       }), messageController.updateMessage)

router.delete("/messageId/delete", verifyToken, validateRequest({
       params :createMessageSchemaParams }), messageController.deletedSoft)      
              
       

export default router;