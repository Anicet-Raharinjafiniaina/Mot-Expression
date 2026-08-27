export type Language = 'fr' | 'en';

export type ItemType = 'word' | 'expression';

export interface MalagasyExplanation {
  translation: string;
  explanation: string;
  exampleInMalagasy: string;
  culturalNote?: string;
  synonymsMalagasy?: string[];
  proverbEquivalent?: string;
}

export interface WordItem {
  id: string;
  date: string; // YYYY-MM-DD
  language: Language;
  term: string;
  partOfSpeech: string;
  phonetic: string;
  definition: string;
  explanation: string;
  example: string;
  exampleTranslation: string;
  synonyms?: string[];
  etymology?: string;
  difficulty?: string;
  tags?: string[];
  malagasy: MalagasyExplanation;
}

export interface ExpressionItem {
  id: string;
  date: string; // YYYY-MM-DD
  language: Language;
  term: string;
  register?: string;
  origin?: string;
  explanation: string;
  context: string;
  example: string;
  exampleTranslation: string;
  malagasy: MalagasyExplanation;
}

export interface DailyEntry {
  date: string; // YYYY-MM-DD
  displayDate: {
    fr: string;
    en: string;
    mg: string;
  };
  fr: {
    word: WordItem;
    expression: ExpressionItem;
  };
  en: {
    word: WordItem;
    expression: ExpressionItem;
  };
  quiz: QuizQuestion[];
}

export interface QuizQuestion {
  id: string;
  type: 'definition' | 'malagasy' | 'fill-blank' | 'context';
  language: Language;
  targetTerm: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  malagasyExplanation: string;
}

export interface FavoriteItem {
  id: string;
  term: string;
  type: ItemType;
  language: Language;
  dateAdded: string;
  definitionOrExplanation: string;
  malagasyTranslation: string;
  item: WordItem | ExpressionItem;
}

export interface Badge {
  id: string;
  title: string;
  titleMg: string;
  description: string;
  iconName: string;
  unlocked: boolean;
  unlockedAt?: string;
  threshold: number;
  type: 'streak' | 'words_learned' | 'quiz_passed' | 'favorites_saved';
}

export interface UserProgress {
  streak: number;
  lastActiveDate: string;
  completedDates: string[];
  learnedItemIds: string[];
  favorites: FavoriteItem[];
  quizScores: {
    date: string;
    score: number;
    total: number;
    completedAt: string;
  }[];
  unlockedBadgeIds: string[];
}
