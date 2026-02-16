import express from 'express'
import { editProfile, forgotPasswordSendOtp, getUserProfile, loginWithPassword, onboarding, registerUser, resendForgotPasswordOtp, resendSignupOtp, resetPassword, signupVerifyOtp, verifyForgotPasswordOtp } from '../controllers/user.js';
import { authMiddleware } from '../middleware/index.js';
import { upload } from '../libs/s3.js';
import { getRemainingInterviewLimit } from '../controllers/interview.js';

const router=express.Router();

router.post('/signup',registerUser);
router.post('/resend-otp',resendSignupOtp);
router.post('/verify-otp',signupVerifyOtp);
router.post('/login',loginWithPassword);
router.put("/profile/edit", authMiddleware, upload.single("img"), editProfile);

router.post("/forgot-password", forgotPasswordSendOtp);
router.post("/forgot-password/resend", resendForgotPasswordOtp);
router.post("/forgot-password/verify-otp", verifyForgotPasswordOtp);
router.post("/forgot-password/reset", resetPassword);

router.post("/onboarding",authMiddleware,upload.single("img"),onboarding);
router.get("/profile",authMiddleware,getUserProfile);
router.get("/interview-limit",authMiddleware,getRemainingInterviewLimit);






export default router;