import { Flame, Trophy, Award, CheckCircle, BookOpen, Bookmark, Zap, Calendar, Sparkles, Footprints } from 'lucide-react';
import { UserProgress, Badge } from '../types';
import { getFullBadgesList } from '../utils/storage';

interface ProgressSectionProps {
  progress: UserProgress;
  onGoToToday: () => void;
  onGoToQuiz: () => void;
}

const ICON_MAP: Record<string, any> = {
  Footprints,
  Flame,
  Zap,
  BookOpen,
  Trophy,
  Bookmark,
};

export function ProgressSection({
  progress,
  onGoToToday,
  onGoToQuiz,
}: ProgressSectionProps) {
  const allBadges = getFullBadgesList(progress);
  const unlockedCount = allBadges.filter((b) => b.unlocked).length;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Streak */}
        <div className="bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-3xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold text-amber-100 tracking-wider">
              Série de jours
            </span>
            <Flame className="w-5 h-5 text-amber-200 fill-amber-200" />
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold">{progress.streak} {progress.streak > 1 ? 'jours' : 'jour'}</div>
          <p className="text-xs text-amber-100/90">
            Régularité quotidienne
          </p>
        </div>

        {/* Words Learned */}
        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-3xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold text-emerald-100 tracking-wider">
              Mots appris
            </span>
            <BookOpen className="w-5 h-5 text-emerald-200" />
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold">{progress.learnedItemIds.length}</div>
          <p className="text-xs text-emerald-100/90">
            Mots & expressions maîtrisés
          </p>
        </div>

        {/* Quizzes Passed */}
        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white rounded-3xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold text-indigo-100 tracking-wider">
              Quiz complétés
            </span>
            <Trophy className="w-5 h-5 text-indigo-200" />
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold">{progress.quizScores.length}</div>
          <p className="text-xs text-indigo-100/90">
            Sessions d'évaluation terminées
          </p>
        </div>

        {/* Badges Unlocked */}
        <div className="bg-gradient-to-br from-rose-500 to-pink-600 text-white rounded-3xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold text-rose-100 tracking-wider">
              Badges obtenus
            </span>
            <Award className="w-5 h-5 text-rose-200" />
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold">{unlockedCount} / {allBadges.length}</div>
          <p className="text-xs text-rose-100/90">
            Trophées débloqués
          </p>
        </div>
      </div>

      {/* Badges Gallery */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-stone-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              <span>Badges & Trophées</span>
            </h3>
            <p className="text-xs text-stone-600">
              Gagnez des distinctions selon votre régularité et vos progrès quotidiens
            </p>
          </div>

          <div className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
            {Math.round((unlockedCount / allBadges.length) * 100)}% Complété
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {allBadges.map((badge) => {
            const IconComponent = ICON_MAP[badge.iconName] || Trophy;

            return (
              <div
                key={badge.id}
                className={`p-4 rounded-2xl border transition-all flex items-start gap-3.5 ${
                  badge.unlocked
                    ? 'bg-gradient-to-br from-amber-50/70 via-white to-emerald-50/40 border-amber-300/80 shadow-2xs'
                    : 'bg-stone-50 border-stone-200 opacity-60'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                    badge.unlocked
                      ? 'bg-gradient-to-tr from-amber-500 to-emerald-500 text-white shadow-xs'
                      : 'bg-stone-200 text-stone-400'
                  }`}
                >
                  <IconComponent className="w-6 h-6" />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-sm font-bold text-stone-900">
                      {badge.title}
                    </h4>
                    {badge.unlocked && (
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    )}
                  </div>
                  <p className="text-xs font-semibold text-emerald-800">
                    🇲🇬 {badge.titleMg}
                  </p>
                  <p className="text-xs text-stone-600 leading-snug">
                    {badge.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Motivational Malagasy Proverb Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-stone-900 text-white rounded-3xl p-6 sm:p-8 space-y-3 shadow-md">
        <div className="flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-4 h-4" />
          <span>Fahendrena Malagasy momba ny fianarana</span>
        </div>
        <blockquote className="text-lg sm:text-xl font-serif italic text-emerald-100">
          « Ny fianarana toy ny mitaingina lakana miakatra riana : raha tsy mandroso dia mihemotra. »
        </blockquote>
        <p className="text-xs text-stone-300 leading-relaxed">
          Mianara teny iray sy fomba fiteny iray isan'andro mba hanananao voambolana manankarena sy fahaiza-mandaha-teny miavaka.
        </p>

        <div className="pt-2 flex items-center gap-3">
          <button
            onClick={onGoToToday}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-stone-950 font-bold rounded-xl text-xs transition cursor-pointer"
          >
            Hianatra teny androany
          </button>
          <button
            onClick={onGoToQuiz}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl text-xs transition cursor-pointer"
          >
            Hanao Quiz kely
          </button>
        </div>
      </div>
    </div>
  );
}
