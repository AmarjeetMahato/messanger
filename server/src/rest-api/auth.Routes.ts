import express from "express";
import { container } from "tsyringe";
import { AuthControllers } from "../domain/Auth/controllers/auth.Controller";
import { verifyToken, verifyUserToken } from "../middleware/tokenVerification";

const router = express.Router();

const authController = container.resolve(AuthControllers);

router.post("/create", authController.createUser);
router.post("/login", authController.loginUser);
router.post(
  "/verify-email",
  verifyUserToken,
  authController.verificationEmailWithOTP,
);
router.post(
  "/resend-otp",
  verifyUserToken,
  authController.resendVerificationOtp,
);
router.get("/me", verifyToken, authController.getMe);
router.get("/logout", authController.logoutUser);

export default router;
