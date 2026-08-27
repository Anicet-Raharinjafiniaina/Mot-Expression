import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

// TLS workaround for local dev networks:
// When run behind a proxy / SSL-inspection filter, outgoing HTTPS calls to the
// Gemini API can be intercepted with a self-signed certificate. Node rejects
// it by default, which surfaces as a generic "fetch failed" (500 on /api/vocab/ask).
// The @google/genai SDK does not expose a TLS/agent option in httpOptions, so we
// toggle Node's global cert check here. Only enabled explicitly via .env flag.
// In production, prefer a trusted CA or NODE_EXTRA_CA_CERTS instead.
if (process.env.GEMINI_INSECURE_TLS === "true") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

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

// In-memory cache of generated daily entries so the same date is not regenerated
// (cost saving + consistent content within a running server session).
const dailyEntryCache = new Map<string, any>();

// Health endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", app: "Mot-Expression", timestamp: new Date().toISOString() });
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
  "frenchTranslation": "When the source language is English, provide the French translation of the term/expression with a short French gloss. Omit or set to empty string when the source language is French.",
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
      model: "gemini-3.6-flash",
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
            frenchTranslation: { type: Type.STRING },
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
    console.error("Gemini Explore cause:", error?.cause || error);
    res
      .status(500)
      .json({ success: false, error: error?.cause?.message || error.message || "Failed to generate vocabulary entry" });
  }
});

