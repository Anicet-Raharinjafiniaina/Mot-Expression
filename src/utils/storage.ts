import { UserProgress, FavoriteItem, Badge } from '../types';
import { INITIAL_BADGES } from '../data/curatedData';

const STORAGE_KEY = 'vocab_user_progress_v1';

export function getStoredProgress(): UserProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return getInitialProgress();
    }
    const parsed = JSON.parse(raw);
    return {
      ...getInitialProgress(),
      ...parsed,
    };
  } catch (e) {
    console.error('Failed to load progress from localStorage', e);
    return getInitialProgress();
  }
}

export function saveStoredProgress(progress: UserProgress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (e) {
    console.error('Failed to save progress to localStorage', e);
  }
}

export function getInitialProgress(): UserProgress {
  return {
    streak: 1,
    lastActiveDate: new Date().toISOString().split('T')[0],
    completedDates: [new Date().toISOString().split('T')[0]],
    learnedItemIds: [],
    favorites: [],
    quizScores: [],
    unlockedBadgeIds: ['first_word'],
  };
}

export function updateDailyActivity(progress: UserProgress): UserProgress {
  const today = new Date().toISOString().split('T')[0];
  const lastActive = progress.lastActiveDate;

  if (lastActive === today) {
    return progress;
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  let newStreak = progress.streak;
  if (lastActive === yesterdayStr) {
    newStreak += 1;
  } else {
    // Reset streak if missed more than 1 day
    newStreak = 1;
  }

  const completedDates = progress.completedDates.includes(today)
    ? progress.completedDates
    : [...progress.completedDates, today];

  const updated: UserProgress = {
    ...progress,
    streak: newStreak,
    lastActiveDate: today,
    completedDates,
  };

  return checkAndUnlockBadges(updated);
}

export function toggleFavoriteItem(progress: UserProgress, item: FavoriteItem): UserProgress {
  const exists = progress.favorites.some((f) => f.id === item.id);
  const newFavorites = exists
    ? progress.favorites.filter((f) => f.id !== item.id)
    : [item, ...progress.favorites];

  const updated: UserProgress = {
    ...progress,
    favorites: newFavorites,
  };

  return checkAndUnlockBadges(updated);
}

export function markItemAsLearned(progress: UserProgress, itemId: string): UserProgress {
  if (progress.learnedItemIds.includes(itemId)) {
    return progress;
  }

  const updated: UserProgress = {
    ...progress,
    learnedItemIds: [...progress.learnedItemIds, itemId],
  };

  return checkAndUnlockBadges(updated);
}

export function recordQuizScore(
  progress: UserProgress,
  date: string,
  score: number,
  total: number
): UserProgress {
  const entry = {
    date,
    score,
    total,
    completedAt: new Date().toISOString(),
  };

  const updated: UserProgress = {
    ...progress,
    quizScores: [entry, ...progress.quizScores.filter((q) => q.date !== date)],
  };

  return checkAndUnlockBadges(updated);
}

export function checkAndUnlockBadges(progress: UserProgress): UserProgress {
  const unlocked = new Set(progress.unlockedBadgeIds);
  const today = new Date().toISOString();

  INITIAL_BADGES.forEach((badge) => {
    if (unlocked.has(badge.id)) return;

    let shouldUnlock = false;
    if (badge.type === 'streak' && progress.streak >= badge.threshold) {
      shouldUnlock = true;
    } else if (badge.type === 'words_learned' && progress.learnedItemIds.length >= badge.threshold) {
      shouldUnlock = true;
    } else if (badge.type === 'favorites_saved' && progress.favorites.length >= badge.threshold) {
      shouldUnlock = true;
    } else if (
      badge.type === 'quiz_passed' &&
      progress.quizScores.some((q) => q.score === q.total && q.total > 0)
    ) {
      shouldUnlock = true;
    }

    if (shouldUnlock) {
      unlocked.add(badge.id);
    }
  });

  return {
    ...progress,
    unlockedBadgeIds: Array.from(unlocked),
  };
}

export function getFullBadgesList(progress: UserProgress): Badge[] {
  return INITIAL_BADGES.map((b) => ({
    ...b,
    unlocked: progress.unlockedBadgeIds.includes(b.id),
  }));
}
