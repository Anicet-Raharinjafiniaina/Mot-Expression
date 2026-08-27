import { useState, FormEvent } from 'react';
import { Sparkles, Search, Loader2, Volume2, Bookmark, BookmarkCheck, MessageSquare, Lightbulb, CheckCircle2, ChevronRight, HelpCircle, Compass } from 'lucide-react';
import { Language, FavoriteItem } from '../types';
import { exploreVocabWithAi, askVocabAi, AiVocabResult } from '../services/geminiService';
import { speakText } from '../utils/speech';

interface AiExplorerSectionProps {
  language: Language;
  onSaveToFavorites: (item: FavoriteItem) => void;
  favorites: FavoriteItem[];
}

const PRESET_CATEGORIES = [
  { id: 'business', labelFr: '💼 Monde pro & Business', labelEn: '💼 Business & Work', labelMg: 'Asa sy fandraharahana' },
  { id: 'tech', labelFr: '💻 Tech & Numérique', labelEn: '💻 Tech & Digital', labelMg: 'Teknolojia' },
  { id: 'literature', labelFr: '📚 Littérature & Éloquence', labelEn: '📚 Literature & Eloquence', labelMg: 'Haifanoratana sy teny kanto' },
  { id: 'daily', labelFr: '☕ Quotidien & Émotions', labelEn: '☕ Daily life & Emotions', labelMg: 'Fiainana andavanandro' },
  { id: 'idioms', labelFr: '🎭 Expressions colorées', labelEn: '🎭 Colorful Idioms', labelMg: 'Fomba fiteny' },
];

