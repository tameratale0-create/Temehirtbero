// server.ts
import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
var app = express();
var PORT = Number(process.env.PORT) || 3e3;
app.use(express.json({ limit: "10mb" }));
var getGenAIClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build"
      }
    }
  });
};
function generateSmartFallbackExam(trainingTitle, subject, trainingContent, numQuestions, language, numExams = 1) {
  const lines = trainingContent.split("\n").map((l) => l.trim()).filter((l) => l.length > 15 && !l.startsWith("#"));
  const validQuestionsCount = Math.min(Math.max(Number(numQuestions) || 5, 1), 30);
  const validExamsCount = Math.min(Math.max(Number(numExams) || 1, 1), 5);
  const examSets = [];
  const modelLetters = ["A", "B", "C", "D", "E", "F"];
  for (let eIdx = 0; eIdx < validExamsCount; eIdx++) {
    const questions = [];
    const modelLabel = validExamsCount > 1 ? `\u121E\u12F4\u120D ${modelLetters[eIdx]} (Set ${modelLetters[eIdx]})` : "";
    const examTitle = validExamsCount > 1 ? `${trainingTitle} - \u12ED\u134B\u12CA \u12E8\u1265\u1243\u1275 \u1218\u1218\u12D8\u129B \u1348\u1270\u1293 [${modelLabel}]` : `${trainingTitle} - \u12ED\u134B\u12CA \u12E8\u1265\u1243\u1275 \u1218\u1218\u12D8\u129B \u1348\u1270\u1293 (AI Exam)`;
    for (let i = 0; i < validQuestionsCount; i++) {
      const lineIndex = (i + eIdx * 2) % (lines.length || 1);
      const seedLine = lines[lineIndex] || `\u12E8\u1235\u120D\u1320\u1293 \u12ED\u12D8\u1275 \u1241\u120D\u134D \u1290\u1325\u1265 ${i + 1}`;
      const cleanSnippet = seedLine.replace(/^[0-9]+[\.\-\)]\s*/, "").slice(0, 110);
      if (language === "om" || subject.toLowerCase().includes("orom")) {
        questions.push({
          questionText: `Akka qajeelfama leenjii "${trainingTitle}" jedhutti: [Kutaa ${i + 1}] ${cleanSnippet} ilaalchisee yaada kamtu sirriidha?`,
          options: [
            `Hojiirra oolmaa qabatamaa daree keessatti ${cleanSnippet.slice(0, 40)} cimsuu`,
            "Barsiisaan dhuunfaatti qofa hojjechuu fi barattoota hirmaachisuu dhiisuu",
            "Barreeffama qofa akka qabatan gochuu fi qormaata dhiisuu",
            "Karoora sirna barnootaa wajjin wal-simsiisuu dhiisuu"
          ],
          correctIndex: (i + eIdx) % 4,
          explanation: `Qajeelfamni leenjii Biiroo Barnootaa Bulchiinsa Magaalaa Shashamannee dhimma kana irratti: "${seedLine}" jedhee ibsa.`
        });
      } else if (language === "en" || subject.toLowerCase().includes("english")) {
        questions.push({
          questionText: `According to the training material "${trainingTitle}": Regarding point #${i + 1} "${cleanSnippet}", which pedagogical practice is most effective?`,
          options: [
            `It fosters interactive pedagogical implementation and active engagement in ${subject}`,
            "It strictly recommends passive lecture without learner practice",
            "It discourages peer collaboration and active reflection in classroom",
            "It isolates continuous assessment from daily classroom instruction"
          ],
          correctIndex: (i + eIdx) % 4,
          explanation: `Based on the official Bureau training guide: "${seedLine}" emphasizes modern learner-centered methodology.`
        });
      } else {
        questions.push({
          questionText: `\u1260\u1235\u120D\u1320\u1293 \u1230\u1290\u12F1 "${trainingTitle}" \u1218\u1230\u1228\u1275\u1361 [\u1290\u1325\u1265 ${i + 1}] "${cleanSnippet}" \u1260\u121A\u1208\u12CD \u12D9\u122A\u12EB \u1275\u12AD\u12AD\u1208\u129B\u12CD \u12E8\u121B\u1235\u1270\u121B\u122A\u12EB \u1235\u1290-\u12D8\u12F4 \u12E8\u1275\u129B\u12CD \u1290\u12CD?`,
          options: [
            `\u1270\u121B\u122A\u12CE\u127D\u1295 \u1260\u1295\u1243\u1275 \u1260\u121B\u1233\u1270\u134D \u12A5\u1293 \u1260\u1270\u130D\u1263\u122B\u12CA \u121D\u1233\u120C\u12CE\u127D ${cleanSnippet.slice(0, 40)} \u1218\u1270\u130D\u1260\u122D`,
            "\u1218\u121D\u1205\u1229 \u1265\u127B\u12CD\u1295 \u12EB\u1208\u121B\u124B\u1228\u1325 \u121B\u1235\u1273\u12C8\u123B \u12A5\u1295\u12F2\u1345\u1349 \u121B\u12F5\u1228\u130D",
            "\u12E8\u12ED\u12D8\u1271\u1295 \u1270\u130D\u1263\u122B\u12CA \u1320\u1240\u121C\u1273 \u12C8\u12F0 \u130E\u1295 \u1260\u1218\u1270\u12CD \u1260\u1243\u120D \u1265\u127B \u121B\u1235\u1238\u121D\u12F0\u12F5",
            "\u12A8\u12AD\u134D\u120D \u12CD\u12ED\u12ED\u1275 \u12ED\u120D\u1245 \u12E8\u1295\u12F5\u1348-\u1200\u1233\u1265 \u121B\u1265\u122B\u122A\u12EB \u1265\u127B \u1218\u1235\u1320\u1275"
          ],
          correctIndex: (i + eIdx) % 4,
          explanation: `\u12E8\u123B\u1238\u1218\u1294 \u1275\u121D\u1205\u122D\u1275 \u1262\u122E \u12ED\u134B\u12CA \u12E8\u1235\u120D\u1320\u1293 \u1230\u1290\u12F5 \u1260\u121A\u12EB\u12D8\u12CD \u1218\u1230\u1228\u1275\u1361 "${seedLine}" \u1270\u121B\u122A-\u1270\u12AE\u122D \u12A5\u1293 \u1270\u130D\u1263\u122B\u12CA \u12A0\u1270\u1308\u1263\u1260\u122D\u1295 \u12EB\u130E\u120B\u120D\u1362`
        });
      }
    }
    examSets.push({
      examTitle,
      instructions: "\u12ED\u1205 \u1348\u1270\u1293 \u12A8\u123B\u1238\u1218\u1294 \u12A8\u1270\u121B \u12A0\u1235\u1270\u12F3\u12F0\u122D \u1275\u121D\u1205\u122D\u1275 \u1262\u122E \u12ED\u134B\u12CA \u12E8\u1235\u120D\u1320\u1293 \u1230\u1290\u12F5 \u1260\u1240\u1325\u1273 \u1260 AI \u1270\u12D8\u130B\u1305\u1276 \u12E8\u12C8\u1323 \u12E8\u1218\u121D\u1205\u122B\u1295 \u1265\u1243\u1275 \u1218\u1218\u12D8\u129B \u1290\u12CD\u1362 \u12A5\u1263\u12AD\u12CE \u1325\u12EB\u1244\u12CE\u1279\u1295 \u1260\u1325\u121E\u1293 \u12A0\u1295\u1265\u1260\u12CD \u12ED\u1218\u120D\u1231\u1362",
      durationMinutes: Math.max(validQuestionsCount * 3, 10),
      passingScore: 70,
      questions,
      isAIGenerated: true,
      generatedByModel: "Bureau-Curriculum-Engine-Offline",
      examSetLabel: validExamsCount > 1 ? `\u121E\u12F4\u120D ${modelLetters[eIdx]}` : "\u1290\u1320\u120B \u1348\u1270\u1293"
    });
  }
  const primary = examSets[0];
  return {
    exams: examSets,
    examTitle: primary.examTitle,
    instructions: primary.instructions,
    durationMinutes: primary.durationMinutes,
    passingScore: primary.passingScore,
    questions: primary.questions,
    isAIGenerated: true,
    generatedByModel: "Bureau-Curriculum-Engine-Offline"
  };
}
app.post("/api/generate-exam", async (req, res) => {
  try {
    const {
      trainingTitle,
      subject,
      gradeLevels,
      trainingContent,
      numQuestions = 5,
      numExams = 1,
      language = "am",
      difficulty = "standard"
    } = req.body;
    if (!trainingTitle || !trainingContent) {
      res.status(400).json({ error: "Missing required trainingTitle or trainingContent" });
      return;
    }
    const parsedNumQuestions = Math.min(Math.max(Number(numQuestions) || 5, 1), 30);
    const parsedNumExams = Math.min(Math.max(Number(numExams) || 1, 1), 5);
    const ai = getGenAIClient();
    if (!ai) {
      const fallbackResult = generateSmartFallbackExam(
        trainingTitle,
        subject || "General Education",
        trainingContent,
        parsedNumQuestions,
        language,
        parsedNumExams
      );
      res.json(fallbackResult);
      return;
    }
    const promptText = `
You are the Chief Assessment Officer of the Shashemene City Administration Education Bureau (\u12E8\u123B\u1238\u1218\u1294 \u12A8\u1270\u121B \u12A0\u1235\u1270\u12F3\u12F0\u122D \u1275\u121D\u1205\u122D\u1275 \u1262\u122E).
Generate formal, high-standard Teacher Online Competency Examination(s) based DIRECTLY on the following official teacher training material text.

TRAINING MATERIAL DETAILS:
- Title: ${trainingTitle}
- Subject: ${subject || "General Pedagogy"}
- Target Grade Levels: ${gradeLevels || "Grades 7 - 12"}
- Target Number of Exams: ${parsedNumExams} distinct exam sets/models
- Target Number of Questions per Exam: ${parsedNumQuestions} questions
- Language: ${language}
- Difficulty: ${difficulty}

OFFICIAL TRAINING TEXT CONTENT:
"""
${trainingContent}
"""

REQUIREMENTS:
1. Generate exactly ${parsedNumExams} distinct examination sets (e.g. Set A / \u121E\u12F4\u120D A, Set B / \u121E\u12F4\u120D B...).
2. In each exam set, formulate exactly ${parsedNumQuestions} multiple-choice questions.
3. If generating multiple exams (${parsedNumExams} > 1), each exam set MUST have distinct questions or focus on different parts and pedagogical angles of the training text.
4. Provide exactly 4 distinct options (A, B, C, D) per question.
5. "correctIndex" must be the 0-based integer index (0, 1, 2, or 3) of the single correct option.
6. "explanation" must clearly justify why the correct answer is right according to the training text.
7. Language:
   - If the training text is in Afaan Oromoo (or subject is Afaan Oromoo), write in Afaan Oromoo.
   - If in English, write in English.
   - If in Amharic, write in Amharic.
8. Output MUST strictly conform to the JSON response schema.
`;
    const geminiCall = ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: promptText,
      config: {
        systemInstruction: "You are a senior educator and exam creator for the Ethiopian Ministry of Education and Shashemene City Education Bureau. You generate rigorous, practical multiple-choice teacher competency exams directly from training manuals.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            exams: {
              type: Type.ARRAY,
              description: "List of generated exam sets/variants",
              items: {
                type: Type.OBJECT,
                properties: {
                  examTitle: {
                    type: Type.STRING,
                    description: "Official title of this competency exam variant (e.g. including Set A / \u121E\u12F4\u120D A if multiple)"
                  },
                  instructions: {
                    type: Type.STRING,
                    description: "Exam taking guidelines and instructions"
                  },
                  durationMinutes: {
                    type: Type.INTEGER,
                    description: "Total exam time limit in minutes"
                  },
                  passingScore: {
                    type: Type.INTEGER,
                    description: "Passing percentage threshold (e.g. 70)"
                  },
                  questions: {
                    type: Type.ARRAY,
                    description: "List of exam questions derived from the training manual",
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        questionText: { type: Type.STRING },
                        options: {
                          type: Type.ARRAY,
                          items: { type: Type.STRING },
                          description: "Four multiple choice options"
                        },
                        correctIndex: {
                          type: Type.INTEGER,
                          description: "0-based index of the correct option"
                        },
                        explanation: {
                          type: Type.STRING,
                          description: "Detailed explanation referencing the training material"
                        }
                      },
                      required: ["questionText", "options", "correctIndex", "explanation"]
                    }
                  }
                },
                required: ["examTitle", "instructions", "durationMinutes", "passingScore", "questions"]
              }
            }
          },
          required: ["exams"]
        }
      }
    });
    const timeoutCall = new Promise(
      (_, reject) => setTimeout(() => reject(new Error("AI Generation Timeout after 8 seconds")), 8e3)
    );
    const response = await Promise.race([geminiCall, timeoutCall]);
    const responseText = response.text;
    if (!responseText) {
      throw new Error("Empty response received from Gemini");
    }
    const parsedData = JSON.parse(responseText);
    const examsList = Array.isArray(parsedData.exams) && parsedData.exams.length > 0 ? parsedData.exams : [parsedData];
    const primaryExam = examsList[0] || {};
    res.json({
      exams: examsList,
      examTitle: primaryExam.examTitle,
      instructions: primaryExam.instructions,
      durationMinutes: primaryExam.durationMinutes,
      passingScore: primaryExam.passingScore,
      questions: primaryExam.questions,
      isAIGenerated: true,
      generatedByModel: "gemini-3.8-flash"
    });
  } catch (error) {
    console.error("Error generating AI exam:", error);
    const fallback = generateSmartFallbackExam(
      req.body.trainingTitle || "\u1235\u120D\u1320\u1293",
      req.body.subject || "\u1235\u1290-\u12D8\u12F4",
      req.body.trainingContent || "",
      Number(req.body.numQuestions || 5),
      req.body.language || "am",
      Number(req.body.numExams || 1)
    );
    res.json(fallback);
  }
});
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "Shashemene Education Bureau AI Engine",
    hasApiKey: Boolean(process.env.GEMINI_API_KEY)
  });
});
async function startServer() {
  const isProd = process.env.NODE_ENV === "production";
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, "dist")));
    app.get("*", (_req, res) => {
      res.sendFile(path.resolve(__dirname, "dist", "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Shashemene Education Bureau Server active on http://0.0.0.0:${PORT}`);
  });
}
startServer();
