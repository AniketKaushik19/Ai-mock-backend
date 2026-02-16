import express from 'express'
import { authMiddleware } from '../middleware/index.js'

import { upload } from '../middleware/upload.js';
import { resumeAnalyzer } from '../controllers/resume.controller.js';

const router = express.Router()

router.post(
  "/analyze",
  upload.single("resume"),
  resumeAnalyzer
);

export default router