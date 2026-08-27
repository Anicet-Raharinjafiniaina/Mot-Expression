/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { DailyWordCard } from './components/DailyWordCard';
import { DailyExpressionCard } from './components/DailyExpressionCard';
import { QuizSection } from './components/QuizSection';
import { HistorySection } from './components/HistorySection';
import { FavoritesSection } from './components/FavoritesSection';
import { AiExplorerSection } from './components/AiExplorerSection';
import { ProgressSection } from './components/ProgressSection';
import { getEntryForDate, isCuratedDate, formatDateFr, formatDateEn, formatDateMg } from './data/curatedData';
import { Language, UserProgress, FavoriteItem, DailyEntry } from './types';
import { fetchDailyVocab, AiDailyResult } from './services/geminiService';
import { getCachedDaily, setCachedDaily, clearCachedDaily } from './utils/dailyCache';
import {
  getStoredProgress,
  saveStoredProgress,
  updateDailyActivity,
  toggleFavoriteItem,
  markItemAsLearned,
  recordQuizScore,
} from './utils/storage';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Trophy,
  Info,
  Languages,
  BookOpen,
  ArrowRight,
  Flame,
  CheckCircle2,
  Loader2,
} from 'lucide-react';

/** Local date in YYYY-MM-DD using the visitor's own timezone. */
function todayLocalDate(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** Builds a full DailyEntry from an AI-generated daily payload (adds displayDate). */
function buildEntryFromDaily(data: AiDailyResult): DailyEntry {
  return {
    date: data.date,
    displayDate: {
      fr: formatDateFr(data.date),
      en: formatDateEn(data.date),
      mg: formatDateMg(data.date),
    },
    fr: data.fr,
    en: data.en,
    quiz: data.quiz,
  };
}

export default function App() {
  const [language, setLanguage] = useState<Language>('fr');
  const [currentTab, setCurrentTab] = useState<'today' | 'history' | 'quiz' | 'favorites' | 'explorer' | 'progress'>('today');

  // Default to the visitor's real current date.
  const defaultToday = todayLocalDate();
  const [selectedDate, setSelectedDate] = useState<string>(defaultToday);

  // User progress state
  const [progress, setProgress] = useState<UserProgress>(() => {
    const p = getStoredProgress();
    return updateDailyActivity(p);
  });

  const [showMalagasyAlways, setShowMalagasyAlways] = useState(true);
  const [showMalagasyWelcomeTip, setShowMalagasyWelcomeTip] = useState(false);

  useEffect(() => {
    saveStoredProgress(progress);
  }, [progress]);

  // Daily entry: hand-curated when it exists, otherwise AI-generated (and cached),
  // with a deterministic fallback when the backend / Gemini is unavailable.
  const [entry, setEntry] = useState<DailyEntry>(() => getEntryForDate(defaultToday));
  const [isEntryLoading, setIsEntryLoading] = useState(false);
  const [aiGenerated, setAiGenerated] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    // Dates that are hand-curated never hit the network.
    if (isCuratedDate(selectedDate)) {
      setEntry(getEntryForDate(selectedDate));
      setAiGenerated(false);
      setIsEntryLoading(false);
      return;
    }

    // Reuse an already generated entry stored locally.
    const cached = getCachedDaily(selectedDate);
    if (cached) {
      setEntry(buildEntryFromDaily(cached));
      setAiGenerated(true);
      setIsEntryLoading(false);
      return;
    }

    let cancelled = false;
    setIsEntryLoading(true);
    fetchDailyVocab(selectedDate, language)
      .then((data) => {
        if (cancelled) return;
        setCachedDaily(selectedDate, data);
        setEntry(buildEntryFromDaily(data));
        setAiGenerated(true);
      })
      .catch((err) => {
        console.error('Daily AI generation failed, falling back to curated pool:', err);
        if (cancelled) return;
        setEntry(getEntryForDate(selectedDate));
        setAiGenerated(false);
      })
      .finally(() => {
        if (!cancelled) setIsEntryLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [selectedDate, language, refreshKey]);

  const activeContent = entry[language];

  const handleRegenerate = () => {
    clearCachedDaily(selectedDate);
    setAiGenerated(false);
    setRefreshKey((k) => k + 1);
  };

  // Helper date shifts
  const shiftDate = (days: number) => {
    try {
      const d = new Date(selectedDate + 'T12:00:00Z');
      d.setUTCDate(d.getUTCDate() + days);
      const newDateStr = d.toISOString().split('T')[0];
      setSelectedDate(newDateStr);
    } catch {
      // ignore
    }
  };

  const handleToggleFavorite = (item: any, type: 'word' | 'expression') => {
    const favItem: FavoriteItem = {
      id: item.id,
      term: item.term,
      type,
      language: item.language || language,
      dateAdded: new Date().toISOString().split('T')[0],
      definitionOrExplanation: type === 'word' ? item.definition : item.explanation,
      malagasyTranslation: item.malagasy.translation,
      item,
    };
    setProgress((prev) => toggleFavoriteItem(prev, favItem));
  };

  const handleMarkWordLearned = (id: string) => {
    setProgress((prev) => markItemAsLearned(prev, id));
  };

  const handleQuizCompleted = (score: number, total: number) => {
    setProgress((prev) => recordQuizScore(prev, selectedDate, score, total));
  };

  const isWordFavorite = progress.favorites.some((f) => f.id === activeContent.word.id);
  const isExpFavorite = progress.favorites.some((f) => f.id === activeContent.expression.id);
  const isWordLearned = progress.learnedItemIds.includes(activeContent.word.id);
  const isExpLearned = progress.learnedItemIds.includes(activeContent.expression.id);

  const isToday = selectedDate === defaultToday;

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col selection:bg-emerald-200 selection:text-emerald-950">
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        language={language}
        onLanguageChange={setLanguage}
        streak={progress.streak}
        favoritesCount={progress.favorites.length}
        showMalagasyAlways={showMalagasyAlways}
        onToggleMalagasyAlways={() => setShowMalagasyAlways(!showMalagasyAlways)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* ================= TAB 1: TODAY'S LEARNING ================= */}
        {currentTab === 'today' && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* AI status bar (only for dates that are not hand-curated) */}
            {!isCuratedDate(selectedDate) && (
              <div className="flex items-center justify-end gap-2">
                {isEntryLoading ? (
                  <span className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-1.5 rounded-full">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    {language === 'fr' ? 'Génération IA du contenu…' : 'AI content generation…'}
                  </span>
                ) : aiGenerated ? (
                  <span className="inline-flex items-center gap-2 text-xs font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    {language === 'fr' ? 'Généré par l’IA' : 'AI-generated'}
                    <button
                      id="btn-regenerate"
                      onClick={handleRegenerate}
                      className="ml-1 px-2 py-0.5 rounded-lg bg-white border border-emerald-300 text-emerald-800 text-[11px] font-bold hover:bg-emerald-100 transition cursor-pointer"
                      title="Régénérer ce contenu"
                    >
                      ↻ {language === 'fr' ? 'Régénérer' : 'Regenerate'}
                    </button>
                  </span>
                ) : (
                  <span className="text-xs font-medium text-stone-500 px-3 py-1.5 rounded-full bg-stone-100 border border-stone-200">
                    {language === 'fr' ? 'Contenu de repli (IA indisponible)' : 'Fallback content (AI unavailable)'}
                  </span>
                )}
              </div>
            )}

            {/* Header Date & Navigation Controller */}
            <div className="bg-white rounded-3xl border border-stone-200 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase tracking-wider font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-100">
                    {language === 'fr' ? 'Programme quotidien' : 'Daily learning session'}
                  </span>
                  {isToday && (
                    <span className="text-xs bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">
                      Aujourd'hui
                    </span>
                  )}
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-serif">
                  {language === 'fr' ? entry.displayDate.fr : entry.displayDate.en}
                </h1>
              </div>

              {/* Date Navigation Buttons & Quick Calendar Picker */}
              <div className="flex items-center gap-2 self-start md:self-auto flex-wrap">
                <button
                  id="btn-prev-day"
                  onClick={() => shiftDate(-1)}
                  className="flex items-center gap-1 px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold transition cursor-pointer"
                  title="Jour précédent"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Précédent</span>
                </button>

                {!isToday && (
                  <button
                    id="btn-return-today"
                    onClick={() => setSelectedDate(defaultToday)}
                    className="px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200 transition cursor-pointer"
                  >
                    Aujourd'hui
                  </button>
                )}

                <button
                  id="btn-next-day"
                  onClick={() => shiftDate(1)}
                  className="flex items-center gap-1 px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold transition cursor-pointer"
                  title="Jour suivant"
                >
                  <span className="hidden sm:inline">Suivant</span>
                  <ChevronRight className="w-4 h-4" />
                </button>

                {/* Direct Date Input */}
                <div className="relative">
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => e.target.value && setSelectedDate(e.target.value)}
                    className="px-2.5 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-xl text-stone-700 focus:outline-hidden focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                    title="Choisir une date"
                  />
                </div>
              </div>
            </div>

            {/* Grid of the Day: 1 Mot + 1 Expression */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-start">
              
              {/* Word of the Day Card */}
              <div className="space-y-2">
                <DailyWordCard
                  word={activeContent.word}
                  language={language}
                  isFavorite={isWordFavorite}
                  isLearned={isWordLearned}
                  onToggleFavorite={() => handleToggleFavorite(activeContent.word, 'word')}
                  onMarkLearned={() => handleMarkWordLearned(activeContent.word.id)}
                  initialOpenMalagasy={showMalagasyAlways}
                />
              </div>

              {/* Expression of the Day Card */}
              <div className="space-y-2">
                <DailyExpressionCard
                  expression={activeContent.expression}
                  language={language}
                  isFavorite={isExpFavorite}
                  isLearned={isExpLearned}
                  onToggleFavorite={() => handleToggleFavorite(activeContent.expression, 'expression')}
                  onMarkLearned={() => handleMarkWordLearned(activeContent.expression.id)}
                  initialOpenMalagasy={showMalagasyAlways}
                />
              </div>

            </div>

            {/* Bottom Call to Action: Daily Quiz Invitation */}
            <div className="bg-gradient-to-br from-emerald-900 via-emerald-950 to-teal-900 text-white rounded-3xl p-6 sm:p-8 shadow-md flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-center sm:text-left">
                <span className="text-xs uppercase font-bold tracking-wider text-emerald-300 bg-white/10 px-3 py-1 rounded-full backdrop-blur-xs">
                  Entraînement & Consolidation
                </span>
                <h3 className="text-xl sm:text-2xl font-bold">
                  Prêt à faire le Quiz sur les mots du jour ?
                </h3>
                <p className="text-xs sm:text-sm text-emerald-200 max-w-xl">
                  Vérifiez votre compréhension des définitions, des usages et des traductions apprises aujourd'hui.
                </p>
              </div>

              <button
                id="btn-start-daily-quiz"
                onClick={() => setCurrentTab('quiz')}
                className="px-6 py-3.5 bg-emerald-400 hover:bg-emerald-300 text-emerald-950 font-bold rounded-2xl text-sm shadow-md transition-all hover:scale-105 flex items-center gap-2 shrink-0 cursor-pointer"
              >
                <Trophy className="w-4 h-4 text-emerald-950" />
                <span>Commencer le Quiz</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        )}

        {/* ================= TAB 2: HISTORY ARCHIVE ================= */}
        {currentTab === 'history' && (
          <div className="animate-fadeIn">
            <HistorySection
              language={language}
              selectedDate={selectedDate}
              onSelectDate={(date) => {
                setSelectedDate(date);
                setCurrentTab('today');
              }}
              favorites={progress.favorites}
              onToggleFavorite={handleToggleFavorite}
            />
          </div>
        )}

        {/* ================= TAB 3: QUIZ & PRACTICE ================= */}
        {currentTab === 'quiz' && (
          <div className="animate-fadeIn">
            <QuizSection
              questions={entry.quiz}
              language={language}
              dateStr={selectedDate}
              onQuizCompleted={handleQuizCompleted}
              onGoToToday={() => setCurrentTab('today')}
            />
          </div>
        )}

        {/* ================= TAB 4: FAVORITES & FLASHCARDS ================= */}
        {currentTab === 'favorites' && (
          <div className="animate-fadeIn">
            <FavoritesSection
              favorites={progress.favorites}
              language={language}
              onRemoveFavorite={(id) => {
                setProgress((prev) => ({
                  ...prev,
                  favorites: prev.favorites.filter((f) => f.id !== id),
                }));
              }}
              onGoToToday={() => setCurrentTab('today')}
            />
          </div>
        )}

        {/* ================= TAB 5: AI EXPLORER & LINGUISTIC ASSISTANT ================= */}
        {currentTab === 'explorer' && (
          <div className="animate-fadeIn">
            <AiExplorerSection
              language={language}
              onSaveToFavorites={(item) => {
                setProgress((prev) => toggleFavoriteItem(prev, item));
              }}
              favorites={progress.favorites}
            />
          </div>
        )}

        {/* ================= TAB 6: PROGRESS & BADGES ================= */}
        {currentTab === 'progress' && (
          <div className="animate-fadeIn">
            <ProgressSection
              progress={progress}
              onGoToToday={() => setCurrentTab('today')}
              onGoToQuiz={() => setCurrentTab('quiz')}
            />
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200 bg-white py-6 mt-12 text-center text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <div className="flex items-center justify-center gap-2 font-semibold text-stone-700">
            <span className="w-5 h-5 rounded-md bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">ME</span>
            <span>Apprentissage du vocabulaire quotidien (Français • English • Malagasy)</span>
          </div>
          <p className="text-stone-600">
            1 mot & 1 expression par jour • Explications en malagasy • Quiz & Exercices 
          </p><p>created by Ⓐnc</p>
        </div>
      </footer>
    </div>
  );
}
