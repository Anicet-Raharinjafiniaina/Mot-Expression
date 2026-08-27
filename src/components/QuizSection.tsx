import { useState } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, CheckCircle, XCircle, ArrowRight, RotateCcw, Sparkles, Award, Lightbulb, Languages, Volume2 } from 'lucide-react';
import { QuizQuestion, Language } from '../types';
import { speakText } from '../utils/speech';

interface QuizSectionProps {
  questions: QuizQuestion[];
  language: Language;
  dateStr: string;
  onQuizCompleted: (score: number, total: number) => void;
  onGoToToday: () => void;
}

export function QuizSection({
  questions,
  language,
  dateStr,
  onQuizCompleted,
  onGoToToday,
}: QuizSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [userAnswers, setUserAnswers] = useState<{ selected: number; isCorrect: boolean }[]>([]);

  const currentQ = questions[currentIndex] || questions[0];

  const handleSelectOption = (idx: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(idx);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null || isAnswerSubmitted) return;

    const isCorrect = selectedOption === currentQ.correctIndex;
    setIsAnswerSubmitted(true);
    if (isCorrect) {
      setScore((s) => s + 1);
    }
    setUserAnswers((prev) => [...prev, { selected: selectedOption, isCorrect }]);
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((i) => i + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      // Quiz finished
      const finalScore = score + (selectedOption === currentQ.correctIndex ? 0 : 0); // score already updated
      setIsFinished(true);
      onQuizCompleted(score, questions.length);

      if (score + (selectedOption === currentQ.correctIndex ? 1 : 0) === questions.length) {
        // Full score celebratory confetti!
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setIsFinished(false);
    setUserAnswers([]);
  };

  const handlePronounce = (term: string) => {
    speakText(term, language);
  };

  if (!questions || questions.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-stone-200 p-8 text-center max-w-xl mx-auto space-y-4">
        <Trophy className="w-12 h-12 text-stone-400 mx-auto" />
        <h3 className="text-xl font-bold text-stone-800">Aucun quiz disponible</h3>
        <p className="text-stone-600 text-sm">
          Découvrez d’abord le mot et l’expression du jour avant de passer le quiz.
        </p>
        <button
          onClick={onGoToToday}
          className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-semibold text-sm hover:bg-emerald-700 transition cursor-pointer"
        >
          Voir le mot du jour
        </button>
      </div>
    );
  }

  if (isFinished) {
    const isPerfect = score === questions.length;
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-stone-200 shadow-md p-6 sm:p-8 space-y-6 text-center animate-fadeIn">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-amber-400 to-emerald-500 text-white flex items-center justify-center shadow-lg">
          {isPerfect ? <Trophy className="w-10 h-10 animate-bounce" /> : <Award className="w-10 h-10" />}
        </div>

        <div className="space-y-2">
          <span className="text-xs uppercase tracking-wider font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Quiz terminé !
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
            {isPerfect
              ? 'Score parfait ! Félicitations !'
              : score >= questions.length / 2
              ? 'Bravo ! Bon travail !'
              : 'Bel effort ! Continuez à vous entraîner !'}
          </h2>
          <p className="text-stone-600 text-sm">
            Vous avez obtenu <span className="font-bold text-stone-900">{score}</span> sur{' '}
            <span className="font-bold text-stone-900">{questions.length}</span> bonnes réponses.
          </p>
        </div>

        {/* Score Visual Bar */}
        <div className="w-full bg-stone-100 h-3 rounded-full overflow-hidden">
          <div
            className="bg-emerald-500 h-full transition-all duration-700"
            style={{ width: `${(score / questions.length) * 100}%` }}
          />
        </div>

        {/* Recap list */}
        <div className="text-left space-y-3 pt-4 border-t border-stone-100">
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-600">
            Récapitulatif des réponses
          </h4>
          {questions.map((q, idx) => {
            const ans = userAnswers[idx];
            return (
              <div
                key={q.id}
                className={`p-3 rounded-xl border text-sm ${
                  ans?.isCorrect
                    ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                    : 'bg-rose-50/60 border-rose-200 text-rose-950'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <p className="font-semibold">{q.question}</p>
                    <p className="text-xs text-stone-600">
                      Bonne réponse : <span className="font-bold text-emerald-800">{q.options[q.correctIndex]}</span>
                    </p>
                    <p className="text-xs italic text-stone-500">{q.malagasyExplanation}</p>
                  </div>
                  {ans?.isCorrect ? (
                    <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                  ) : (
                    <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <button
            onClick={handleRestart}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl font-semibold text-sm transition cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Réessayer</span>
          </button>

          <button
            onClick={onGoToToday}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold text-sm shadow-sm transition cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Continuer l'apprentissage</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Quiz Header Info */}
      <div className="flex items-center justify-between bg-white rounded-2xl border border-stone-200 px-5 py-3 shadow-2xs">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-indigo-600" />
          <span className="font-bold text-sm text-stone-900">Quiz & Exercices</span>
          <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-medium border border-indigo-100">
            {language === 'fr' ? 'Français' : 'English'}
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-stone-600">
          <span>Question {currentIndex + 1} / {questions.length}</span>
          <div className="w-20 bg-stone-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-indigo-600 h-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Question Card */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 sm:p-8 space-y-6">
        
        {/* Question Header & Target Term */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-md">
              {currentQ.type === 'malagasy'
                ? '🇲🇬 Traduction Malagasy'
                : currentQ.type === 'definition'
                ? '📖 Définition & Sens'
                : '💡 Contexte & Utilisation'}
            </span>
            {currentQ.targetTerm && (
              <button
                onClick={() => handlePronounce(currentQ.targetTerm)}
                className="flex items-center gap-1 text-xs text-stone-600 hover:text-indigo-600 cursor-pointer font-medium"
                title="Écouter le mot cible"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>{currentQ.targetTerm}</span>
              </button>
            )}
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-stone-900 leading-snug">
            {currentQ.question}
          </h3>
        </div>

        {/* Options List */}
        <div className="space-y-3">
          {currentQ.options.map((option, idx) => {
            let optionStyles = 'border-stone-200 hover:border-stone-400 bg-white text-stone-800';

            if (selectedOption === idx) {
              optionStyles = 'border-indigo-600 bg-indigo-50/70 text-indigo-950 font-semibold ring-2 ring-indigo-500/20';
            }

            if (isAnswerSubmitted) {
              if (idx === currentQ.correctIndex) {
                optionStyles = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-bold ring-2 ring-emerald-500/30';
              } else if (selectedOption === idx && idx !== currentQ.correctIndex) {
                optionStyles = 'border-rose-500 bg-rose-50 text-rose-950 font-medium ring-2 ring-rose-500/30';
              } else {
                optionStyles = 'opacity-50 border-stone-200 bg-stone-50 text-stone-600';
              }
            }

            return (
              <button
                key={idx}
                id={`quiz-opt-${idx}`}
                onClick={() => handleSelectOption(idx)}
                disabled={isAnswerSubmitted}
                className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 cursor-pointer disabled:cursor-default ${optionStyles}`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-xl bg-stone-100 flex items-center justify-center font-bold text-xs text-stone-700 shrink-0">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="text-sm sm:text-base">{option}</span>
                </div>

                {isAnswerSubmitted && idx === currentQ.correctIndex && (
                  <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 animate-scale" />
                )}
                {isAnswerSubmitted && selectedOption === idx && idx !== currentQ.correctIndex && (
                  <XCircle className="w-5 h-5 text-rose-600 shrink-0 animate-scale" />
                )}
              </button>
            );
          })}
        </div>

        {/* Detailed Explanation Banner on Submit */}
        {isAnswerSubmitted && (
          <div className="rounded-2xl bg-stone-50 border border-stone-200 p-4 space-y-2 animate-fadeIn">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-600" />
              <span className="text-xs font-bold uppercase tracking-wider text-stone-700">
                Explication
              </span>
            </div>
            <p className="text-sm text-stone-800 leading-relaxed">
              {currentQ.explanation}
            </p>
            {currentQ.malagasyExplanation && (
              <div className="pt-2 border-t border-stone-200/60 text-xs text-emerald-900 bg-emerald-50/60 p-2.5 rounded-xl border border-emerald-100">
                <span className="font-bold">🇲🇬 Explication en malagasy : </span>
                <span>{currentQ.malagasyExplanation}</span>
              </div>
            )}
          </div>
        )}

        {/* Action Controls */}
        <div className="pt-2 flex items-center justify-end gap-3">
          {!isAnswerSubmitted ? (
            <button
              id="quiz-submit-btn"
              onClick={handleSubmitAnswer}
              disabled={selectedOption === null}
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:hover:bg-indigo-600 text-white font-semibold text-sm transition shadow-xs cursor-pointer"
            >
              Valider la réponse
            </button>
          ) : (
            <button
              id="quiz-next-btn"
              onClick={handleNextQuestion}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition shadow-xs cursor-pointer"
            >
              <span>{currentIndex + 1 < questions.length ? 'Question suivante' : 'Voir les résultats'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
