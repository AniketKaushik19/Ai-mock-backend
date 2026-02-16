import express from "express";
import {
  generateInterview,
  getInterviewDetail,
  getInterviewFeedback,
  getInterviewQuestions,
  getRemainingInterviewLimit,
  getUserInterviews,
  submitInterviewFeedback
} from "../controllers/interview.js";
import {authMiddleware} from "../middleware/index.js";

const router = express.Router();



router.post("/generate", authMiddleware, generateInterview);
router.get("/:interviewId", authMiddleware, getInterviewQuestions);
// router.get("/interviewDetail/:interviewId",  getInterviewDetail);
router.get("/interviewDetail/:interviewId", authMiddleware, getInterviewDetail);
router.get("/", authMiddleware, getUserInterviews);

router.post("/:interviewId/feedback", authMiddleware, submitInterviewFeedback);

router.get("/interview/limit" ,authMiddleware , getRemainingInterviewLimit)
router.get("/:interviewId/feedback", authMiddleware, getInterviewFeedback);

export default router;
