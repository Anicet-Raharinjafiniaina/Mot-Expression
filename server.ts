import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialize Gemini client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY || "",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Health endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", app: "Vocab", timestamp: new Date().toISOString() });
});

// AI Endpoint: Explore/Generate custom word or expression with Malagasy translation
app.post("/api/vocab/explore", async (req, res) => {
  try {
    const { term, language, category } = req.body;
    const ai = getGeminiClient();

    const targetLang = language === "en" ? "English" : "French";
    const prompt = `You are an expert linguist and translator specializing in ${targetLang} and Malagasy (Teny Malagasy).
Analyze or generate a rich vocabulary entry for: "${term || 'a relevant advanced/useful word in category: ' + category}".
The source language is ${targetLang}. Provide accurate, high-quality definitions, contextual explanations, real-life examples, and comprehensive translations and explanations in standard Malagasy (Teny Malagasy of Madagascar).

Return a JSON object strictly matching this schema:
{
  "term": "the word or expression in ${targetLang}",
  "type": "word" or "expression",
  "partOfSpeech": "e.g. nom féminin / noun / expression idiomatique",
  "phonetic": "IPA transcription e.g. /.../",
  "language": "${language || 'fr'}",
  "definition": "Clear, elegant definition in ${targetLang}",
  "explanation": "Detailed explanation of nuances, connotation, and when to use it in ${targetLang}",
  "example": "A realistic, contemporary contextual sentence in ${targetLang}",
  "exampleTranslation": "Translation of the example sentence in French/English",
  "synonyms": ["synonym1", "synonym2"],
  "malagasy": {
    "translation": "Direct and accurate translation in Malagasy",
    "explanation": "Clear explanation in Malagasy (Fanazavana amin'ny teny malagasy ny dikan'ity teny ity sy ny fomba fampiasana azy)",
    "exampleInMalagasy": "Translation of the example sentence in Malagasy",
    "culturalNote": "Optional cultural note or equivalent Malagasy proverb/idiom (ohabolana na fitenenana mitovy lenta)",
    "synonymsMalagasy": ["malagasy_synonym_1", "malagasy_synonym_2"]
  },
  "quizQuestion": {
    "question": "A multiple-choice question testing this word/expression (in ${targetLang} or Malagasy)",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctIndex": 0,
    "explanation": "Explanation of the correct answer"
  }
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            term: { type: Type.STRING },
            type: { type: Type.STRING },
            partOfSpeech: { type: Type.STRING },
            phonetic: { type: Type.STRING },
            language: { type: Type.STRING },
            definition: { type: Type.STRING },
            explanation: { type: Type.STRING },
            example: { type: Type.STRING },
            exampleTranslation: { type: Type.STRING },
            synonyms: { type: Type.ARRAY, items: { type: Type.STRING } },
            malagasy: {
              type: Type.OBJECT,
              properties: {
                translation: { type: Type.STRING },
                explanation: { type: Type.STRING },
                exampleInMalagasy: { type: Type.STRING },
                culturalNote: { type: Type.STRING },
                synonymsMalagasy: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
              required: ["translation", "explanation", "exampleInMalagasy"],
            },
            quizQuestion: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                options: { type: Type.ARRAY, items: { type: Type.STRING } },
                correctIndex: { type: Type.INTEGER },
                explanation: { type: Type.STRING },
              },
              required: ["question", "options", "correctIndex", "explanation"],
            },
          },
          required: ["term", "type", "partOfSpeech", "definition", "explanation", "example", "malagasy"],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error("Gemini Explore Error:", error);
    res.status(500).json({ success: false, error: error.message || "Failed to generate vocabulary entry" });
  }
});

// AI Endpoint: Ask a language question or translation question (Malagasy assistance)
app.post("/api/vocab/ask", async (req, res) => {
  try {
    const { question, language } = req.body;
    const ai = getGeminiClient();

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: `You are Vocab's friendly Malagasy-French-English linguistic tutor.
The user is asking: "${question}"
User's target learning language: ${language === 'en' ? 'English' : 'French'}.
Provide a helpful, precise, culturally grounded answer with clear explanations, practical examples, and explicit Malagasy translations/equivalents (fanazavana amin'ny teny malagasy). Structure your response clearly with markdown headings, bullet points, and highlight key terms.`,
    });

    res.json({ success: true, answer: response.text });
  } catch (error: any) {
    console.error("Gemini Ask Error:", error);
    res.status(500).json({ success: false, error: error.message || "Failed to answer question" });
  }
});

// Vite middleware for dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Vocab server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
