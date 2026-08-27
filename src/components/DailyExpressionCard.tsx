import { useState } from 'react';
import { Volume2, Bookmark, BookmarkCheck, CheckCircle2, Languages, Sparkles, ChevronDown, ChevronUp, Copy, Check, Quote, MessageSquareQuote, Compass } from 'lucide-react';
import { ExpressionItem, Language } from '../types';
import { speakText } from '../utils/speech';

interface DailyExpressionCardProps {
  expression: ExpressionItem;
  language: Language;
  isFavorite: boolean;
  isLearned: boolean;
  onToggleFavorite: () => void;
  onMarkLearned: () => void;
  initialOpenMalagasy?: boolean;
}

export function DailyExpressionCard({
  expression,
  language,
  isFavorite,
  isLearned,
  onToggleFavorite,
  onMarkLearned,
  initialOpenMalagasy = true,
}: DailyExpressionCardProps) {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [showMalagasy, setShowMalagasy] = useState(initialOpenMalagasy);
  const [copied, setCopied] = useState(false);

  const handlePlayAudio = () => {
    setIsPlayingAudio(true);
    speakText(expression.term, expression.language, 0.9, undefined, () => setIsPlayingAudio(false), () => setIsPlayingAudio(false));
  };

  const handlePlaySentence = () => {
    speakText(expression.example, expression.language, 0.9);
  };

  const handleCopy = () => {
    const text = `Expression: "${expression.term}" - ${expression.explanation}\nMalagasy: ${expression.malagasy.translation}\nExemple: ${expression.example}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      id={`expression-card-${expression.id}`}
      className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden transition-all hover:border-amber-200"
    >
      {/* Card Header Top Badge */}
      <div className="bg-gradient-to-r from-amber-600 to-orange-700 text-white px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase tracking-wider font-bold bg-white/20 px-2 py-0.5 rounded-md backdrop-blur-xs">
            {language === 'fr' ? 'Expression du jour' : 'Idiom of the day'}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            id={`btn-fav-exp-${expression.id}`}
            onClick={onToggleFavorite}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              isFavorite ? 'bg-white text-rose-600' : 'text-white/80 hover:bg-white/15'
            }`}
            title={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          >
            {isFavorite ? <BookmarkCheck className="w-4 h-4 fill-rose-600" /> : <Bookmark className="w-4 h-4" />}
          </button>

          <button
            id={`btn-copy-exp-${expression.id}`}
            onClick={handleCopy}
            className="p-1.5 rounded-lg text-white/80 hover:bg-white/15 transition-colors cursor-pointer"
            title="Copier l'expression et sa signification"
          >
            {copied ? <Check className="w-4 h-4 text-amber-200" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div className="p-6 space-y-5">
        {/* Main Expression Title & Register */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-stone-100 pb-4">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight font-serif">
                « {expression.term} »
              </h2>
              {expression.register && (
                <span className="text-xs font-semibold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                  {expression.register.split('/')[0].trim()}
                </span>
              )}
            </div>

            {expression.origin && (
              <p className="text-xs text-stone-600 mt-1 italic leading-relaxed">
                Origine : {expression.origin}
              </p>
            )}
          </div>

          {/* Audio Pronunciation Control */}
          <button
            id={`btn-audio-exp-${expression.id}`}
            onClick={handlePlayAudio}
            disabled={isPlayingAudio}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-semibold transition-colors cursor-pointer self-start sm:self-auto disabled:opacity-50"
            title="Écouter la prononciation"
          >
            <Volume2 className={`w-4 h-4 text-amber-700 ${isPlayingAudio ? 'animate-bounce' : ''}`} />
            <span>{language === 'fr' ? 'Prononcer' : 'Pronounce'}</span>
          </button>
        </div>

        {/* Meaning / Explanation */}
        <div className="space-y-1.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-600 flex items-center gap-1">
            <MessageSquareQuote className="w-3.5 h-3.5 text-amber-600" />
            <span>{language === 'fr' ? 'Signification & Explication' : 'Meaning & Explanation'}</span>
          </h3>
          <p className="text-base sm:text-lg text-stone-800 font-medium leading-relaxed">
            {expression.explanation}
          </p>
        </div>

        {/* Context of Use */}
        <div className="bg-amber-50/40 rounded-xl p-4 border border-amber-100 space-y-1">
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1">
            <Compass className="w-3.5 h-3.5 text-amber-700" />
            <span>{language === 'fr' ? 'Contexte d’utilisation' : 'When to use this expression'}</span>
          </h4>
          <p className="text-sm text-stone-700 leading-relaxed">
            {expression.context}
          </p>
        </div>

        {/* Example in Action */}
        <div className="border-l-3 border-amber-500 pl-4 py-1 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1">
              <Quote className="w-3.5 h-3.5 text-amber-700" />
              <span>{language === 'fr' ? 'Exemple concret' : 'Practical example'}</span>
            </span>
            <button
              onClick={handlePlaySentence}
              className="text-stone-600 hover:text-amber-700 text-xs flex items-center gap-1 cursor-pointer"
              title="Écouter la phrase exemple"
            >
              <Volume2 className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-stone-900 font-medium italic text-sm sm:text-base">
            « {expression.example} »
          </p>
          {expression.exampleTranslation && (
            <p className="text-xs text-stone-600">
              {expression.exampleTranslation}
            </p>
          )}
        </div>

        {/* ================= MALAGASY TRANSLATION & EXPLANATION SECTION ================= */}
        <div className="mt-6 pt-4 border-t border-dashed border-amber-200">
          <div className="rounded-xl bg-gradient-to-br from-amber-50/90 via-orange-50/40 to-emerald-50/40 border border-amber-200 p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold text-xs">
                  🇲🇬
                </div>
                <div>
                  <h4 className="text-sm font-bold text-amber-950 flex items-center gap-1.5">
                    <span>Fandikana sy hevitra amin'ny teny Malagasy</span>
                  </h4>
                  <p className="text-xs text-amber-800">Traduction & explication en malagasy</p>
                </div>
              </div>

              <button
                id={`btn-toggle-mg-exp-${expression.id}`}
                onClick={() => setShowMalagasy(!showMalagasy)}
                className="flex items-center gap-1 text-xs font-semibold text-amber-900 bg-white px-2.5 py-1 rounded-lg border border-amber-200 hover:bg-amber-50 transition-colors cursor-pointer"
              >
                <Languages className="w-3.5 h-3.5 text-amber-600" />
                <span>{showMalagasy ? 'Masquer' : 'Afficher'}</span>
                {showMalagasy ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>

            {showMalagasy && (
              <div className="space-y-3 pt-2 text-stone-800">
                {/* Direct Malagasy Equivalent */}
                <div className="bg-white p-3 rounded-lg border border-amber-100 shadow-2xs">
                  <div className="text-xs font-bold text-amber-800 uppercase tracking-wide">
                    Fandikana & Hevitra fototra (Signification en malagasy)
                  </div>
                  <div className="text-base font-bold text-amber-950 mt-0.5">
                    {expression.malagasy.translation}
                  </div>
                </div>

                {/* In-depth Malagasy Explanation */}
                <div className="bg-white p-3 rounded-lg border border-amber-100 shadow-2xs space-y-1">
                  <div className="text-xs font-bold text-amber-800 uppercase tracking-wide">
                    Fanazavana amin'ny antsipiriany (Explication détaillée)
                  </div>
                  <p className="text-sm text-stone-700 leading-relaxed">
                    {expression.malagasy.explanation}
                  </p>
                </div>

                {/* Translated Example */}
                {expression.malagasy.exampleInMalagasy && (
                  <div className="bg-white/80 p-3 rounded-lg border border-amber-100 text-xs sm:text-sm">
                    <span className="font-bold text-amber-900">Ohatra amin'ny teny malagasy : </span>
                    <span className="italic text-stone-800">« {expression.malagasy.exampleInMalagasy} »</span>
                  </div>
                )}

                {/* Cultural / Proverb Note */}
                {(expression.malagasy.culturalNote || expression.malagasy.proverbEquivalent) && (
                  <div className="bg-amber-100/70 p-3 rounded-lg border border-amber-300 text-xs sm:text-sm text-amber-950 space-y-1">
                    <div className="font-bold text-amber-950 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                      <span>Fomba fiteny na ohabolana malagasy mifanitsy aminy :</span>
                    </div>
                    {expression.malagasy.proverbEquivalent && (
                      <p className="font-medium text-amber-950 italic">
                        « {expression.malagasy.proverbEquivalent} »
                      </p>
                    )}
                    {expression.malagasy.culturalNote && (
                      <p className="text-amber-900">
                        {expression.malagasy.culturalNote}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions: Mark as Learned */}
        <div className="pt-2 flex items-center justify-between border-t border-stone-100">
          <button
            id={`btn-learned-exp-${expression.id}`}
            onClick={onMarkLearned}
            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              isLearned
                ? 'bg-amber-100 text-amber-900'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            <CheckCircle2 className={`w-4 h-4 ${isLearned ? 'text-amber-700' : 'text-stone-400'}`} />
            <span>{isLearned ? 'Appris ✓' : 'Marquer comme appris'}</span>
          </button>

          <span className="text-xs text-stone-600">
            {language === 'fr' ? 'Expression idiomatique' : 'Idiomatic expression'}
          </span>
        </div>
      </div>
    </div>
  );
}
