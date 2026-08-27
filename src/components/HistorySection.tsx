import { useState, useMemo } from 'react';
import { Calendar, Search, Filter, BookOpen, Quote, ChevronRight, Volume2, Bookmark, BookmarkCheck } from 'lucide-react';
import { CURATED_ENTRIES, formatDateFr, formatDateEn, formatDateMg } from '../data/curatedData';
import { DailyEntry, Language, FavoriteItem } from '../types';
import { speakText } from '../utils/speech';

interface HistorySectionProps {
  language: Language;
  selectedDate: string;
  onSelectDate: (date: string) => void;
  favorites: FavoriteItem[];
  onToggleFavorite: (item: any, type: 'word' | 'expression') => void;
}

export function HistorySection({
  language,
  selectedDate,
  onSelectDate,
  favorites,
  onToggleFavorite,
}: HistorySectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'word' | 'expression'>('all');

  const filteredEntries = useMemo(() => {
    return CURATED_ENTRIES.filter((entry) => {
      const activeData = entry[language];
      const q = searchQuery.toLowerCase().trim();

      if (!q) return true;

      const wordMatch =
        activeData.word.term.toLowerCase().includes(q) ||
        activeData.word.definition.toLowerCase().includes(q) ||
        activeData.word.malagasy.translation.toLowerCase().includes(q) ||
        activeData.word.malagasy.explanation.toLowerCase().includes(q);

      const expMatch =
        activeData.expression.term.toLowerCase().includes(q) ||
        activeData.expression.explanation.toLowerCase().includes(q) ||
        activeData.expression.malagasy.translation.toLowerCase().includes(q) ||
        activeData.expression.malagasy.explanation.toLowerCase().includes(q);

      if (filterType === 'word') return wordMatch;
      if (filterType === 'expression') return expMatch;
      return wordMatch || expMatch;
    });
  }, [searchQuery, filterType, language]);

  return (
    <div className="space-y-6">
      {/* Header & Search Bar */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900 flex items-center gap-2">
              <Calendar className="w-6 h-6 text-amber-600" />
              <span>Historique</span>
            </h2>
            <p className="text-sm text-stone-600">
              Retrouvez et révisez tous les mots et expressions des jours passés
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-stone-600">Filtre :</span>
            <div className="flex bg-stone-100 p-1 rounded-xl border border-stone-200">
              <button
                onClick={() => setFilterType('all')}
                className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                  filterType === 'all' ? 'bg-white text-stone-900 shadow-2xs font-semibold' : 'text-stone-600'
                }`}
              >
                Tous
              </button>
              <button
                onClick={() => setFilterType('word')}
                className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                  filterType === 'word' ? 'bg-white text-stone-900 shadow-2xs font-semibold' : 'text-stone-600'
                }`}
              >
                Mots
              </button>
              <button
                onClick={() => setFilterType('expression')}
                className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                  filterType === 'expression' ? 'bg-white text-stone-900 shadow-2xs font-semibold' : 'text-stone-600'
                }`}
              >
                Expressions
              </button>
            </div>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-5 h-5 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="history-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher un mot, une expression, une définition, une traduction..."
            className="w-full pl-11 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-600 hover:text-stone-700 bg-stone-200 px-2 py-0.5 rounded-full cursor-pointer"
            >
              Effacer
            </button>
          )}
        </div>
      </div>

      {/* Entries Grid */}
      {filteredEntries.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-200 p-8 text-center space-y-2">
          <p className="text-stone-600 font-medium">Aucun résultat trouvé.</p>
          <p className="text-xs text-stone-600">Essayez avec un autre mot ou une autre recherche.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {filteredEntries.map((entry) => {
            const activeData = entry[language];
            const isWordFav = favorites.some((f) => f.id === activeData.word.id);
            const isExpFav = favorites.some((f) => f.id === activeData.expression.id);
            const isSelected = selectedDate === entry.date;

            return (
              <div
                key={entry.date}
                className={`bg-white rounded-3xl border transition-all p-5 space-y-4 shadow-2xs hover:shadow-md ${
                  isSelected ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                {/* Date Header */}
                <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md">
                      {entry.date}
                    </span>
                    <h3 className="text-sm font-bold text-stone-900 mt-1">
                      {language === 'fr' ? entry.displayDate.fr : entry.displayDate.en}
                    </h3>
                  </div>

                  <button
                    onClick={() => onSelectDate(entry.date)}
                    className="flex items-center gap-1 text-xs font-bold text-emerald-800 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-200 transition cursor-pointer"
                  >
                    <span>Étudier</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Word Preview */}
                {(filterType === 'all' || filterType === 'word') && (
                  <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-emerald-600" />
                        <span className="font-bold text-stone-900 text-base">{activeData.word.term}</span>
                        <span className="text-xs text-stone-600 font-mono">({activeData.word.partOfSpeech})</span>
                      </div>
                      <button
                        onClick={() => speakText(activeData.word.term, language)}
                        className="text-stone-600 hover:text-emerald-600 p-1 cursor-pointer"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-xs text-stone-600 line-clamp-2">
                      {activeData.word.definition}
                    </p>

                    <div className="bg-emerald-50/80 p-2 rounded-xl text-xs text-emerald-950 font-medium">
                      <span className="font-bold text-emerald-900">🇲🇬 Malagasy : </span>
                      <span>{activeData.word.malagasy.translation}</span>
                    </div>
                  </div>
                )}

                {/* Expression Preview */}
                {(filterType === 'all' || filterType === 'expression') && (
                  <div className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Quote className="w-4 h-4 text-amber-600" />
                        <span className="font-bold text-stone-900 text-base">« {activeData.expression.term} »</span>
                      </div>
                      <button
                        onClick={() => speakText(activeData.expression.term, language)}
                        className="text-stone-600 hover:text-amber-600 p-1 cursor-pointer"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-xs text-stone-600 line-clamp-2">
                      {activeData.expression.explanation}
                    </p>

                    <div className="bg-amber-100/70 p-2 rounded-xl text-xs text-amber-950 font-medium">
                      <span className="font-bold text-amber-900">🇲🇬 Malagasy : </span>
                      <span>{activeData.expression.malagasy.translation}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
