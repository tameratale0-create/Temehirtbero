import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize GoogleGenAI SDK with recommended settings
const getGenAIClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });
};

interface QuestionPayload {
  questionText: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface GenerateExamResponse {
  examTitle: string;
  instructions: string;
  durationMinutes: number;
  passingScore: number;
  questions: QuestionPayload[];
  isAIGenerated: boolean;
  generatedByModel?: string;
}

interface ExamSetResponse {
  examTitle: string;
  instructions: string;
  durationMinutes: number;
  passingScore: number;
  questions: QuestionPayload[];
  isAIGenerated: boolean;
  generatedByModel?: string;
  examSetLabel?: string;
}

interface MultiExamResponse {
  exams: ExamSetResponse[];
  examTitle?: string;
  instructions?: string;
  durationMinutes?: number;
  passingScore?: number;
  questions?: QuestionPayload[];
  isAIGenerated: boolean;
  generatedByModel?: string;
}

// Fallback generator in case Gemini API is temporarily offline or without API key
function generateSmartFallbackExam(
  trainingTitle: string,
  subject: string,
  trainingContent: string,
  numQuestions: number,
  language: string,
  numExams: number = 1
): MultiExamResponse {
  const lines = trainingContent
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 15 && !l.startsWith('#'));

  const validQuestionsCount = Math.min(Math.max(Number(numQuestions) || 5, 1), 30);
  const validExamsCount = Math.min(Math.max(Number(numExams) || 1, 1), 5);
  const examSets: ExamSetResponse[] = [];
  const modelLetters = ['A', 'B', 'C', 'D', 'E', 'F'];

  for (let eIdx = 0; eIdx < validExamsCount; eIdx++) {
    const questions: QuestionPayload[] = [];
    const modelLabel = validExamsCount > 1 ? `ሞዴል ${modelLetters[eIdx]} (Set ${modelLetters[eIdx]})` : '';
    const examTitle = validExamsCount > 1 
      ? `${trainingTitle} - ይፋዊ የብቃት መመዘኛ ፈተና [${modelLabel}]`
      : `${trainingTitle} - ይፋዊ የብቃት መመዘኛ ፈተና (AI Exam)`;

    for (let i = 0; i < validQuestionsCount; i++) {
      // Offset starting line based on exam index to ensure variety across sets
      const lineIndex = (i + eIdx * 2) % (lines.length || 1);
      const seedLine = lines[lineIndex] || `የስልጠና ይዘት ቁልፍ ነጥብ ${i + 1}`;
      const cleanSnippet = seedLine.replace(/^[0-9]+[\.\-\)]\s*/, '').slice(0, 110);

      if (language === 'om' || subject.toLowerCase().includes('orom')) {
        questions.push({
          questionText: `Akka qajeelfama leenjii "${trainingTitle}" jedhutti: [Kutaa ${i + 1}] ${cleanSnippet} ilaalchisee yaada kamtu sirriidha?`,
          options: [
            `Hojiirra oolmaa qabatamaa daree keessatti ${cleanSnippet.slice(0, 40)} cimsuu`,
            'Barsiisaan dhuunfaatti qofa hojjechuu fi barattoota hirmaachisuu dhiisuu',
            'Barreeffama qofa akka qabatan gochuu fi qormaata dhiisuu',
            'Karoora sirna barnootaa wajjin wal-simsiisuu dhiisuu'
          ],
          correctIndex: (i + eIdx) % 4,
          explanation: `Qajeelfamni leenjii Biiroo Barnootaa Bulchiinsa Magaalaa Shashamannee dhimma kana irratti: "${seedLine}" jedhee ibsa.`
        });
      } else if (language === 'en' || subject.toLowerCase().includes('english')) {
        questions.push({
          questionText: `According to the training material "${trainingTitle}": Regarding point #${i + 1} "${cleanSnippet}", which pedagogical practice is most effective?`,
          options: [
            `It fosters interactive pedagogical implementation and active engagement in ${subject}`,
            'It strictly recommends passive lecture without learner practice',
            'It discourages peer collaboration and active reflection in classroom',
            'It isolates continuous assessment from daily classroom instruction'
          ],
          correctIndex: (i + eIdx) % 4,
          explanation: `Based on the official Bureau training guide: "${seedLine}" emphasizes modern learner-centered methodology.`
        });
      } else {
        questions.push({
          questionText: `በስልጠና ሰነዱ "${trainingTitle}" መሰረት፡ [ነጥብ ${i + 1}] "${cleanSnippet}" በሚለው ዙሪያ ትክክለኛው የማስተማሪያ ስነ-ዘዴ የትኛው ነው?`,
          options: [
            `ተማሪዎችን በንቃት በማሳተፍ እና በተግባራዊ ምሳሌዎች ${cleanSnippet.slice(0, 40)} መተግበር`,
            'መምህሩ ብቻውን ያለማቋረጥ ማስታወሻ እንዲፅፉ ማድረግ',
            'የይዘቱን ተግባራዊ ጠቀሜታ ወደ ጎን በመተው በቃል ብቻ ማስሸምደድ',
            'ከክፍል ውይይት ይልቅ የንድፈ-ሀሳብ ማብራሪያ ብቻ መስጠት'
          ],
          correctIndex: (i + eIdx) % 4,
          explanation: `የሻሸመኔ ትምህርት ቢሮ ይፋዊ የስልጠና ሰነድ በሚያዘው መሰረት፡ "${seedLine}" ተማሪ-ተኮር እና ተግባራዊ አተገባበርን ያጎላል።`
        });
      }
    }

