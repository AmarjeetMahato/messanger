import express from "express";
import { container } from "tsyringe";
import { UserController } from "../domain/Users/controllers/user.Controller";
import { verifyToken } from "../middleware/tokenVerification";


const router = express.Router();

const userController = container.resolve(UserController);

router.get("/get_user/:userId",verifyToken, userController.fetchuserById);
router.get("/get_all_users", verifyToken,userController.fetchAllusers)

export default router;