import { extractResumeText } from "../aiagents/helpers.js";
import { analyzeResumeWithAI } from "../aiagents/QuestionAgent.js";


export const resumeAnalyzer = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Resume file is required" });
        }
        const { enableAutoRewrite } = req.body;





        const resumeText = await extractResumeText(req.file);

        if (!resumeText || resumeText.trim().length < 50) {
            return res.status(200).json({
                success: true,
                analysis: {
                    atsScore: 0,
                    strengths: [],
                    weaknesses: [],
                    missingSkills: [],
                    improvementSuggestions: [],
                    summary: "Resume content could not be analyzed.",
                },
            });
        }

        const analysis = await analyzeResumeWithAI({ resumeText, enableAutoRewrite });

        return res.status(200).json({
            success: true,
            analysis,
        });
    } catch (error) {
        console.error("❌ Resume Controller Error:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};
