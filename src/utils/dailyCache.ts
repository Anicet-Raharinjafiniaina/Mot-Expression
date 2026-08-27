import { AiDailyResult } from '../services/geminiService';

/**
 * Local persistence for AI-generated daily entries.
 *
 * Storing the generated entry in localStorage means:
 * - the same date is not regenerated on every page reload (cheaper, faster),
 * - the app still shows a full entry even if the backend / Gemini is unreachable
 *   (the cached entry is used before falling back to the curated/deterministic pool).
 */
const CACHE_PREFIX = 'me-daily-entry-';

/** Returns the cached AI-generated daily entry for a date, or null. */
export function getCachedDaily(date: string): AiDailyResult | null {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + date);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AiDailyResult;
    // Basic sanity check: must carry both languages + a quiz.
    if (!parsed || parsed.date !== date || !parsed.fr?.word || !parsed.en?.word || !Array.isArray(parsed.quiz)) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

/** Stores an AI-generated daily entry for a date. */
export function setCachedDaily(date: string, data: AiDailyResult): void {
  try {
    localStorage.setItem(CACHE_PREFIX + date, JSON.stringify(data));
  } catch {
    // Ignore storage errors (private mode, quota, ...).
  }
}

/** Removes a cached entry (used by the "régénérer" action). */
export function clearCachedDaily(date: string): void {
  try {
    localStorage.removeItem(CACHE_PREFIX + date);
  } catch {
    // ignore
  }
}