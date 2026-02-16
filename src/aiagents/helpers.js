import { createRequire } from "module";
import mammoth from "mammoth";
import { PDFParse } from 'pdf-parse'

export async function extractResumeText(file) {
  if (!file) return "";

  if (file.mimetype === "application/pdf") {

    const parser = new PDFParse({ data: file.buffer });
    const data = await parser.getText();
    return data.text || "";
  }

  if (
    file.mimetype ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    file.mimetype === "application/msword"
  ) {
    const result = await mammoth.extractRawText({
      buffer: file.buffer,
    });
    return result.value || "";
  }

  return "";
}



export function cleanJsonResponse(text) {
  if (!text) return "";
  return text
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();
}

export const isEmptyAnswer = (ans) =>
  typeof ans !== "string" || ans.trim().length === 0;

export const scaleScore = (s) => {
  const score = Number(s);
  if (!score || score <= 1) return 0;
  if (score >= 5) return 10;
  return Math.round(((score - 1) / 4) * 10);
};
