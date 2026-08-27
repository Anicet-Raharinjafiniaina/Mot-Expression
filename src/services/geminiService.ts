import { Language } from '../types';

export interface AiVocabResult {
  term: string;
  type: 'word' | 'expression';
  partOfSpeech: string;
  phonetic?: string;
  language: string;
  definition: string;
  explanation: string;
  example: string;
  exampleTranslation?: string;
  /** French translation provided when the source language is English. */
  frenchTranslation?: string;
  synonyms?: string[];
  malagasy: {
    translation: string;
    explanation: string;
    exampleInMalagasy: string;
    culturalNote?: string;
    synonymsMalagasy?: string[];
  };
  quizQuestion?: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export async function exploreVocabWithAi(
  term: string,
  language: Language,
  category?: string
): Promise<AiVocabResult> {
  const res = await fetch('/api/vocab/explore', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ term, language, category }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Erreur lors de la génération IA');
  }

  const json = await res.json();
  return json.data;
}

export async function askVocabAi(question: string, language: Language): Promise<string> {
  const res = await fetch('/api/vocab/ask', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question, language }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Erreur lors de la réponse IA');
  }

  const json = await res.json();
  return json.answer;
}