export function AiExplorerSection({
  language,
  onSaveToFavorites,
  favorites,
}: AiExplorerSectionProps) {
  const [activeSubTab, setActiveSubTab] = useState<'generate' | 'lookup' | 'ask'>('generate');

  // Lookup state
  const [lookupTerm, setLookupTerm] = useState('');
  const [result, setResult] = useState<AiVocabResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Ask question state
  const [askQuestion, setAskQuestion] = useState('');
  const [askAnswer, setAskAnswer] = useState<string | null>(null);
  const [isAsking, setIsAsking] = useState(false);

  const handleExplore = async (termToSearch?: string, categoryToSearch?: string) => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const data = await exploreVocabWithAi(
        termToSearch || lookupTerm,
        language,
        categoryToSearch
      );
      setResult(data);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Tsy nahomby ny fikarohana. Hamarino ny fifandraisana.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAsk = async (e: FormEvent) => {
    e.preventDefault();
    if (!askQuestion.trim()) return;
    setIsAsking(true);
    setAskAnswer(null);
    try {
      const answer = await askVocabAi(askQuestion, language);
      setAskAnswer(answer);
    } catch (err: any) {
      console.error(err);
      setAskAnswer("Un problème a été survenu.");
    } finally {
      setIsAsking(false);
    }
  };

  const handleSaveResultToFavorites = () => {
    if (!result) return;
    const favoriteItem: FavoriteItem = {
      id: `ai-${Date.now()}-${result.term.replace(/\s+/g, '-').toLowerCase()}`,
      term: result.term,
      type: result.type,
      language: language,
      dateAdded: new Date().toISOString().split('T')[0],
      definitionOrExplanation: result.definition,
      malagasyTranslation: result.malagasy.translation,
      item: {
        id: `ai-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        language: language,
        term: result.term,
        partOfSpeech: result.partOfSpeech || 'Mot',
        phonetic: result.phonetic || '',
        definition: result.definition,
        explanation: result.explanation,
        example: result.example,
        exampleTranslation: result.exampleTranslation || '',
        synonyms: result.synonyms || [],
        difficulty: 'Intermédiaire',
        malagasy: {
          translation: result.malagasy.translation,
          explanation: result.malagasy.explanation,
          exampleInMalagasy: result.malagasy.exampleInMalagasy,
          culturalNote: result.malagasy.culturalNote,
          synonymsMalagasy: result.malagasy.synonymsMalagasy,
        },
      },
    };
    onSaveToFavorites(favoriteItem);
  };

  const isCurrentResultFavorite = result
    ? favorites.some((f) => f.term.toLowerCase() === result.term.toLowerCase())
    : false;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-stone-900 text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider font-bold bg-white/20 px-3 py-1 rounded-full backdrop-blur-xs flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Gemini 3.7 Flash AI</span>
            </span>
            <span className="text-xs text-purple-200">
           
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Explorateur de Vocabulaire & Assistant Malagasy
          </h2>
          <p className="text-sm text-purple-100/90 leading-relaxed">
            Générez des mots rares ou thématiques, analysez n'importe quel terme inconnu et obtenez des explications bilingues complètes en malagasy avec exemples authentiques.
          </p>
        </div>

        {/* Sub-navigation tabs */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-white/10 text-xs sm:text-sm font-semibold">
          <button
            onClick={() => setActiveSubTab('generate')}
            className={`px-4 py-2 rounded-xl transition cursor-pointer ${
              activeSubTab === 'generate'
                ? 'bg-white text-stone-900 font-bold shadow-xs'
                : 'text-purple-200 hover:text-white hover:bg-white/10'
            }`}
          >
            🎲 Générateur par Thème
          </button>
          <button
            onClick={() => setActiveSubTab('lookup')}
            className={`px-4 py-2 rounded-xl transition cursor-pointer ${
              activeSubTab === 'lookup'
                ? 'bg-white text-stone-900 font-bold shadow-xs'
                : 'text-purple-200 hover:text-white hover:bg-white/10'
            }`}
          >
            🔍 Rechercher un mot précis
          </button>
          <button
            onClick={() => setActiveSubTab('ask')}
            className={`px-4 py-2 rounded-xl transition cursor-pointer ${
              activeSubTab === 'ask'
                ? 'bg-white text-stone-900 font-bold shadow-xs'
                : 'text-purple-200 hover:text-white hover:bg-white/10'
            }`}
          >
            💬 Poser une question
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: GENERATE BY THEME */}
      {activeSubTab === 'generate' && (
        <div className="bg-white rounded-3xl border border-stone-200 p-6 space-y-4 shadow-xs">
          <div>
            <h3 className="text-lg font-bold text-stone-900">
              Choisir une thématique
            </h3>
            <p className="text-xs text-stone-600">
              Cliquez sur le thème de votre choix pour découvrir de nouveaux mots et expressions avec leur traduction et explication en malagasy.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {PRESET_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleExplore('', cat.labelFr)}
                disabled={isLoading}
                className="p-4 rounded-2xl border border-stone-200 hover:border-purple-300 hover:bg-purple-50/50 transition-all text-left group cursor-pointer disabled:opacity-50"
              >
                <div className="font-bold text-sm text-stone-900 group-hover:text-purple-900">
                  {language === 'fr' ? cat.labelFr : cat.labelEn}
                </div>
                <div className="text-xs text-stone-600 mt-1">
                  🇲🇬 {cat.labelMg}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: LOOKUP SPECIFIC TERM */}
      {activeSubTab === 'lookup' && (
        <div className="bg-white rounded-3xl border border-stone-200 p-6 space-y-4 shadow-xs">
          <div>
            <h3 className="text-lg font-bold text-stone-900">
              Analyser un mot ou une expression
            </h3>
            <p className="text-xs text-stone-600">
              Entrez le terme en français ou en anglais pour obtenir la définition complète, le contexte et la traduction en malagasy.
            </p>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={lookupTerm}
              onChange={(e) => setLookupTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && lookupTerm.trim() && handleExplore(lookupTerm)}
              placeholder={language === 'fr' ? 'Ex: Ubiquité, Bienveillance, Poser un lapin...' : 'Ex: Serendipity, Resilient, Break a leg...'}
              className="flex-1 px-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl text-sm focus:outline-hidden focus:ring-2 focus:ring-purple-500 focus:bg-white transition"
            />
            <button
              onClick={() => handleExplore(lookupTerm)}
              disabled={isLoading || !lookupTerm.trim()}
              className="px-6 py-3 bg-purple-700 hover:bg-purple-800 disabled:opacity-50 text-white rounded-2xl font-semibold text-sm transition shadow-xs flex items-center gap-2 cursor-pointer"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              <span>Rechercher</span>
            </button>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: ASK LINGUISTIC QUESTION */}
      {activeSubTab === 'ask' && (
        <div className="bg-white rounded-3xl border border-stone-200 p-6 space-y-4 shadow-xs">
          <div>
            <h3 className="text-lg font-bold text-stone-900">
              Poser une question linguistique
            </h3>
            <p className="text-xs text-stone-600">
              Exemple : « Quelle est la différence entre entendre et écouter ? », « Comment employer l'expression avoir hâte ? »
            </p>
          </div>

          <form onSubmit={handleAsk} className="space-y-3">
            <textarea
              rows={3}
              value={askQuestion}
              onChange={(e) => setAskQuestion(e.target.value)}
              placeholder="Écrivez votre question ici (en français, malagasy ou anglais)..."
              className="w-full p-4 bg-stone-50 border border-stone-200 rounded-2xl text-sm focus:outline-hidden focus:ring-2 focus:ring-purple-500 focus:bg-white transition"
            />
            <button
              type="submit"
              disabled={isAsking || !askQuestion.trim()}
              className="px-6 py-2.5 bg-purple-700 hover:bg-purple-800 disabled:opacity-50 text-white rounded-xl font-semibold text-sm transition shadow-xs flex items-center gap-2 cursor-pointer"
            >
              {isAsking ? <Loader2 className="w-4 h-4 animate-spin" /> : <MessageSquare className="w-4 h-4" />}
              <span>Envoyer la question</span>
            </button>
          </form>

          {askAnswer && (
            <div className="mt-4 p-5 rounded-2xl bg-purple-50/70 border border-purple-200 text-stone-800 text-sm space-y-2 animate-fadeIn leading-relaxed">
              <div className="font-bold text-purple-950 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-purple-700" />
                <span>Réponse de l'assistant :</span>
              </div>
              <div className="whitespace-pre-line text-stone-800">
                {askAnswer}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Loading Indicator */}
      {isLoading && (
        <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center space-y-4 shadow-xs">
          <Loader2 className="w-10 h-10 text-purple-600 animate-spin mx-auto" />
          <p className="font-bold text-stone-800 text-base">
            Analyse et traduction en cours...
          </p>
          <p className="text-xs text-stone-600">
            L'assistant prépare la définition, les exemples et les explications en malagasy.
          </p>
        </div>
      )}

      {/* Error display */}
      {errorMsg && (
        <div className="bg-rose-50 border border-rose-200 p-4 rounded-2xl text-rose-800 text-sm">
          {errorMsg}
        </div>
      )}

      {/* GENERATED / LOOKUP RESULT CARD */}
      {!isLoading && result && (
        <div className="bg-white rounded-3xl border border-purple-200 shadow-md overflow-hidden animate-fadeIn space-y-6 p-6 sm:p-8">
          
          {/* Top Result Header */}
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 border-b border-stone-100 pb-4">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs uppercase tracking-wider font-bold bg-purple-100 text-purple-900 px-2.5 py-0.5 rounded-md">
                  {result.type === 'word' ? 'Mot' : 'Expression'}
                </span>
                <span className="text-xs text-stone-500 font-mono">
                  {result.partOfSpeech}
                </span>
                {result.phonetic && (
                  <span className="text-xs text-stone-600 font-mono">
                    {result.phonetic}
                  </span>
                )}
              </div>

              <h3 className="text-3xl font-extrabold text-stone-900 font-serif mt-1">
                {result.term}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => speakText(result.term, language)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 text-xs font-semibold transition cursor-pointer"
              >
                <Volume2 className="w-4 h-4 text-purple-700" />
                <span>Écouter</span>
              </button>

              <button
                onClick={handleSaveResultToFavorites}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                  isCurrentResultFavorite
                    ? 'bg-rose-50 border-rose-200 text-rose-700'
                    : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                }`}
              >
                {isCurrentResultFavorite ? (
                  <>
                    <BookmarkCheck className="w-4 h-4 text-rose-600" />
                    <span>Favori enregistré ✓</span>
                  </>
                ) : (
                  <>
                    <Bookmark className="w-4 h-4 text-stone-500" />
                    <span>Ajouter aux favoris</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Definition */}
          <div className="space-y-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-600">
              Définition
            </h4>
            <p className="text-base sm:text-lg font-medium text-stone-900">
              {result.definition}
            </p>
          </div>

          {/* Explanation */}
          <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200/70 space-y-1 text-sm text-stone-700">
            <h5 className="text-xs font-bold uppercase tracking-wider text-stone-600">
              Explication & Nuances
            </h5>
            <p className="leading-relaxed">{result.explanation}</p>
          </div>

          {/* Example */}
          <div className="border-l-3 border-purple-500 pl-4 py-1 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-800">
                Exemple
              </span>
              <button
                onClick={() => speakText(result.example, language)}
                className="text-stone-600 hover:text-purple-700 text-xs flex items-center gap-1 cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-stone-900 font-medium italic text-sm sm:text-base">
              « {result.example} »
            </p>
            {result.exampleTranslation && (
              <p className="text-xs text-stone-600">
                {result.exampleTranslation}
              </p>
            )}
          </div>

          {/* MALAGASY SECTION */}
          <div className="rounded-2xl bg-gradient-to-br from-emerald-50 via-teal-50 to-amber-50/40 border border-emerald-200 p-5 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                🇲🇬
              </div>
              <h4 className="text-sm font-bold text-emerald-950">
                Fandikana sy fanazavana amin'ny teny Malagasy
              </h4>
            </div>

            <div className="bg-white p-3 rounded-xl border border-emerald-100 shadow-2xs">
              <div className="text-xs font-bold text-emerald-800 uppercase tracking-wide">
                Dikan-teny mivantana (Traduction)
              </div>
              <div className="text-base font-bold text-emerald-900 mt-0.5">
                {result.malagasy.translation}
              </div>
            </div>

            <div className="bg-white p-3 rounded-xl border border-emerald-100 shadow-2xs space-y-1">
              <div className="text-xs font-bold text-emerald-800 uppercase tracking-wide">
                Fanazavana amin'ny antsipiriany (Explication)
              </div>
              <p className="text-sm text-stone-700 leading-relaxed">
                {result.malagasy.explanation}
              </p>
            </div>

            {result.malagasy.exampleInMalagasy && (
              <div className="bg-white/80 p-3 rounded-xl border border-emerald-100 text-xs sm:text-sm">
                <span className="font-bold text-emerald-800">Fandikana ny ohatra : </span>
                <span className="italic text-stone-800">« {result.malagasy.exampleInMalagasy} »</span>
              </div>
            )}

            {result.malagasy.culturalNote && (
              <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-xs text-amber-950">
                <span className="font-bold text-amber-900 block mb-0.5">Fahendrena / Hevitra mitovy lenta :</span>
                {result.malagasy.culturalNote}
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
