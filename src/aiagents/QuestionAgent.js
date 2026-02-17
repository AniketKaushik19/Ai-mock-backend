import Groq from "groq-sdk";
import { feedBackPrompt, questiongenerateSystemPrompt, resumeAnalyzerSystemPrompt } from "./prompts.js";
import { cleanJsonResponse, isEmptyAnswer, scaleScore } from "./helpers.js";

const groq = new Groq({
  apiKey: process.env.GROQ_API,
});








export async function generateInterviewQuestions({
  jobRole,
  jobDescription,
  techStack,
  yearsOfExperience,
  numberOfQuestions = 5,
}) {
  try {
    const messages = [
      {
        role: "system",
        content: questiongenerateSystemPrompt,
      },
      {
        role: "user",
        content: JSON.stringify({
          jobRole,
          jobDescription,
          techStack,
          yearsOfExperience,
          numberOfQuestions,
        }),
      },
    ];

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0.6,
      top_p: 0.9,
      messages,
    });

    const rawContent = response.choices?.[0]?.message?.content;
    if (!rawContent) throw new Error("Empty AI response");

    const cleanedContent = cleanJsonResponse(rawContent);

    let parsedResult;
    try {
      parsedResult = JSON.parse(cleanedContent);
    } catch (e) {
      console.error("❌ AI returned invalid JSON:\n", cleanedContent);
      throw new Error("Failed to parse AI JSON response");
    }

    if (!Array.isArray(parsedResult.questions)) {
      throw new Error("AI JSON does not contain 'questions' array");
    }

    return parsedResult;
  } catch (error) {
    console.error("❌ Error generating interview questions:", error.message);
    throw error;
  }
}




export async function generateInterviewFeedback({
  jobRole,
  questionsAndAnswers,
  yearsOfExperience,
}) {
  try {
    const messages = [
      { role: "system", content: feedBackPrompt },
      {
        role: "user",
        content: JSON.stringify({
          jobRole,
          yearsOfExperience,
          questionsAndAnswers,
        }),
      },
    ];

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0.2,
      messages,
    });

    const rawContent = response.choices?.[0]?.message?.content;
    if (!rawContent) throw new Error("Empty AI response");

    const cleanedContent = cleanJsonResponse(rawContent);
    const parsed = JSON.parse(cleanedContent);

    if (!Array.isArray(parsed.feedback)) {
      throw new Error("Invalid feedback array");
    }

    const validQuestionIds = new Set(
      questionsAndAnswers.map((q) => q.questionId)
    );

    parsed.feedback = parsed.feedback
      .filter((f) => validQuestionIds.has(f.questionId))
      .map((f) => {
        const qa = questionsAndAnswers.find(
          (q) => q.questionId === f.questionId
        );

        const userAnswer = qa?.answer || "";

        if (isEmptyAnswer(userAnswer)) {
          return {
            questionId: f.questionId,
            question: qa?.question || "",
            userAnswer: "",
            correctAnswer: f.correctAnswer || "",
            feedback: "No answer provided by the candidate.",
            score: 0,
          };
        }

        return {
          questionId: f.questionId,
          question: qa?.question || "",
          userAnswer,
          correctAnswer: f.correctAnswer || "",
          feedback: f.feedback || "",
          score: scaleScore(f.score),
        };
      });


    parsed.overallScore = Math.round(
      parsed.feedback.reduce((sum, f) => sum + f.score, 0) /
      parsed.feedback.length
    );

    return parsed;
  } catch (error) {
    console.error("❌ Error generating interview feedback:", error.message);
    throw error;
  }
}


export async function analyzeResumeWithAI({ resumeText, enableAutoRewrite }) {
  try {


    const messages = [
      { role: "system", content: resumeAnalyzerSystemPrompt },
      {
        role: "user",
        content: JSON.stringify({
          resumeText,
          enableAutoRewrite: enableAutoRewrite ? true : false
        }),
      },
    ];

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0.150,
      top_p: 1,
      messages,
    });

    const rawContent = response.choices?.[0]?.message?.content;
    if (!rawContent) throw new Error("Empty AI response");

    const cleaned = cleanJsonResponse(rawContent);

    const parsed = JSON.parse(cleaned);

    return parsed;
  } catch (error) {
    console.error("❌ Resume AI Agent Error:", error.message);
    throw error;
  }
}




