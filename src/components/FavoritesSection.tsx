import { useState } from 'react';
import { Bookmark, Sparkles, Volume2, Trash2, ArrowRight, RotateCw, CheckCircle, Lightbulb, BookOpen } from 'lucide-react';
import { FavoriteItem, Language } from '../types';
import { speakText } from '../utils/speech';

interface FavoritesSectionProps {
  favorites: FavoriteItem[];
  language: Language;
  onRemoveFavorite: (id: string) => void;
  onGoToToday: () => void;
}

export function FavoritesSection({
  favorites,
  language,
  onRemoveFavorite,
  onGoToToday,
}: FavoritesSectionProps) {
  const [filterLang, setFilterLang] = useState<'all' | 'fr' | 'en'>('all');
  const [flashcardMode, setFlashcardMode] = useState(false);
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showMalagasyHint, setShowMalagasyHint] = useState(false);

  const filtered = favorites.filter((f) => {
    if (filterLang === 'all') return true;
    return f.language === filterLang;
  });

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNextCard = () => {
    setIsFlipped(false);
    setShowMalagasyHint(false);
    setFlashcardIndex((prev) => (prev + 1) % filtered.length);
  };

  const handlePrevCard = () => {
    setIsFlipped(false);
    setShowMalagasyHint(false);
    setFlashcardIndex((prev) => (prev - 1 + filtered.length) % filtered.length);
  };

  if (favorites.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-stone-200 p-8 sm:p-12 text-center max-w-xl mx-auto space-y-4 shadow-xs">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
          <Bookmark className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-stone-800">Aucun favori enregistré</h3>
        <p className="text-stone-600 text-sm leading-relaxed">
          Cliquez sur l'icône de favori sur les mots ou expressions de votre choix pour les retrouver et les réviser ici.
        </p>
        <button
          onClick={onGoToToday}
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold text-sm transition cursor-pointer"
        >
          Découvrir les mots du jour
        </button>
      </div>
    );
  }

  const currentCard = filtered[flashcardIndex];

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900 flex items-center gap-2">
            <Bookmark className="w-6 h-6 text-rose-600 fill-rose-100" />
            <span>Favoris ({filtered.length})</span>
          </h2>
          <p className="text-sm text-stone-600">
            Révisez et pratiquez avec les cartes de mémorisation (Flashcards)
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Filter Language */}
          <div className="flex bg-stone-100 p-1 rounded-xl border border-stone-200 text-xs">
            <button
              onClick={() => setFilterLang('all')}
              className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
                filterLang === 'all' ? 'bg-white font-bold text-stone-900 shadow-2xs' : 'text-stone-600'
              }`}
            >
              Tous
            </button>
            <button
              onClick={() => setFilterLang('fr')}
              className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
                filterLang === 'fr' ? 'bg-white font-bold text-stone-900 shadow-2xs' : 'text-stone-600'
              }`}
            >
              🇫🇷 FR
            </button>
            <button
              onClick={() => setFilterLang('en')}
              className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
                filterLang === 'en' ? 'bg-white font-bold text-stone-900 shadow-2xs' : 'text-stone-600'
              }`}
            >
              🇬🇧 EN
            </button>
          </div>

          {/* Flashcard Mode Toggle */}
          {filtered.length > 0 && (
            <button
              id="btn-toggle-flashcards"
              onClick={() => {
                setFlashcardMode(!flashcardMode);
                setIsFlipped(false);
                setShowMalagasyHint(false);
              }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer ${
                flashcardMode
                  ? 'bg-rose-600 text-white hover:bg-rose-700'
                  : 'bg-stone-900 text-white hover:bg-stone-800'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{flashcardMode ? 'Quitter les Flashcards' : 'Mode Flashcards'}</span>
            </button>
          )}
        </div>
      </div>

      {/* FLASHCARD INTERACTIVE DECK */}
      {flashcardMode && currentCard && (
        <div className="max-w-xl mx-auto space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between text-xs font-semibold text-stone-600 px-2">
            <span>Carte {flashcardIndex + 1} / {filtered.length}</span>
            <span>Cliquez sur la carte pour la retourner</span>
          </div>

          {/* Flip Card */}
          <div
            id="flashcard-box"
            onClick={handleFlip}
            className="min-h-[260px] sm:min-h-[300px] bg-gradient-to-br from-white via-stone-50 to-emerald-50/30 rounded-3xl border-2 border-emerald-300/80 shadow-md p-6 sm:p-8 flex flex-col justify-between cursor-pointer transition-all hover:scale-[1.01] select-none"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/70 px-2.5 py-0.5 rounded-md">
                {currentCard.type === 'word' ? 'Mot' : 'Expression'}
              </span>
              <span className="text-xs font-bold text-stone-500">
                {currentCard.language === 'fr' ? '🇫🇷 Français' : '🇬🇧 English'}
              </span>
            </div>

            {/* Center Content */}
            <div className="my-auto text-center space-y-3 py-4">
              {!isFlipped ? (
                <>
                  <h3 className="text-3xl sm:text-4xl font-extrabold text-stone-900 font-serif">
                    {currentCard.term}
                  </h3>
                  <p className="text-xs text-stone-600 font-medium">
                    (Cliquez pour voir la définition et la traduction)
                  </p>
                </>
              ) : (
                <div className="space-y-3 animate-fadeIn">
                  <p className="text-base sm:text-lg font-medium text-stone-800 leading-relaxed">
                    {currentCard.definitionOrExplanation}
                  </p>

                  <div className="bg-emerald-100/70 p-3 rounded-2xl border border-emerald-200 text-emerald-950 text-sm font-semibold">
                    <span className="text-xs uppercase text-emerald-800 block mb-0.5">🇲🇬 Malagasy :</span>
                    {currentCard.malagasyTranslation}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between text-xs text-stone-500 border-t border-stone-200/60 pt-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  speakText(currentCard.term, currentCard.language);
                }}
                className="flex items-center gap-1 text-emerald-700 hover:text-emerald-800 font-semibold p-1 cursor-pointer"
              >
                <Volume2 className="w-4 h-4" />
                <span>Écouter</span>
              </button>

              <span className="flex items-center gap-1 text-stone-600">
                <RotateCw className="w-3.5 h-3.5" />
                <span>Retourner</span>
              </span>
            </div>
          </div>

          {/* Flashcard Controls */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={handlePrevCard}
              className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs transition cursor-pointer"
            >
              Précédent
            </button>
            <button
              onClick={handleNextCard}
              className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs transition cursor-pointer"
            >
              Suivant →
            </button>
          </div>
        </div>
      )}

      {/* Grid of Saved Items */}
      {!flashcardMode && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-stone-200 p-5 space-y-3 shadow-2xs hover:shadow-xs transition relative group"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-stone-500 uppercase">
                      {item.language === 'fr' ? '🇫🇷' : '🇬🇧'} {item.type === 'word' ? 'Mot' : 'Expression'}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-stone-900 font-serif mt-1">
                    {item.term}
                  </h3>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => speakText(item.term, item.language)}
                    className="p-1.5 rounded-lg text-stone-400 hover:text-emerald-600 hover:bg-stone-100 transition cursor-pointer"
                    title="Écouter"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onRemoveFavorite(item.id)}
                    className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                    title="Supprimer des favoris"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="text-xs text-stone-600 line-clamp-3">
                {item.definitionOrExplanation}
              </p>

              <div className="bg-emerald-50/90 p-2.5 rounded-xl border border-emerald-100 text-xs text-emerald-950">
                <span className="font-bold text-emerald-900">🇲🇬 Malagasy : </span>
                <span>{item.malagasyTranslation}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
