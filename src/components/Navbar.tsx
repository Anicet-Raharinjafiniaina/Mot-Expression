import { Flame, Bookmark, Sparkles, Trophy, Calendar, BookOpen, Globe2, HelpCircle } from 'lucide-react';
import { Language } from '../types';

interface NavbarProps {
  currentTab: 'today' | 'history' | 'quiz' | 'favorites' | 'explorer' | 'progress';
  onTabChange: (tab: 'today' | 'history' | 'quiz' | 'favorites' | 'explorer' | 'progress') => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  streak: number;
  favoritesCount: number;
  showMalagasyAlways: boolean;
  onToggleMalagasyAlways: () => void;
}

export function Navbar({
  currentTab,
  onTabChange,
  language,
  onLanguageChange,
  streak,
  favoritesCount,
  showMalagasyAlways,
  onToggleMalagasyAlways,
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-stone-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2 sm:gap-4">
          
          {/* Logo & Identity */}
          <div className="flex items-center gap-3">
            <button
              id="vocab-logo-btn"
              onClick={() => onTabChange('today')}
              className="flex items-center gap-2.5 group text-left cursor-pointer focus:outline-hidden"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center font-bold text-xl shadow-xs group-hover:scale-105 transition-transform">
                ME
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-xl tracking-tight text-stone-900">Mot-Expression</span>
                </div>
                <p className="text-xs text-stone-500 hidden sm:block">1 mot & 1 expression par jour</p>
              </div>
            </button>
          </div>

          {/* Center Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1 bg-stone-100 p-1 rounded-xl border border-stone-200">
            <button
              id="nav-today-btn"
              onClick={() => onTabChange('today')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                currentTab === 'today'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
              }`}
            >
              <BookOpen className="w-4 h-4 text-emerald-600" />
              <span>Aujourd’hui</span>
            </button>

            <button
              id="nav-history-btn"
              onClick={() => onTabChange('history')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                currentTab === 'history'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
              }`}
            >
              <Calendar className="w-4 h-4 text-amber-600" />
              <span>Historique</span>
            </button>

            <button
              id="nav-quiz-btn"
              onClick={() => onTabChange('quiz')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                currentTab === 'quiz'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
              }`}
            >
              <Trophy className="w-4 h-4 text-indigo-600" />
              <span>Quiz & Exercices</span>
            </button>

            <button
              id="nav-favorites-btn"
              onClick={() => onTabChange('favorites')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                currentTab === 'favorites'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
              }`}
            >
              <Bookmark className="w-4 h-4 text-rose-600" />
              <span>Favoris</span>
              {favoritesCount > 0 && (
                <span className="ml-0.5 text-xs bg-rose-100 text-rose-700 px-1.5 py-0.2 rounded-full font-bold">
                  {favoritesCount}
                </span>
              )}
            </button>

            <button
              id="nav-explorer-btn"
              onClick={() => onTabChange('explorer')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                currentTab === 'explorer'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
              }`}
            >
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>Explorateur IA</span>
            </button>
          </nav>

          {/* Right Controls: Language Selector, Streak, Malagasy Toggle */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Language Switcher */}
            <div className="flex items-center bg-stone-100 p-1 rounded-xl border border-stone-200">
              <button
                id="lang-switch-fr"
                onClick={() => onLanguageChange('fr')}
                className={`px-2.5 py-1 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                  language === 'fr'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
                title="Apprendre en Français"
              >
                🇫🇷 Français
              </button>
              <button
                id="lang-switch-en"
                onClick={() => onLanguageChange('en')}
                className={`px-2.5 py-1 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                  language === 'en'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
                title="Learn in English"
              >
                🇬🇧 English
              </button>
            </div>

            {/* Streak Counter */}
            <button
              id="streak-indicator-btn"
              onClick={() => onTabChange('progress')}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 hover:bg-amber-100 transition-colors cursor-pointer"
              title={`${streak} jours consécutifs d'apprentissage`}
            >
              <Flame className="w-4 h-4 text-amber-600 fill-amber-500 animate-pulse" />
              <span className="text-xs sm:text-sm font-bold">{streak}j</span>
            </button>

            {/* Progress / Badges trigger */}
            <button
              id="header-progress-btn"
              onClick={() => onTabChange('progress')}
              className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
              title="Fivoarana sy mari-pankasitrahana / Progression"
            >
              <Trophy className="w-5 h-5 text-stone-600" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar at top or bottom */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-stone-100 text-xs">
          <button
            onClick={() => onTabChange('today')}
            className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg cursor-pointer ${
              currentTab === 'today' ? 'text-emerald-700 font-bold' : 'text-stone-600'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Aujourd'hui</span>
          </button>
          <button
            onClick={() => onTabChange('history')}
            className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg cursor-pointer ${
              currentTab === 'history' ? 'text-amber-700 font-bold' : 'text-stone-600'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Historique</span>
          </button>
          <button
            onClick={() => onTabChange('quiz')}
            className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg cursor-pointer ${
              currentTab === 'quiz' ? 'text-indigo-700 font-bold' : 'text-stone-600'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>Quiz</span>
          </button>
          <button
            onClick={() => onTabChange('favorites')}
            className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg cursor-pointer ${
              currentTab === 'favorites' ? 'text-rose-700 font-bold' : 'text-stone-600'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span>Favoris ({favoritesCount})</span>
          </button>
          <button
            onClick={() => onTabChange('explorer')}
            className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg cursor-pointer ${
              currentTab === 'explorer' ? 'text-purple-700 font-bold' : 'text-stone-600'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>IA</span>
          </button>
        </div>

      </div>
    </header>
  );
}
