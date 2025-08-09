import multer from 'multer';
import pdfParse from 'pdf-parse';
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

// In-memory store for parsed data
let parsedResumeCache = null;
let generatedQuestionsCache = [];

// Multer config: use RAM only
export const storage = multer.memoryStorage();
export const upload = multer({ storage: storage });

/**
 * Upload & parse resume PDF
 */
export async function uploadResume(req, res) {
  const pdfParse = (await import('pdf-parse')).default; 
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded! Please attach a PDF resume." });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY_Parse);

    const pdfBuffer = req.file.buffer;

    // Extract text
    const pdfData = await pdfParse(pdfBuffer);
    const resumeText = pdfData.text;

    if (!resumeText || resumeText.trim() === '') {
      return res.status(400).json({ message: "Uploaded PDF has no readable text." });
    }

    // Parse the resume with Gemini
    const parsePrompt = `
      Parse this resume and extract:
      - Skills
      - Education
      - Work Experience
      - Projects
      - Domain Knowledge
      - Certificates

      Resume:
      ${resumeText}
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const parseResult = await model.generateContent(parsePrompt);
    const parsed = (await parseResult.response).text();

    parsedResumeCache = parsed;

    res.status(200).json({
      message: 'Resume parsed successfully.',
      parsedResume: parsed
    });

  } catch (err) {
    console.error("[uploadResume] Error:", err);
    res.status(500).json({ message: "Error parsing resume. Please check your PDF." });
  }
}

/**
 * Generate questions from parsed resume
 */
export async function getQuestions(req, res) {
  const {company,role,numQuestions}=req.body
  try {
    if (!parsedResumeCache) {
      return res.status(400).json({ message: "No parsed resume found. Upload a resume first." });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY_getQuestions);

    const generatePrompt = `
      Based on the following resume:
      ${parsedResumeCache}


      Generate exactly ${numQuestions} customized technical and behavioral interview questions focsing mainly on technologies he know and technologies he used in project asking the aproches for a problem and time complixeties. and opps concepts and cs fundametalets make sure u cover all the areas 
      Number them clearly in a list only question no extra data .
      i am applying for ${role} role at ${company} company.
      if not mentioned role or company then generate questions based on the resume content only.
      the question should be simple and easy to understand.and should be more focused on the technical ascepts like oops concepts and cs fundamentals and 10%- 20 % on projects and domain knowledge.
      why you are making questions so lenghtly and complex make it simple and easy to understand. and questions should be straight forwars for 70% and only 30% questions based on projects and architecture for example if the user knows react  the question should be"what are the kwy fetures of react,components ,use effect etc.if he knows java explain poly moproshims compare its types etc if he mention sql write a querly like this
      OUTPUT: Respond ONLY with a numbered list of questions, one per line
      dont comine 2 or more questions in as single question ask one question at a time.
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const questionsResult = await model.generateContent(generatePrompt);
    const questionsText = (await questionsResult.response).text();
    console.log("[getQuestions] Generated questions:", questionsText);

    const questionsArray = questionsText
      .split('\n')
      .filter(line => line.trim() !== '')
      .map(q => q.replace(/^\d+[\.\)]?\s*/, '').trim());
    console.log("[getQuestions] Parsed questions:", questionsArray);
    generatedQuestionsCache = questionsArray;

    res.status(200).json({
      questions: questionsArray
    });

  } catch (error) {
    console.error("[getQuestions] Error:", error);
    res.status(500).json({ message: "Error generating questions." });
  }
}

/**
 * Evaluate submitted answers
 * Input: [{ q: "...", a: "..." }]
 */


export async function submitAnswers(req, res) {
  try {
    const { answers } = req.body;
    console.log("[submitAnswers] Received answers:", answers);

    if (!Array.isArray(answers) || answers.length === 0) {
      return res
        .status(400)
        .json({ message: "Invalid format: 'answers' must be a non-empty array." });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY_submitAnswers);

    const formattedAnswers = answers
      .map(
        (item, idx) => `Q${idx + 1}: ${item.q}\nA: ${item.a || "[No answer]"}`
      )
      .join('\n\n');

    const evalPrompt = `
      You are an experienced interviewer.

      Evaluate the answers below.

      For each answer:
      - Include:
        - "question": original question
        - "yourAnswer": candidate's answer
        - "feedback": your feedback 
        - "score": 0-10
Note: for feeback first give the answer for the question and then explain what ur missing in the answer and what he can improve and what he did well and what he can do better next time.
      After all answers, add:
      - "overallScore": average score scaled to 100

      OUTPUT: Respond ONLY with valid JSON in this shape:
      {
        "evaluations": [
          { "question": "...", "yourAnswer": "...", "feedback": "...", "score": 7 },
          ...
        ],
        "overallScore": 82
      } 
        NOTE:"IRRESPECTIVE OF ANSWERS FIRST GIVE ANSWER FOR THE QUESTION AND THEN GIVE FEEDBACK AND SCORE AND OVERALL SCORE AT THE END.
      DO NOT add any commentary, code blocks, or text outside the JSON.

      Answers:
      ${formattedAnswers}
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const evalResult = await model.generateContent(evalPrompt);
    const raw = (await evalResult.response).text();

    console.log("[submitAnswers] Raw LLM output:", raw);

    
    const jsonMatch = raw.match(/{[\s\S]*}/);
    if (!jsonMatch) {
      throw new Error("LLM did not return JSON!");
    }

    const cleanJson = jsonMatch[0];
    const parsed = JSON.parse(cleanJson);

    console.log("[submitAnswers] Parsed JSON:", parsed);

    res.status(200).json(parsed);
  } catch (error) {
    console.error("[submitAnswers] Error:", error);
    res.status(500).json({ message: "Error evaluating answers.", error: error.toString() });
  }
}
