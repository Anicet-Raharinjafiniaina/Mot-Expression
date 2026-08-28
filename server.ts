import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import Groq from "groq-sdk";
import { createServer as createViteServer } from "vite";

dotenv.config();

// TLS workaround for local dev networks:
// When run behind a proxy / SSL-inspection filter, outgoing HTTPS calls to the
// LLM API (Groq) can be intercepted with a self-signed certificate. Node rejects
// it by default, which surfaces as a generic "fetch failed" (500 on /api/vocab/*).
// Only enabled explicitly via .env flag. In production, prefer a trusted CA.
if (process.env.LLM_INSECURE_TLS === "true" || process.env.GEMINI_INSECURE_TLS === "true") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// The Groq model used for all generation (configurable via GROQ_MODEL).
const GROQ_MODEL = process.env.GROQ_MODEL || "openai/gpt-oss-120b";

// Lazy-initialize Groq client
let aiClient: Groq | null = null;
function getGroqClient(): Groq {
  if (!aiClient) {
    aiClient = new Groq({
      apiKey: process.env.GROQ_API_KEY || "",
    });
  }
  return aiClient;
}

/**
 * Sends a chat completion to Groq and returns the raw text content.
 *
 * - `json=true` asks for a plain JSON object (loose).
 * - `schema` asks for STRICT structured output (JSON Schema): the model is forced
 *   to return the exact shape, so required sections can't be dropped/truncated
 *   the way a free-form json_object can be.
 * Prefer supplying `schema` whenever the caller needs a specific structure.
 */
async function groqChat(
  system: string,
  user: string,
  opts: { json?: boolean; schema?: Record<string, unknown>; maxTokens?: number } = {}
): Promise<string> {
  const { json = false, schema, maxTokens } = opts;
  const client = getGroqClient();
  const res = await client.chat.completions.create({
    model: GROQ_MODEL,
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
    temperature: 0.7,
    ...(maxTokens ? { max_completion_tokens: maxTokens } : {}),
    response_format: schema
      ? {
          type: "json_schema" as const,
          json_schema: {
            name: "structured_output",
            strict: true,
            schema: schema as any,
          },
        }
      : json
        ? { type: "json_object" as const }
        : undefined,
  });
  const content = res.choices?.[0]?.message?.content;
  if (!content) throw new Error("Empty response from Groq");
  return content;
}

/** Attempts to parse a JSON payload from a model reply, tolerating markdown fences. */
function parseJson(content: string): any {
  const trimmed = (content || "").trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    const fence = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (fence) return JSON.parse(fence[1]);
    const start = trimmed.indexOf("{");
    const end = trimmed.lastIndexOf("}");
    if (start !== -1 && end > start) {
      return JSON.parse(trimmed.slice(start, end + 1));
    }
  }
  throw new Error("Could not parse JSON from model response");
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

    const targetLang = language === "en" ? "English" : "French";
    const system = `You are an expert linguist and translator specializing in ${targetLang} and Malagasy (Teny Malagasy).`;
    const prompt = `Analyze or generate a rich vocabulary entry for: "${term || 'a relevant advanced/useful word in category: ' + category}".
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

    const exploreSchema: Record<string, unknown> = {
      type: "object",
      additionalProperties: false,
      properties: {
        term: { type: "string" },
        type: { type: "string" },
        partOfSpeech: { type: "string" },
        phonetic: { type: "string" },
        language: { type: "string" },
        definition: { type: "string" },
        explanation: { type: "string" },
        example: { type: "string" },
        exampleTranslation: { type: "string" },
        frenchTranslation: { type: "string" },
        synonyms: { type: "array", items: { type: "string" } },
        malagasy: {
          type: "object",
          additionalProperties: false,
          properties: {
            translation: { type: "string" },
            explanation: { type: "string" },
            exampleInMalagasy: { type: "string" },
            culturalNote: { type: "string" },
            synonymsMalagasy: { type: "array", items: { type: "string" } },
          },
          required: ["translation", "explanation", "exampleInMalagasy", "culturalNote", "synonymsMalagasy"],
        },
        quizQuestion: {
          type: "object",
          additionalProperties: false,
          properties: {
            question: { type: "string" },
            options: { type: "array", items: { type: "string" } },
            correctIndex: { type: "integer" },
            explanation: { type: "string" },
          },
          required: ["question", "options", "correctIndex", "explanation"],
        },
      },
      required: ["term", "type", "partOfSpeech", "phonetic", "language", "definition", "explanation", "example", "exampleTranslation", "frenchTranslation", "synonyms", "malagasy", "quizQuestion"],
    };

    // WARNING: keep max_completion_tokens conservative. On Groq's free/on_demand
    // tier, gpt-oss-120b has an 8000 TPM limit, and max_completion_tokens counts
    // as a token reservation toward that limit. Reserving 16000 (as before)
    // pushed the request over the limit (Requested 16887 > Limit 8000) → error 413.
    // A single vocab entry is far smaller than the daily bulk (which uses 5000),
    // so 5000 leaves enough headroom against the 8000 TPM cap.
    const response = await groqChat(system, prompt, { schema: exploreSchema, maxTokens: 5000 });

    const parsed = parseJson(response);
    res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error("Groq Explore Error:", error);
    console.error("Groq Explore cause:", error?.cause || error);
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

    const targetLang = language === "en" ? "English" : "French";
    const system = `You are an expert trilingual linguist (${targetLang}, English, and Malagasy / Teny Malagasy) curating a daily language-learning entry.`;

    const prompt = `Date: ${date}. Create a THEMED daily lesson (fresh theme/semantic field derived from the date) with:
