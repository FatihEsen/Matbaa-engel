export type Language = 'tr' | 'en' | 'de' | 'fr';

export type Difficulty = 'easy' | 'medium' | 'hard' | 'master';

export type PuzzleCategory =
  | 'all'
  | 'tarih'
  | 'cografya'
  | 'mutfak'
  | 'bilim'
  | 'kultur'
  | 'genel';

export type GridSize = 8 | 10 | 12;

export type WordDirection = 'across' | 'down';

/**
 * Arrow shapes originating from a clue cell (or photo border cell)
 * pointing directly into the first letter cell of a word.
 */
export type ArrowType =
  | 'right'       // starts at (r, c+1) going across
  | 'down'        // starts at (r+1, c) going down
  | 'right-down'  // starts at (r, c+1) going down
  | 'down-right'  // starts at (r+1, c) going across
  | 'up-right'    // starts at (r-1, c) going across
  | 'left-down';  // starts at (r, c-1) going down

export type LocalizedText = Record<Language, string>;

export type EngravingSvgId =
  | 'turkish-coffee'
  | 'bosphorus-ferry'
  | 'iznik-tile'
  | 'anatolian-baglama'
  | 'ottoman-astrolabe';

export interface LexiconEntry {
  answer: string; // Turkish uppercase
  category: Exclude<PuzzleCategory, 'all'>;
  difficulty: Difficulty;
  clueTr: string; // Compact in-grid clue (fits cleanly beside arrow)
  clueFullTr: string; // Editorial clue shown in Active Clue Banner
  gloss: Omit<LocalizedText, 'tr'>;
}

export interface GeneratorConfig {
  size: GridSize;
  category: PuzzleCategory;
  difficulty: Difficulty;
  seed?: string;
  mode?: 'daily' | 'custom';
  dateStr?: string; // YYYY-MM-DD when mode === 'daily'
}

export interface WordEntry {
  id: string;
  answer: string; // Authentic Turkish uppercase (Ç, Ğ, İ, I, Ö, Ş, Ü)
  clueTr: string; // Compact authentic clue shown inside the grid tile
  clueFullTr: string; // Full editorial clue shown in Active Clue Banner
  gloss: Omit<LocalizedText, 'tr'>; // Translated comprehension gloss for EN/DE/FR
  startRow: number;
  startCol: number;
  direction: WordDirection;
  clueRow: number;
  clueCol: number;
  arrow: ArrowType;
  /** Optional split position when 2 clues share the same clue tile */
  slot?: 'top' | 'bottom';
  /** True when this word is clued by the embedded PhotoBlock instead of a text clue cell */
  isPhotoClue?: boolean;
}

export interface PhotoBlock {
  row: number;
  col: number;
  rowSpan: number;
  colSpan: number;
  imageUrl?: string; // Generated editorial image URL or undefined for built-in woodcut SVG
  svgId?: EngravingSvgId;
  alt: LocalizedText;
  captionTr: string;
  wordId: string;
  /** Which cell inside the photo block hosts the directional arrow badge */
  arrowRow: number;
  arrowCol: number;
  arrow: ArrowType;
}

export interface PuzzleDefinition {
  id: string;
  issueNumber: string; // e.g. "01", "GÜN", "ÖZEL"
  difficulty: Difficulty;
  category?: PuzzleCategory;
  isGenerated?: boolean;
  isDaily?: boolean;
  dailyDate?: string;
  seed?: string;
  title: LocalizedText;
  subtitle: LocalizedText;
  theme: LocalizedText;
  rows: number;
  cols: number;
  photoBlock: PhotoBlock;
  words: WordEntry[];
}

export interface ClueSlot {
  wordId: string;
  clueTr: string;
  arrow: ArrowType;
  direction: WordDirection;
  startRow: number;
  startCol: number;
  slot?: 'top' | 'bottom';
}

export type GridCell =
  | {
      kind: 'letter';
      row: number;
      col: number;
      expected: string;
      acrossWordId?: string;
      downWordId?: string;
    }
  | {
      kind: 'clue';
      row: number;
      col: number;
      clues: ClueSlot[];
    }
  | {
      kind: 'photo';
      row: number;
      col: number;
      isAnchor: boolean;
      photo: PhotoBlock;
    };

export type CellFlag = 'normal' | 'checked-ok' | 'checked-error' | 'revealed';

export interface PuzzleProgress {
  entries: Record<string, string>; // "r,c" -> Turkish uppercase char
  flags: Record<string, CellFlag>;
  elapsedSeconds: number;
  hintsUsed: number;
  checksUsed: number;
  completedAt?: string;
  bestScore?: number;
  bestTimeSeconds?: number;
}

export interface UserProfile {
  language: Language;
  autoCheck: boolean;
  showClueGloss: boolean;
  soundEnabled: boolean;
  showKeyboard: boolean;
  currentStreak: number;
  bestStreak: number;
  lastSolvedDate?: string; // YYYY-MM-DD
  progressByPuzzle: Record<string, PuzzleProgress>;
  generatedPuzzles: PuzzleDefinition[];
}

export type ActiveView = 'play' | 'archive' | 'stats' | 'guide';

export type PrintMode = 'blank' | 'progress' | 'solution';
