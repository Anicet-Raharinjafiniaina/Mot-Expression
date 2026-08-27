import { useState } from 'react';
import { Volume2, Bookmark, BookmarkCheck, CheckCircle2, Languages, Sparkles, ChevronDown, ChevronUp, Copy, Check, Quote, Lightbulb } from 'lucide-react';
import { WordItem, Language } from '../types';
import { speakText } from '../utils/speech';

interface DailyWordCardProps {
  word: WordItem;
  language: Language;
  isFavorite: boolean;
  isLearned: boolean;
  onToggleFavorite: () => void;
  onMarkLearned: () => void;
  initialOpenMalagasy?: boolean;
}

export function DailyWordCard({
  word,
  language,
  isFavorite,
  isLearned,
  onToggleFavorite,
  onMarkLearned,
  initialOpenMalagasy = true,
}: DailyWordCardProps) {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isPlayingSlow, setIsPlayingSlow] = useState(false);
  const [showMalagasy, setShowMalagasy] = useState(initialOpenMalagasy);
  const [copied, setCopied] = useState(false);

  const handlePlayAudio = (slow: boolean = false) => {
    if (slow) {
      setIsPlayingSlow(true);
      speakText(word.term, word.language, 0.7, undefined, () => setIsPlayingSlow(false), () => setIsPlayingSlow(false));
    } else {
      setIsPlayingAudio(true);
      speakText(word.term, word.language, 0.95, undefined, () => setIsPlayingAudio(false), () => setIsPlayingAudio(false));
    }
  };

  const handlePlaySentence = () => {
    speakText(word.example, word.language, 0.95);
  };

  const handleCopy = () => {
    const text = `${word.term} (${word.partOfSpeech}) - ${word.definition}\nMalagasy: ${word.malagasy.translation}\nExemple: ${word.example}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      id={`word-card-${word.id}`}
      className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden transition-all hover:border-emerald-200"
    >
      {/* Card Header Top Badge */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase tracking-wider font-bold bg-white/20 px-2 py-0.5 rounded-md backdrop-blur-xs">
            {language === 'fr' ? 'Mot du jour' : 'Word of the day'}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            id={`btn-fav-word-${word.id}`}
            onClick={onToggleFavorite}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              isFavorite ? 'bg-white text-rose-600' : 'text-white/80 hover:bg-white/15'
            }`}
            title={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          >
            {isFavorite ? <BookmarkCheck className="w-4 h-4 fill-rose-600" /> : <Bookmark className="w-4 h-4" />}
          </button>

          <button
            id={`btn-copy-word-${word.id}`}
            onClick={handleCopy}
            className="p-1.5 rounded-lg text-white/80 hover:bg-white/15 transition-colors cursor-pointer"
            title="Copier le mot et sa définition"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-200" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div className="p-6 space-y-5">
        {/* Main Word Title & Phonetics */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-stone-100 pb-4">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-3xl font-extrabold text-stone-900 tracking-tight font-serif">
                {word.term}
              </h2>
              <span className="text-sm font-medium text-stone-500 bg-stone-100 px-2.5 py-0.5 rounded-full border border-stone-200">
                {word.partOfSpeech}
              </span>
              {word.phonetic && (
                <span className="text-sm text-stone-500 font-mono">
                  {word.phonetic}
                </span>
              )}
            </div>

            {word.difficulty && (
              <div className="mt-1 flex items-center gap-2">
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                  {word.difficulty.split('/')[0].trim()}
                </span>
                {word.etymology && (
                  <span className="text-xs text-stone-600 italic">
                    {word.etymology}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Audio Pronunciation Controls */}
          <div className="flex items-center gap-2">
            <button
              id={`btn-audio-normal-${word.id}`}
              onClick={() => handlePlayAudio(false)}
              disabled={isPlayingAudio}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
              title="Écouter la prononciation"
            >
              <Volume2 className={`w-4 h-4 text-emerald-700 ${isPlayingAudio ? 'animate-bounce' : ''}`} />
              <span>{language === 'fr' ? 'Écouter' : 'Listen'}</span>
            </button>

            <button
              id={`btn-audio-slow-${word.id}`}
              onClick={() => handlePlayAudio(true)}
              disabled={isPlayingSlow}
              className="px-2 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 text-xs font-medium transition-colors cursor-pointer"
              title="Prononciation lente pour débutant"
            >
              <span>0.7x</span>
            </button>
          </div>
        </div>

        {/* Definition Section */}
        <div className="space-y-1.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-600 flex items-center gap-1">
            <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
            <span>{language === 'fr' ? 'Définition' : 'Definition'}</span>
          </h3>
          <p className="text-base sm:text-lg text-stone-800 font-medium leading-relaxed">
            {word.definition}
          </p>
        </div>

        {/* In-depth Explanation / Context of Use */}
        <div className="bg-stone-50 rounded-xl p-4 border border-stone-200/70 space-y-1.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-600">
            {language === 'fr' ? 'Comprendre le sens et l’utilisation' : 'Nuances & Usage context'}
          </h4>
          <p className="text-sm text-stone-700 leading-relaxed">
            {word.explanation}
          </p>
        </div>

        {/* Real-life Contextual Example */}
        <div className="border-l-3 border-emerald-500 pl-4 py-1 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1">
              <Quote className="w-3.5 h-3.5 text-emerald-600" />
              <span>{language === 'fr' ? 'Exemple en contexte' : 'Example in context'}</span>
            </span>
            <button
              onClick={handlePlaySentence}
              className="text-stone-600 hover:text-emerald-700 text-xs flex items-center gap-1 cursor-pointer"
              title="Écouter la phrase"
            >
              <Volume2 className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-stone-900 font-medium italic text-sm sm:text-base">
            « {word.example} »
          </p>
          {word.exampleTranslation && (
            <p className="text-xs text-stone-600">
              {word.exampleTranslation}
            </p>
          )}
        </div>

        {/* Synonyms if available */}
        {word.synonyms && word.synonyms.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="text-stone-600 font-medium">Synonymes :</span>
            {word.synonyms.map((syn, idx) => (
              <span
                key={idx}
                className="bg-stone-100 text-stone-700 px-2 py-0.5 rounded-md border border-stone-200"
              >
                {syn}
              </span>
            ))}
          </div>
        )}

        {/* ================= FRENCH TRANSLATION SECTION ================= */}
        {language === 'en' && word.frenchTranslation && (
          <div className="mt-6 pt-4 border-t border-dashed border-sky-200">
            <div className="rounded-xl bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50/40 border border-sky-200 p-4 sm:p-5 space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                  🇫🇷
                </div>
                <div>
                  <h4 className="text-sm font-bold text-sky-950">Traduction en français</h4>
                  <p className="text-xs text-sky-700">Traduction française du terme</p>
                </div>
              </div>

              <div className="bg-white p-3 rounded-lg border border-sky-100 shadow-2xs">
                <div className="text-xs font-bold text-sky-800 uppercase tracking-wide">
                  Traduction française
                </div>
                <div className="text-base font-bold text-sky-900 mt-0.5">
                  {word.frenchTranslation}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= MALAGASY TRANSLATION & EXPLANATION SECTION ================= */}
        <div className="mt-6 pt-4 border-t border-dashed border-emerald-200">
          <div className="rounded-xl bg-gradient-to-br from-emerald-50/80 via-teal-50/50 to-amber-50/40 border border-emerald-200 p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                  🇲🇬
                </div>
                <div>
                  <h4 className="text-sm font-bold text-emerald-950 flex items-center gap-1.5">
                    <span>Fandikana sy fanazavana amin'ny teny Malagasy</span>
                  </h4>
                  <p className="text-xs text-emerald-700">Traduction & explication en malagasy</p>
                </div>
              </div>

              <button
                id={`btn-toggle-mg-word-${word.id}`}
                onClick={() => setShowMalagasy(!showMalagasy)}
                className="flex items-center gap-1 text-xs font-semibold text-emerald-800 bg-white px-2.5 py-1 rounded-lg border border-emerald-200 hover:bg-emerald-50 transition-colors cursor-pointer"
              >
                <Languages className="w-3.5 h-3.5 text-emerald-600" />
                <span>{showMalagasy ? 'Masquer' : 'Afficher'}</span>
                {showMalagasy ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>

            {showMalagasy && (
              <div className="space-y-3 pt-2 text-stone-800">
                {/* Direct Malagasy Translation */}
                <div className="bg-white p-3 rounded-lg border border-emerald-100 shadow-2xs">
                  <div className="text-xs font-bold text-emerald-800 uppercase tracking-wide">
                    Dikan-teny mivantana (Traduction)
                  </div>
                  <div className="text-base font-bold text-emerald-900 mt-0.5">
                    {word.malagasy.translation}
                  </div>
                </div>

                {/* In-depth Malagasy Explanation */}
                <div className="bg-white p-3 rounded-lg border border-emerald-100 shadow-2xs space-y-1">
                  <div className="text-xs font-bold text-emerald-800 uppercase tracking-wide">
                    Fanazavana ny hevitra sy ny fampiasana azy (Explication)
                  </div>
                  <p className="text-sm text-stone-700 leading-relaxed">
                    {word.malagasy.explanation}
                  </p>
                </div>

                {/* Translated Example */}
                {word.malagasy.exampleInMalagasy && (
                  <div className="bg-white/80 p-3 rounded-lg border border-emerald-100 text-xs sm:text-sm">
                    <span className="font-bold text-emerald-800">Fandikana ny ohatra : </span>
                    <span className="italic text-stone-800">« {word.malagasy.exampleInMalagasy} »</span>
                  </div>
                )}

                {/* Cultural / Proverb Note */}
                {(word.malagasy.culturalNote || word.malagasy.proverbEquivalent) && (
                  <div className="bg-amber-50/90 p-3 rounded-lg border border-amber-200 text-xs sm:text-sm text-amber-950 space-y-1">
                    <div className="font-bold text-amber-900 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      <span>Fahendrena & Fomba fijery malagasy :</span>
                    </div>
                    {word.malagasy.proverbEquivalent && (
                      <p className="font-medium text-amber-900 italic">
                        Ohabolana : « {word.malagasy.proverbEquivalent} »
                      </p>
                    )}
                    {word.malagasy.culturalNote && (
                      <p className="text-amber-900/90">
                        {word.malagasy.culturalNote}
                      </p>
                    )}
                  </div>
                )}

                {/* Malagasy Synonyms */}
                {word.malagasy.synonymsMalagasy && word.malagasy.synonymsMalagasy.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap text-xs pt-1">
                    <span className="font-semibold text-emerald-900">Teny mitovy hevitra :</span>
                    {word.malagasy.synonymsMalagasy.map((syn, idx) => (
                      <span
                        key={idx}
                        className="bg-emerald-100/70 text-emerald-900 px-2 py-0.5 rounded font-medium"
                      >
                        {syn}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions: Mark as Learned */}
        <div className="pt-2 flex items-center justify-between border-t border-stone-100">
          <button
            id={`btn-learned-word-${word.id}`}
            onClick={onMarkLearned}
            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              isLearned
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            <CheckCircle2 className={`w-4 h-4 ${isLearned ? 'text-emerald-700' : 'text-stone-400'}`} />
            <span>{isLearned ? 'Appris ✓' : 'Marquer comme appris'}</span>
          </button>

          <span className="text-xs text-stone-600">
            {language === 'fr' ? 'Vocabulaire quotidien' : 'Daily vocabulary'}
          </span>
        </div>
      </div>
    </div>
  );
}
