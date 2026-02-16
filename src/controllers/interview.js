import { generateInterviewFeedback, generateInterviewQuestions } from "../aiagents/QuestionAgent.js";
import db from "../config/db.js";
import { getActiveSubscription } from "../helpers/subscription.js";

export const generateInterview = async (req, res) => {
  try {
    const userId = req.user.id;
    const { jobRole, jobDescription, techStack, yearsOfExperience } = req.body;

    if (!jobRole || !techStack || !yearsOfExperience) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const subscription = await getActiveSubscription(userId);
    if (!subscription) {
      return res.status(403).json({ message: "No active subscription" });
    }

    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;

    const usage = await db("user_monthly_interview_stats")
      .where({
        user_id: userId,
        subscription_instance_id: subscription.subscriptionInstanceId,
        year,
        month,
      })
      .first();

    const used = usage?.interview_count || 0;

    if (used >= subscription.Monthly_limit) {
      return res.status(403).json({ message: "Interview limit reached" });
    }

    const aiResult = await generateInterviewQuestions({
      jobRole,
      jobDescription,
      techStack,
      yearsOfExperience,
      entropySeed: Date.now(),
    });

    const [interviewId] = await db("mock_interviews").insert({
      user_id: userId,
      job_role: jobRole,
      experience_level: yearsOfExperience,
      tech_stack: JSON.stringify(techStack),
    });

    await db("interview_questions").insert(
      aiResult.questions.map((q) => ({
        interview_id: interviewId,
        question_type: q.type,
        question: q.question,
      }))
    );

    return res.status(201).json({
      interviewId,
      questions: aiResult.questions,
    });
  } catch (err) {
    console.error("❌ generateInterview:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};




export const getInterviewQuestions = async (req, res) => {
  try {
 const userId = req.user.id;
    const { interviewId } = req.params;

    if (!interviewId) {
      return res.status(400).json({
        message: "Interview ID is required"
      });
    }

    
    const interview = await db("mock_interviews")
      .where({ id: interviewId, user_id: userId })
      .first();

    if (!interview) {
      return res.status(404).json({
        message: "Interview not found"
      });
    }

   
    const questions = await db("interview_questions")
      .where({ interview_id: interviewId })
      .select("id", "question_type", "question");

    res.status(200).json({
      message: "Interview questions fetched successfully",
      interview: {
        id: interview.id,
        jobRole: interview.job_role,
        experienceLevel: interview.experience_level,
        techStack: interview.tech_stack,
        questions
      }
    });

  } catch (error) {
    console.error("Fetch Interview Error:", error);
    res.status(500).json({
      message: "Internal server error"
    });
  }
};

export const getInterviewDetail = async (req, res) => {
  try {
    const userId = req.user.id;
    const { interviewId } = req.params;

    if (!interviewId) {
      return res.status(400).json({
        message: "Interview ID is required"
      });
    }

    const interview = await db("mock_interviews")
      .where({ id: interviewId, user_id: userId })
      .first();

    if (!interview) {
      return res.status(404).json({
        message: "Interview not found"
      });
    }

    
    const questions = await db("interview_questions")
      .select("id", "question", "question_type", "created_at")
      .where({ interview_id: interviewId })
      .orderBy("id", "asc");

    res.status(200).json({
      message: "Interview details fetched successfully",
      interview: {
        id: interview.id,
        jobRole: interview.job_role,
        experienceLevel: interview.experience_level,
        techStack: JSON.parse(interview.tech_stack),
        totalQuestions: questions.length, 
        questions, 
        createdAt: interview.created_at
      }
    });

  } catch (error) {
    console.error("Fetch Interview Detail Error:", error);
    res.status(500).json({
      message: "Internal server error"
    });
  }
};




export const getUserInterviews = async (req, res) => {
  try {
    const userId = req.user.id;

    
    const interviews = await db("mock_interviews as m")
      .leftJoin("mock_interview_attempts as a", function () {
        this.on("m.id", "=", "a.interview_id")
            .andOn("a.user_id", "=", db.raw("?", [userId]));
      })
      .where("m.user_id", userId)
      .orderBy("m.created_at", "desc")
      .select(
        "m.id",
        "m.job_role",
        "m.experience_level",
        "m.created_at",
        "a.id as feedbackId" 
      );

    res.status(200).json({
      message: "User interviews fetched successfully",
      interviews
    });

  } catch (error) {
    console.error("Fetch User Interviews Error:", error);
    res.status(500).json({
      message: "Internal server error"
    });
  }
};

export const submitInterviewFeedback = async (req, res) => {
  try {
    const userId = req.user.id;
    const { interviewId } = req.params;
    const { answers } = req.body;

    if (!Array.isArray(answers)) {
      return res.status(400).json({ message: "Answers array is required" });
    }

    const subscription = await getActiveSubscription(userId);
    if (!subscription) {
      return res.status(403).json({ message: "No active subscription" });
    }

    const interview = await db("mock_interviews")
      .where({ id: interviewId, user_id: userId })
      .first();

    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
    }

    const questions = await db("interview_questions")
      .where({ interview_id: interviewId })
      .select("id", "question");

    const questionsAndAnswers = questions.map((q) => {
      const ua = answers.find((a) => Number(a.questionId) === q.id);
      return {
        questionId: q.id,
        question: q.question,
        answer: ua?.answer || "",
      };
    });

    const feedbackResult = await generateInterviewFeedback({
      jobRole: interview.job_role,
      yearsOfExperience: interview.experience_level,
      questionsAndAnswers,
    });

    await db.raw(
      `
      INSERT INTO mock_interview_attempts
        (user_id, interview_id, responses, feedback, status)
      VALUES (?, ?, ?, ?, 'feedback_generated')
      ON DUPLICATE KEY UPDATE
        feedback = VALUES(feedback),
        status = 'feedback_generated',
        updated_at = CURRENT_TIMESTAMP
      `,
      [
        userId,
        interviewId,
        JSON.stringify(answers),
        JSON.stringify(feedbackResult),
      ]
    );

    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;

    await db.raw(
      `
      INSERT INTO user_monthly_interview_stats
        (user_id, subscription_instance_id, year, month, interview_count)
      VALUES (?, ?, ?, ?, 1)
      ON DUPLICATE KEY UPDATE
        interview_count = interview_count + 1,
        updated_at = CURRENT_TIMESTAMP
      `,
      [
        userId,
        subscription.subscriptionInstanceId,
        year,
        month,
      ]
    );

    return res.status(201).json({
      message: "Interview feedback generated successfully",
      ...feedbackResult,
    });
  } catch (err) {
    console.error("❌ submitInterviewFeedback:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};


export const getInterviewFeedback = async (req, res) => {
  try {
    const userId = req.user.id;
    const { interviewId } = req.params;

    const attempt = await db("mock_interview_attempts")
      .where({ user_id: userId, interview_id: interviewId })
      .first();

    if (!attempt) {
      return res.status(404).json({ message: "Interview not found" });
    }

    if (attempt.status !== "feedback_generated") {
      return res.status(400).json({
        message: "Feedback not generated yet",
        status: attempt.status,
      });
    }

    let feedbackData;
    try {
      feedbackData = JSON.parse(attempt.feedback);
    } catch (err) {
      console.error("❌ JSON parse error:", err);
      return res.status(500).json({ message: "Corrupted feedback data" });
    }

    
    const questions = Array.isArray(feedbackData.feedback)
      ? feedbackData.feedback
      : [];

    return res.status(200).json({
      success: true,
      message: "Interview feedback fetched successfully",
      interviewId,
      overallScore: feedbackData.overallScore ?? 0,
      summary: feedbackData.summary ?? "",
      strengths: feedbackData.strengths ?? [],
      improvements: feedbackData.improvements ?? [],
      questions: questions.map(q => ({
        questionId: q.questionId,
        question: q.question,
        userAnswer: q.userAnswer,
        correctAnswer: q.correctAnswer,
        feedback: q.feedback,
        score: q.score,
      })),
    });

  } catch (error) {
    console.error("❌ Get Interview Feedback Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


export const getRemainingInterviewLimit = async (req, res) => {
  try {
    const userId = req.user.id;

    const subscription = await getActiveSubscription(userId);
    if (!subscription) {
      return res.json({
        limit: 4,
        used: 0,
        remaining: 4,
        isLimitReached: false,
        reason: "No active subscription",
      });
    }

    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;

    const stat = await db("user_monthly_interview_stats")
      .where({
        user_id: userId,
        subscription_instance_id: subscription.subscriptionInstanceId,
        year,
        month,
      })
      .first();

    const used = stat?.interview_count || 0;
    const limit = Number(subscription.Monthly_limit);
    const remaining = Math.max(limit - used, 0);

    return res.json({
      limit,
      used,
      remaining,
      isLimitReached: remaining === 0,
    });
  } catch (error) {
    console.error("❌ getRemainingInterviewLimit:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