- one French word (useful/advanced), one French idiom,
- one English word (different from the French), one English idiom (different from the French).
Each item: concise but complete definition/explanation, realistic contemporary example, French translation for English items, and a thorough explanation + translation + cultural note/ohabolana + synonyms in Malagasy.
Also produce EXACTLY 4 quiz questions (2 FR, 2 EN) mixing definition, usage/context and Malagasy-translation about the four terms; correctIndex is the 0-based index of the correct option.
Output only a compact JSON object conforming exactly to the required schema.`;

    const malagasySchema: Record<string, unknown> = {
      type: "object",
      additionalProperties: false,
      properties: {
        translation: { type: "string" },
        explanation: { type: "string" },
        exampleInMalagasy: { type: "string" },
        culturalNote: { type: "string" },
        synonymsMalagasy: { type: "array", items: { type: "string" } },
        proverbEquivalent: { type: "string" },
      },
      required: ["translation", "explanation", "exampleInMalagasy", "culturalNote", "synonymsMalagasy", "proverbEquivalent"],
    };

    const wordItemSchema: Record<string, unknown> = {
      type: "object",
      additionalProperties: false,
      properties: {
        id: { type: "string" },
        date: { type: "string" },
        language: { type: "string" },
        term: { type: "string" },
        partOfSpeech: { type: "string" },
        phonetic: { type: "string" },
        definition: { type: "string" },
        explanation: { type: "string" },
        example: { type: "string" },
        exampleTranslation: { type: "string" },
        frenchTranslation: { type: "string" },
        synonyms: { type: "array", items: { type: "string" } },
        etymology: { type: "string" },
        difficulty: { type: "string" },
        malagasy: malagasySchema,
      },
      required: ["id", "date", "language", "term", "partOfSpeech", "phonetic", "definition", "explanation", "example", "exampleTranslation", "frenchTranslation", "synonyms", "etymology", "difficulty", "malagasy"],
    };

    const expressionItemSchema: Record<string, unknown> = {
      type: "object",
      additionalProperties: false,
      properties: {
        id: { type: "string" },
        date: { type: "string" },
        language: { type: "string" },
        term: { type: "string" },
        register: { type: "string" },
        origin: { type: "string" },
        explanation: { type: "string" },
        context: { type: "string" },
        example: { type: "string" },
        exampleTranslation: { type: "string" },
        frenchTranslation: { type: "string" },
        malagasy: malagasySchema,
      },
      required: ["id", "date", "language", "term", "register", "origin", "explanation", "context", "example", "exampleTranslation", "frenchTranslation", "malagasy"],
    };

    const quizQuestionSchema: Record<string, unknown> = {
      type: "object",
      additionalProperties: false,
      properties: {
        id: { type: "string" },
        type: { type: "string" },
        language: { type: "string" },
        targetTerm: { type: "string" },
        question: { type: "string" },
        options: { type: "array", items: { type: "string" } },
        correctIndex: { type: "integer" },
        explanation: { type: "string" },
        malagasyExplanation: { type: "string" },
      },
      required: ["id", "type", "language", "targetTerm", "question", "options", "correctIndex", "explanation", "malagasyExplanation"],
    };

    const dailySchema: Record<string, unknown> = {
      type: "object",
      additionalProperties: false,
      properties: {
        date: { type: "string" },
        fr: {
          type: "object",
          additionalProperties: false,
          properties: { word: wordItemSchema, expression: expressionItemSchema },
          required: ["word", "expression"],
        },
        en: {
          type: "object",
          additionalProperties: false,
          properties: { word: wordItemSchema, expression: expressionItemSchema },
          required: ["word", "expression"],
        },
        quiz: { type: "array", items: quizQuestionSchema },
      },
      required: ["date", "fr", "en", "quiz"],
    };

    let parsed: any = null;
    let lastError: any = null;
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        if (attempt > 0) await new Promise((r) => setTimeout(r, 800 * attempt));
        const response = await groqChat(system, prompt, { schema: dailySchema, maxTokens: 5000 });
        const candidate = parseJson(response);

        // Validate that the model returned every required section before accepting.
        if (
          !candidate ||
          candidate.date !== date ||
          !candidate.fr?.word?.term ||
          !candidate.fr?.expression?.term ||
          !candidate.en?.word?.term ||
          !candidate.en?.expression?.term ||
          !Array.isArray(candidate.quiz) ||
          candidate.quiz.length < 1
        ) {
          throw new Error("Generated daily entry is missing required sections");
        }
        parsed = candidate;
        break;
      } catch (err: any) {
        lastError = err;
        console.error(`Groq Daily attempt ${attempt + 1} failed:`, err?.message || err);
      }
    }

    if (!parsed) {
      throw new Error(lastError?.message || "Failed to generate daily entry");
    }

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
    console.error("Groq Daily Error:", error);
    console.error("Groq Daily cause:", error?.cause || error);
    res
      .status(500)
      .json({ success: false, error: error?.cause?.message || error.message || "Failed to generate daily entry" });
  }
});

// AI Endpoint: Ask a language question or translation question (Malagasy assistance)
app.post("/api/vocab/ask", async (req, res) => {
  try {
    const { question, language } = req.body;

    const system = "You are Mot-Expression's friendly Malagasy-French-English linguistic tutor.";
    const prompt = `The user is asking: "${question}"
User's target learning language: ${language === 'en' ? 'English' : 'French'}.
Provide a helpful, precise, culturally grounded answer with clear explanations, practical examples, and explicit Malagasy translations/equivalents (fanazavana amin'ny teny malagasy). Structure your response clearly with markdown headings, bullet points, and highlight key terms.`;

    const response = await groqChat(system, prompt, { json: false });
    res.json({ success: true, answer: response });
  } catch (error: any) {
    console.error("Groq Ask Error:", error);
    console.error("Groq Ask cause:", error?.cause || error);
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
