import { PuzzleProgress, UserProfile } from '../types/puzzle';

const STORAGE_KEY = 'matbaa_cengel_profile_v1';

export function createEmptyProgress(): PuzzleProgress {
  return {
    entries: {},
    flags: {},
    elapsedSeconds: 0,
    hintsUsed: 0,
    checksUsed: 0,
  };
}

export function createDefaultProfile(): UserProfile {
  return {
    language: 'tr',
    autoCheck: false,
    showClueGloss: true,
    soundEnabled: true,
    showKeyboard: true,
    currentStreak: 0,
    bestStreak: 0,
    progressByPuzzle: {},
    generatedPuzzles: [],
  };
}

export function loadUserProfile(): UserProfile {
  if (typeof window === 'undefined') return createDefaultProfile();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return createDefaultProfile();
    const parsed = JSON.parse(raw) as Partial<UserProfile>;
    return {
      ...createDefaultProfile(),
      ...parsed,
      progressByPuzzle: parsed.progressByPuzzle ?? {},
      generatedPuzzles: Array.isArray(parsed.generatedPuzzles) ? parsed.generatedPuzzles : [],
    };
  } catch {
    return createDefaultProfile();
  }
}

export function saveUserProfile(profile: UserProfile): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch {
    // Ignore storage quota errors gracefully
  }
}