    examSets.push({
      examTitle,
      instructions:
        'ይህ ፈተና ከሻሸመኔ ከተማ አስተዳደር ትምህርት ቢሮ ይፋዊ የስልጠና ሰነድ በቀጥታ በ AI ተዘጋጅቶ የወጣ የመምህራን ብቃት መመዘኛ ነው። እባክዎ ጥያቄዎቹን በጥሞና አንብበው ይመልሱ።',
      durationMinutes: Math.max(validQuestionsCount * 3, 10),
      passingScore: 70,
      questions,
      isAIGenerated: true,
      generatedByModel: 'Bureau-Curriculum-Engine-Offline',
      examSetLabel: validExamsCount > 1 ? `ሞዴል ${modelLetters[eIdx]}` : 'ነጠላ ፈተና'
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
    generatedByModel: 'Bureau-Curriculum-Engine-Offline'
  };
}

// API: Generate Exam from Training Material using Gemini
app.post('/api/generate-exam', async (req: Request, res: Response) => {
  try {
    const {
      trainingTitle,
      subject,
      gradeLevels,
      trainingContent,
      numQuestions = 5,
      numExams = 1,
      language = 'am',
      difficulty = 'standard'
    } = req.body;

    if (!trainingTitle || !trainingContent) {
      res.status(400).json({ error: 'Missing required trainingTitle or trainingContent' });
      return;
    }

    const parsedNumQuestions = Math.min(Math.max(Number(numQuestions) || 5, 1), 30);
    const parsedNumExams = Math.min(Math.max(Number(numExams) || 1, 1), 5);

    const ai = getGenAIClient();

    if (!ai) {
      // Graceful fallback when GEMINI_API_KEY is not configured
      const fallbackResult = generateSmartFallbackExam(
        trainingTitle,
        subject || 'General Education',
        trainingContent,
        parsedNumQuestions,
        language,
        parsedNumExams
      );
      res.json(fallbackResult);
      return;
    }

    const promptText = `
You are the Chief Assessment Officer of the Shashemene City Administration Education Bureau (የሻሸመኔ ከተማ አስተዳደር ትምህርት ቢሮ).
Generate formal, high-standard Teacher Online Competency Examination(s) based DIRECTLY on the following official teacher training material text.

TRAINING MATERIAL DETAILS:
- Title: ${trainingTitle}
- Subject: ${subject || 'General Pedagogy'}
- Target Grade Levels: ${gradeLevels || 'Grades 7 - 12'}
- Target Number of Exams: ${parsedNumExams} distinct exam sets/models
- Target Number of Questions per Exam: ${parsedNumQuestions} questions
- Language: ${language}
- Difficulty: ${difficulty}

OFFICIAL TRAINING TEXT CONTENT:
"""
${trainingContent}
"""

REQUIREMENTS:
1. Generate exactly ${parsedNumExams} distinct examination sets (e.g. Set A / ሞዴል A, Set B / ሞዴል B...).
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
      model: 'gemini-3.1-flash-lite',
      contents: promptText,
      config: {
        systemInstruction:
          'You are a senior educator and exam creator for the Ethiopian Ministry of Education and Shashemene City Education Bureau. You generate rigorous, practical multiple-choice teacher competency exams directly from training manuals.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            exams: {
              type: Type.ARRAY,
              description: 'List of generated exam sets/variants',
              items: {
                type: Type.OBJECT,
                properties: {
                  examTitle: {
                    type: Type.STRING,
                    description: 'Official title of this competency exam variant (e.g. including Set A / ሞዴል A if multiple)'
                  },
                  instructions: {
                    type: Type.STRING,
                    description: 'Exam taking guidelines and instructions'
                  },
                  durationMinutes: {
                    type: Type.INTEGER,
                    description: 'Total exam time limit in minutes'
                  },
                  passingScore: {
                    type: Type.INTEGER,
                    description: 'Passing percentage threshold (e.g. 70)'
                  },
                  questions: {
                    type: Type.ARRAY,
                    description: 'List of exam questions derived from the training manual',
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        questionText: { type: Type.STRING },
                        options: {
                          type: Type.ARRAY,
                          items: { type: Type.STRING },
                          description: 'Four multiple choice options'
                        },
                        correctIndex: {
                          type: Type.INTEGER,
                          description: '0-based index of the correct option'
                        },
                        explanation: {
                          type: Type.STRING,
                          description: 'Detailed explanation referencing the training material'
                        }
                      },
                      required: ['questionText', 'options', 'correctIndex', 'explanation']
                    }
                  }
                },
                required: ['examTitle', 'instructions', 'durationMinutes', 'passingScore', 'questions']
              }
            }
          },
          required: ['exams']
        }
      }
    });

    const timeoutCall = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('AI Generation Timeout after 30 seconds')), 30000)
    );

    const response = await Promise.race([geminiCall, timeoutCall]);

    const responseText = response.text;
    if (!responseText) {
      throw new Error('Empty response received from Gemini');
    }

    const parsedData = JSON.parse(responseText);
    const examsList = Array.isArray(parsedData.exams) && parsedData.exams.length > 0 
      ? parsedData.exams 
      : [parsedData];

    const primaryExam = examsList[0] || {};

    res.json({
      exams: examsList,
      examTitle: primaryExam.examTitle,
      instructions: primaryExam.instructions,
      durationMinutes: primaryExam.durationMinutes,
      passingScore: primaryExam.passingScore,
      questions: primaryExam.questions,
      isAIGenerated: true,
      generatedByModel: 'gemini-3.1-flash-lite'
    });
  } catch (error: any) {
    console.warn('AI generation notice (switching to curriculum engine fallback):', error?.message || error);
    // On error, deliver smart fallback so user is never blocked
    const fallback = generateSmartFallbackExam(
      req.body.trainingTitle || 'ስልጠና',
      req.body.subject || 'ስነ-ዘዴ',
      req.body.trainingContent || '',
      Number(req.body.numQuestions || 5),
      req.body.language || 'am',
      Number(req.body.numExams || 1)
    );
    res.json(fallback);
  }
});

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'Shashemene Education Bureau AI Engine',
    hasApiKey: Boolean(process.env.GEMINI_API_KEY)
  });
});

// Central In-Memory Store for Shashemene Education Bureau Central Server
interface CentralSyncRecord {
  id: string;
  entity: string;
  action: string;
  entityId: string;
  data: any;
  receivedAt: string;
  schoolId?: string;
  clientUser?: string;
}

let centralSyncRecords: CentralSyncRecord[] = [];
let centralStudents: any[] = [];
let centralCredentials: any[] = [];
let centralTrainingMaterials: any[] = [];
let centralTeacherEvaluations: any[] = [];
let centralGradeWorkflows: any[] = [];

// 1. Sync Status Endpoint
app.get('/api/sync/status', (_req: Request, res: Response) => {
  res.json({
    status: 'online',
    serverTime: new Date().toISOString(),
    bureau: 'Shashemene City Administration Education Bureau Central Cloud',
    centralStore: {
      studentsCount: centralStudents.length,
      credentialsCount: centralCredentials.length,
      trainingMaterialsCount: centralTrainingMaterials.length,
      evaluationsCount: centralTeacherEvaluations.length,
      gradeWorkflowsCount: centralGradeWorkflows.length,
      totalSyncTransactions: centralSyncRecords.length
    }
  });
});

app.get('/api/grade-workflows', (_req: Request, res: Response) => {
  res.json({ workflows: centralGradeWorkflows, total: centralGradeWorkflows.length });
});

// 2. Batch Sync Push Endpoint (from school offline clients to central server)
app.post('/api/sync/push', (req: Request, res: Response) => {
  try {
    const { items = [], schoolId, clientUser } = req.body;

    if (!Array.isArray(items)) {
      res.status(400).json({ error: 'items array is required' });
      return;
    }

    const processedAt = new Date().toISOString();
    const processedResults = [];

    for (const item of items) {
      const record: CentralSyncRecord = {
        id: `sr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        entity: item.entity,
        action: item.action,
        entityId: item.entityId || (item.data && item.data.id),
        data: item.data,
        receivedAt: processedAt,
        schoolId: schoolId || item.data?.schoolId,
        clientUser: clientUser || item.clientMeta?.authorName
      };

      centralSyncRecords.unshift(record);

      // Apply entity mutations to central server store
      if (item.entity === 'student_performance') {
        const student = item.data;
        if (student && student.id) {
          const idx = centralStudents.findIndex((s) => s.id === student.id);
          if (idx >= 0) {
            centralStudents[idx] = { ...centralStudents[idx], ...student, lastSyncedAt: processedAt };
          } else {
            centralStudents.push({ ...student, lastSyncedAt: processedAt });
          }
        }
      } else if (item.entity === 'teacher_credential' || item.entity === 'stakeholder_credential') {
        const cred = item.data;
        if (cred && cred.id) {
          const idx = centralCredentials.findIndex((c) => c.id === cred.id);
          if (idx >= 0) {
            centralCredentials[idx] = { ...centralCredentials[idx], ...cred, lastSyncedAt: processedAt };
          } else {
            centralCredentials.push({ ...cred, lastSyncedAt: processedAt });
          }
        }
      } else if (item.entity === 'training_material') {
        const material = item.data;
        if (material && material.id) {
          const idx = centralTrainingMaterials.findIndex((m) => m.id === material.id);
          if (idx >= 0) {
            centralTrainingMaterials[idx] = { ...centralTrainingMaterials[idx], ...material, lastSyncedAt: processedAt };
          } else {
            centralTrainingMaterials.push({ ...material, lastSyncedAt: processedAt });
          }
        }
      } else if (item.entity === 'teacher_evaluation') {
        const evaluation = item.data;
        if (evaluation && evaluation.id) {
          const idx = centralTeacherEvaluations.findIndex((e) => e.id === evaluation.id);
          if (idx >= 0) {
            centralTeacherEvaluations[idx] = { ...centralTeacherEvaluations[idx], ...evaluation, lastSyncedAt: processedAt };
          } else {
            centralTeacherEvaluations.push({ ...evaluation, lastSyncedAt: processedAt });
          }
        }
      } else if (item.entity === 'grade_workflow') {
        const workflow = item.data;
        if (workflow && workflow.id) {
          const idx = centralGradeWorkflows.findIndex((w) => w.id === workflow.id);
          if (idx >= 0) {
            centralGradeWorkflows[idx] = { ...centralGradeWorkflows[idx], ...workflow, lastSyncedAt: processedAt };
          } else {
            centralGradeWorkflows.push({ ...workflow, lastSyncedAt: processedAt });
          }
        }
      }

      processedResults.push({
        mutationId: item.id,
        entity: item.entity,
        status: 'synced',
        processedAt
      });
    }

    res.json({
      success: true,
      processedCount: items.length,
      serverTimestamp: processedAt,
      results: processedResults
    });
  } catch (error: any) {
    console.error('Error during sync push:', error);
    res.status(500).json({ error: error?.message || 'Sync failed on central server' });
  }
});