// AI Endpoint: Generate a complete daily entry (word + expression, FR & EN, + quiz)
// for an arbitrary date, so the "mot du jour / expression du jour" change every day.
app.post("/api/vocab/daily", async (req, res) => {
  try {
    const { date, language } = req.body;
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res
        .status(400)
        .json({ success: false, error: "A valid date (YYYY-MM-DD) is required" });
    }

    // Return the cached build for the same date without hitting Gemini again.
    const cached = dailyEntryCache.get(date);
    if (cached) return res.json({ success: true, data: cached });

    const ai = getGeminiClient();
    const targetLang = language === "en" ? "English" : "French";

    const prompt = `You are an expert trilingual linguist (${targetLang}, English, and Malagasy / Teny Malagasy) curating a daily language-learning entry.

Today's date is ${date}. Create a THEMED daily lesson for this specific date (pick a fresh theme/semantic field derived from the date to guarantee variety between days) containing:
1. A French word of the day (obsolete, advanced or really useful word in French).
2. A French idiomatic expression of the day.
3. An English word of the day (different from the French word).
4. An English idiom of the day (different from the French idiom).
Each with a precise definition/explanation, a realistic contemporary example, a French translation (for the English items) and a thorough explanation + translation in Malagasy (with cultural note / ohabolana when relevant and Malagasy synonyms).

Finally produce 4 quiz questions (2 FR, 2 EN) mixing definition, usage/context and Malagasy-translation questions about the four terms above; correctIndex is the 0-based index of the correct option.

Return a single JSON object strictly matching this schema:
{
  "date": "${date}",
  "fr": {
    "word": {
      "id": "fr-${date}-w",
      "date": "${date}",
      "language": "fr",
      "term": "...",
      "partOfSpeech": "e.g. nom féminin",
      "phonetic": "/.../",
      "definition": "...",
      "explanation": "...",
      "example": "...",
      "exampleTranslation": "...",
      "synonyms": ["..."],
      "etymology": "...",
      "difficulty": "Débutant | Intermédiaire | Avancé",
      "malagasy": { "translation": "...", "explanation": "...", "exampleInMalagasy": "...", "culturalNote": "...", "synonymsMalagasy": ["..."], "proverbEquivalent": "..." }
    },
    "expression": {
      "id": "fr-${date}-e",
      "date": "${date}",
      "language": "fr",
      "term": "...",
      "register": "...",
      "origin": "...",
      "explanation": "...",
      "context": "...",
      "example": "...",
      "exampleTranslation": "...",
      "malagasy": { "translation": "...", "explanation": "...", "exampleInMalagasy": "...", "culturalNote": "...", "synonymsMalagasy": ["..."], "proverbEquivalent": "..." }
    }
  },
  "en": {
    "word": { "id": "en-${date}-w", "language": "en", "partOfSpeech": "noun/verb/...", "term": "...", "definition": "...", "explanation": "...", "example": "...", "exampleTranslation": "...", "frenchTranslation": "...", "synonyms": ["..."], "malagasy": { "translation": "...", "explanation": "...", "exampleInMalagasy": "...", "culturalNote": "..." } },
    "expression": { "id": "en-${date}-e", "language": "en", "term": "...", "explanation": "...", "context": "...", "example": "...", "exampleTranslation": "...", "frenchTranslation": "...", "malagasy": { "translation": "...", "explanation": "...", "exampleInMalagasy": "..." } }
  },
  "quiz": [
    { "id": "q-${date}-1", "type": "definition", "language": "fr", "targetTerm": "...", "question": "...", "options": ["a","b","c","d"], "correctIndex": 0, "explanation": "...", "malagasyExplanation": "..." },
    { "id": "q-${date}-2", "type": "malagasy", "language": "fr", "targetTerm": "...", "question": "...", "options": ["a","b","c","d"], "correctIndex": 0, "explanation": "...", "malagasyExplanation": "..." },
    { "id": "q-${date}-3", "type": "context", "language": "en", "targetTerm": "...", "question": "...", "options": ["a","b","c","d"], "correctIndex": 0, "explanation": "...", "malagasyExplanation": "..." },
    { "id": "q-${date}-4", "type": "definition", "language": "en", "targetTerm": "...", "question": "...", "options": ["a","b","c","d"], "correctIndex": 0, "explanation": "...", "malagasyExplanation": "..." }
  ]
}`;

    const wordItemSchema = {
      type: Type.OBJECT,
      properties: {
        id: { type: Type.STRING },
        date: { type: Type.STRING },
        language: { type: Type.STRING },
        term: { type: Type.STRING },
        partOfSpeech: { type: Type.STRING },
        phonetic: { type: Type.STRING },
        definition: { type: Type.STRING },
        explanation: { type: Type.STRING },
        example: { type: Type.STRING },
        exampleTranslation: { type: Type.STRING },
        frenchTranslation: { type: Type.STRING },
        synonyms: { type: Type.ARRAY, items: { type: Type.STRING } },
        etymology: { type: Type.STRING },
        difficulty: { type: Type.STRING },
        malagasy: {
          type: Type.OBJECT,
          properties: {
            translation: { type: Type.STRING },
            explanation: { type: Type.STRING },
            exampleInMalagasy: { type: Type.STRING },
            culturalNote: { type: Type.STRING },
            synonymsMalagasy: { type: Type.ARRAY, items: { type: Type.STRING } },
            proverbEquivalent: { type: Type.STRING },
          },
          required: ["translation", "explanation", "exampleInMalagasy"],
        },
      },
      required: ["id", "date", "language", "term", "partOfSpeech", "definition", "explanation", "example", "exampleTranslation", "malagasy"],
    };

    const expressionItemSchema = {
      type: Type.OBJECT,
      properties: {
        id: { type: Type.STRING },
        date: { type: Type.STRING },
        language: { type: Type.STRING },
        term: { type: Type.STRING },
        register: { type: Type.STRING },
        origin: { type: Type.STRING },
        explanation: { type: Type.STRING },
        context: { type: Type.STRING },
        example: { type: Type.STRING },
        exampleTranslation: { type: Type.STRING },
        frenchTranslation: { type: Type.STRING },
        malagasy: {
          type: Type.OBJECT,
          properties: {
            translation: { type: Type.STRING },
            explanation: { type: Type.STRING },
            exampleInMalagasy: { type: Type.STRING },
            culturalNote: { type: Type.STRING },
            synonymsMalagasy: { type: Type.ARRAY, items: { type: Type.STRING } },
            proverbEquivalent: { type: Type.STRING },
          },
          required: ["translation", "explanation", "exampleInMalagasy"],
        },
      },
      required: ["id", "date", "language", "term", "explanation", "context", "example", "exampleTranslation", "malagasy"],
    };

    const quizQuestionSchema = {
      type: Type.OBJECT,
      properties: {
        id: { type: Type.STRING },
        type: { type: Type.STRING },
        language: { type: Type.STRING },
        targetTerm: { type: Type.STRING },
        question: { type: Type.STRING },
        options: { type: Type.ARRAY, items: { type: Type.STRING } },
        correctIndex: { type: Type.INTEGER },
        explanation: { type: Type.STRING },
        malagasyExplanation: { type: Type.STRING },
      },
      required: ["id", "type", "language", "targetTerm", "question", "options", "correctIndex", "explanation", "malagasyExplanation"],
    };

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            date: { type: Type.STRING },
            fr: {
              type: Type.OBJECT,
              properties: {
                word: wordItemSchema,
                expression: expressionItemSchema,
              },
              required: ["word", "expression"],
            },
            en: {
              type: Type.OBJECT,
              properties: {
                word: wordItemSchema,
                expression: expressionItemSchema,
              },
              required: ["word", "expression"],
            },
            quiz: { type: Type.ARRAY, items: quizQuestionSchema },
          },
          required: ["date", "fr", "en", "quiz"],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");

    // Normalize ids/fields so favorites & "learned" markers stay consistent per date.
    if (parsed?.fr?.word) {
      parsed.fr.word.id = `fr-${date}-w`;
      parsed.fr.word.date = date;
      parsed.fr.word.language = "fr";
    }
    if (parsed?.fr?.expression) {
      parsed.fr.expression.id = `fr-${date}-e`;
      parsed.fr.expression.date = date;
      parsed.fr.expression.language = "fr";
    }
    if (parsed?.en?.word) {
      parsed.en.word.id = `en-${date}-w`;
      parsed.en.word.date = date;
      parsed.en.word.language = "en";
    }
    if (parsed?.en?.expression) {
      parsed.en.expression.id = `en-${date}-e`;
      parsed.en.expression.date = date;
      parsed.en.expression.language = "en";
    }
    if (Array.isArray(parsed?.quiz)) {
      parsed.quiz = parsed.quiz.map((q: any, i: number) => ({
        ...q,
        id: q.id || `q-${date}-${i + 1}`,
        language: q.language === "en" ? "en" : "fr",
      }));
    }

    dailyEntryCache.set(date, parsed);
    res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error("Gemini Daily Error:", error);
    console.error("Gemini Daily cause:", error?.cause || error);
    res
      .status(500)
      .json({ success: false, error: error?.cause?.message || error.message || "Failed to generate daily entry" });
  }
});

// AI Endpoint: Ask a language question or translation question (Malagasy assistance)
app.post("/api/vocab/ask", async (req, res) => {
  try {
    const { question, language } = req.body;
    const ai = getGeminiClient();

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: `You are Mot-Expression's friendly Malagasy-French-English linguistic tutor.
The user is asking: "${question}"
User's target learning language: ${language === 'en' ? 'English' : 'French'}.
Provide a helpful, precise, culturally grounded answer with clear explanations, practical examples, and explicit Malagasy translations/equivalents (fanazavana amin'ny teny malagasy). Structure your response clearly with markdown headings, bullet points, and highlight key terms.`,
    });

    res.json({ success: true, answer: response.text });
  } catch (error: any) {
    console.error("Gemini Ask Error:", error);
    console.error("Gemini Ask cause:", error?.cause || error);
    res
      .status(500)
      .json({ success: false, error: error?.cause?.message || error.message || "Failed to answer question" });
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
    console.log(`Mot-Expression server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
