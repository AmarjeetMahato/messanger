import express from "express"
import { container } from "tsyringe";
import { AuthControllers } from "../domain/Auth/controllers/auth.Controller";
import { verifyToken } from "../middleware/tokenVerification";


const router = express.Router();

const authController =  container.resolve(AuthControllers)

router.post("/create",authController.createUser);
router.post("/login",authController.loginUser);
router.get("/me",verifyToken, authController.getMe)


export default router;