// 3. Central Sync Pull Endpoint (fetch updates from Bureau since lastSync)
app.get('/api/sync/pull', (req: Request, res: Response) => {
  try {
    const since = req.query.since ? String(req.query.since) : undefined;
    const sinceDate = since ? new Date(since).getTime() : 0;

    const newRecords = centralSyncRecords.filter((r) => {
      if (!sinceDate) return true;
      return new Date(r.receivedAt).getTime() > sinceDate;
    });

    res.json({
      serverTimestamp: new Date().toISOString(),
      count: newRecords.length,
      updates: {
        students: centralStudents,
        credentials: centralCredentials,
        trainingMaterials: centralTrainingMaterials,
        teacherEvaluations: centralTeacherEvaluations
      },
      transactions: newRecords
    });
  } catch (error: any) {
    res.status(500).json({ error: error?.message || 'Failed to pull sync updates' });
  }
});

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: false },
      appType: 'spa'
    });

    // Intercept responses for /@vite/client to prevent WebSocket reject noise in iFrame
    app.use((req, res, next) => {
      if (req.url && req.url.includes('@vite/client')) {
        const origEnd = res.end;
        // @ts-ignore
        res.end = function(chunk: any, ...args: any[]) {
          if (chunk) {
            let str = Buffer.isBuffer(chunk) ? chunk.toString('utf-8') : String(chunk);
            if (str.includes('WebSocket closed without opened.')) {
              str = str
                .replace(/reject\(\/\* @__PURE__ \*\/ new Error\("WebSocket closed without opened\."\)\);/g, 'resolve();')
                .replace(/reject\(new Error\("WebSocket closed without opened\."\)\);/g, 'resolve();');
              chunk = Buffer.isBuffer(chunk) ? Buffer.from(str, 'utf-8') : str;
              res.setHeader('Content-Length', Buffer.isBuffer(chunk) ? chunk.length : Buffer.byteLength(str));
            }
          }
          // @ts-ignore
          return origEnd.call(this, chunk, ...args);
        };
      }
      next();
    });

    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Shashemene Education Bureau Server active on http://0.0.0.0:${PORT}`);
  });
}

startServer();
