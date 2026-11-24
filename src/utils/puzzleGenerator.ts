import {
  LEXICON_BY_LENGTH,
  PHOTO_CLUE_THEMES,
  PhotoClueTheme,
} from '../data/lexicon';
import {
  ArrowType,
  Difficulty,
  GeneratorConfig,
  GridSize,
  LexiconEntry,
  PuzzleCategory,
  PuzzleDefinition,
  WordEntry,
} from '../types/puzzle';
import { validatePuzzle } from './gridEngine';
import { splitTurkishChars } from './turkish';

/**
 * Deterministic seeded PRNG (FNV-1a + Mulberry32)
 */
export function createSeededRng(seedStr: string): () => number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < seedStr.length; i++) {
    h ^= seedStr.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  let state = h >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface TemplateSlot {
  index: number;
  direction: 'across' | 'down';
  startRow: number;
  startCol: number;
  length: number;
  clueRow: number;
  clueCol: number;
  arrow: ArrowType;
  isPhotoClue?: boolean;
  slot?: 'top' | 'bottom';
  cells: Array<{ row: number; col: number; charIndex: number }>;
  intersections: Array<{
    myCharIndex: number;
    otherSlotIndex: number;
    otherCharIndex: number;
  }>;
}

/**
 * Verified çengel bulmaca grid masks for 8x8, 10x10, and 12x12.
 * All horizontal and vertical runs are length 2..6 and originate from valid adjacent clue cells.
 */
const GRID_MASKS: Record<GridSize, string[][]> = {
  8: [
    // 8x8 Template A (5-letter photo answer)
    [
      'PP######',
      'PPLLLLL#',
      '#LLL#LLL',
      '#LL#LLL#',
      '##LLL#LL',
      '#L#LLL#L',
      '#LLL#LLL',
      '##LL#LL#',
    ],
    // 8x8 Template B (6-letter photo answer)
    [
      'PP######',
      'PPLLLLLL',
      '#LLL#LLL',
      '#LL#LLL#',
      '##LLL#LL',
      '#L#LLL#L',
      '#LLL#LLL',
      '##LL#LL#',
    ],
    // 8x8 Template C (4-letter photo answer)
    [
      'PP######',
      'PPLLLL##',
      '#LLL#LLL',
      '#LL#LLL#',
      '##LLL#LL',
      '#L#LLL#L',
      '#LLL#LLL',
      '##LL#LL#',
    ],
  ],
  10: [
    // 10x10 Template A (5-letter photo answer)
    [
      'PP########',
      'PPLLLLL#LL',
      '#LLL#LLL#L',
      '#LL#LLL#LL',
      '##LLL#LLL#',
      '#L#LLL#LLL',
      '#LLL#LL#LL',
      '#LL#LLLL#L',
      '##LLL#LLLL',
      '#LL#LLL#LL',
    ],
    // 10x10 Template B (6-letter photo answer)
    [
      'PP########',
      'PPLLLLLL#L',
      '#LLL#LLL#L',
      '#LL#LLL#LL',
      '##LLL#LLL#',
      '#L#LLL#LLL',
      '#LLL#LL#LL',
      '#LL#LLLL#L',
      '##LLL#LLLL',
      '#LL#LLL#LL',
    ],
    // 10x10 Template C (4-letter photo answer)
    [
      'PP########',
      'PPLLLL#LLL',
      '#LLL#LLL#L',
      '#LL#LLL#LL',
      '##LLL#LLL#',
      '#L#LLL#LLL',
      '#LLL#LL#LL',
      '#LL#LLLL#L',
      '##LLL#LLLL',
      '#LL#LLL#LL',
    ],
  ],
  12: [
    // 12x12 Template A (5-letter photo answer)
    [
      'PP##########',
      'PPLLLLL#LLL#',
      '#LLL#LLL#LLL',
      '#LL#LLL#LL#L',
      '##LLL#LLL#LL',
      '#L#LLL#LLLL#',
      '#LLL#LL#LL#L',
      '#LL#LLLL#LLL',
      '##LLL#LLL#LL',
      '#L#LLL#LLL#L',
      '#LLL#LL#LLLL',
      '#LL#LLLL#LL#',
    ],
    // 12x12 Template B (6-letter photo answer)
    [
      'PP##########',
      'PPLLLLLL#LL#',
      '#LLL#LLL#LLL',
      '#LL#LLL#LL#L',
      '##LLL#LLL#LL',
      '#L#LLL#LLLL#',
      '#LLL#LL#LL#L',
      '#LL#LLLL#LLL',
      '##LLL#LLL#LL',
      '#L#LLL#LLL#L',
      '#LLL#LL#LLLL',
      '#LL#LLLL#LL#',
    ],
    // 12x12 Template C (4-letter photo answer)
    [
      'PP##########',
      'PPLLLL#LLLL#',
      '#LLL#LLL#LLL',
      '#LL#LLL#LL#L',
      '##LLL#LLL#LL',
      '#L#LLL#LLLL#',
      '#LLL#LL#LL#L',
      '#LL#LLLL#LLL',
      '##LLL#LLL#LL',
      '#L#LLL#LLL#L',
      '#LLL#LL#LLLL',
      '#LL#LLLL#LL#',
    ],
  ],
};

function parseMaskToSlots(mask: string[]): TemplateSlot[] {
  const rows = mask.length;
  const cols = mask[0].length;
  const rawSlots: Omit<TemplateSlot, 'index' | 'intersections'>[] = [];

  // 1. Extract all maximal horizontal runs >= 2
  for (let r = 0; r < rows; r++) {
    let c = 0;
    while (c < cols) {
      if (mask[r][c] === 'L') {
        const startCol = c;
        while (c < cols && mask[r][c] === 'L') {
          c++;
        }
        const length = c - startCol;
        if (length >= 2) {
          const isPhoto = r === 1 && startCol === 2;
          const clueRow = r;
          const clueCol = startCol - 1;
          const cells = Array.from({ length }, (_, idx) => ({
            row: r,
            col: startCol + idx,
            charIndex: idx,
          }));
          rawSlots.push({
            direction: 'across',
            startRow: r,
            startCol,
            length,
            clueRow,
            clueCol,
            arrow: 'right',
            isPhotoClue: isPhoto,
            cells,
          });
        }
      } else {
        c++;
      }
    }
  }

  // 2. Extract all maximal vertical runs >= 2
  for (let c = 0; c < cols; c++) {
    let r = 0;
    while (r < rows) {
      if (mask[r][c] === 'L') {
        const startRow = r;
        while (r < rows && mask[r][c] === 'L') {
          r++;
        }
        const length = r - startRow;
        if (length >= 2) {
          const isBelowPhoto = startRow === 2 && c === 1;
          const clueRow = isBelowPhoto ? 2 : startRow - 1;
          const clueCol = isBelowPhoto ? 0 : c;
          const arrow: ArrowType = isBelowPhoto ? 'right-down' : 'down';
          const cells = Array.from({ length }, (_, idx) => ({
            row: startRow + idx,
            col: c,
            charIndex: idx,
          }));
          rawSlots.push({
            direction: 'down',
            startRow,
            startCol: c,
            length,
            clueRow,
            clueCol,
            arrow,
            cells,
          });
        }
      } else {
        r++;
      }
    }
  }

  // 3. Assign top/bottom slot designations when a clue cell hosts 2 clues
  const byClueCell = new Map<string, number[]>();
  rawSlots.forEach((s, i) => {
    if (s.isPhotoClue) return;
    const key = `${s.clueRow},${s.clueCol}`;
    const list = byClueCell.get(key) ?? [];
    list.push(i);
    byClueCell.set(key, list);
  });

  for (const indices of byClueCell.values()) {
    if (indices.length === 2) {
      const [firstIdx, secondIdx] = indices;
      if (rawSlots[firstIdx].direction === 'across') {
        rawSlots[firstIdx].slot = 'top';
        rawSlots[secondIdx].slot = 'bottom';
      } else {
        rawSlots[secondIdx].slot = 'top';
        rawSlots[firstIdx].slot = 'bottom';
      }
    }
  }

  // 4. Build intersection graph
  const slots: TemplateSlot[] = rawSlots.map((s, index) => ({
    ...s,
    index,
    intersections: [],
  }));

  for (let i = 0; i < slots.length; i++) {
    for (let j = i + 1; j < slots.length; j++) {
      const a = slots[i];
      const b = slots[j];
      for (const cellA of a.cells) {
        for (const cellB of b.cells) {
          if (cellA.row === cellB.row && cellA.col === cellB.col) {
            a.intersections.push({
              myCharIndex: cellA.charIndex,
              otherSlotIndex: j,
              otherCharIndex: cellB.charIndex,
            });
            b.intersections.push({
              myCharIndex: cellB.charIndex,
              otherSlotIndex: i,
              otherCharIndex: cellA.charIndex,
            });
          }
        }
      }
    }
  }

  return slots;
}

const CATEGORY_METADATA: Record<
  PuzzleCategory,
  {
    title: { tr: string; en: string; de: string; fr: string };
    subtitle: { tr: string; en: string; de: string; fr: string };
    theme: { tr: string; en: string; de: string; fr: string };
  }
> = {
  all: {
    title: {
      tr: 'Büyük Anadolu Karma Baskısı',
      en: 'Grand Anatolian Mixed Edition',
      de: 'Große Anatolische Gemischte Ausgabe',
      fr: 'Grande édition mixte d’Anatolie',
    },
    subtitle: {
      tr: 'Tarihten mutfağa, coğrafyadan sanata uzanan zengin kelime seçkisi.',
      en: 'A rich selection of words spanning history, cuisine, geography, and arts.',
      de: 'Eine reiche Wortauswahl aus Geschichte, Küche, Geographie und Kunst.',
      fr: 'Une riche sélection de mots mêlant histoire, cuisine, géographie et arts.',
    },
    theme: {
      tr: 'Genel Seçki',
      en: 'General Selection',
      de: 'Allgemeine Auswahl',
      fr: 'Sélection générale',
    },
  },
  tarih: {
    title: {
      tr: 'Tarih ve Uygarlıklar Seçkisi',
      en: 'History & Civilizations Edition',
      de: 'Ausgabe Geschichte & Zivilisationen',
      fr: 'Édition Histoire et Civilisations',
    },
    subtitle: {
      tr: 'Antik kentlerden Osmanlı mirasına uzanan tarihsel çengel bulmaca.',
      en: 'A historical arrowword stretching from ancient cities to Ottoman heritage.',
      de: 'Ein historisches Schwedenrätsel von antiken Städten bis zum osmanischen Erbe.',
      fr: 'Une grille historique des cités antiques à l’héritage ottoman.',
    },
    theme: {
      tr: 'Tarih & Miras',
      en: 'History & Heritage',
      de: 'Geschichte & Erbe',
      fr: 'Histoire & Patrimoine',
    },
  },
  cografya: {
    title: {
      tr: 'Türkiye Coğrafyası ve Doğa',
      en: 'Geography & Nature of Turkey',
      de: 'Geographie & Natur der Türkei',
      fr: 'Géographie et nature de Turquie',
    },
    subtitle: {
      tr: 'Boğaz kıyılarından Anadolu dağlarına ve ırmaklarına uzanan keşif.',
      en: 'An exploration from Bosphorus shores to Anatolian mountains and rivers.',
      de: 'Eine Entdeckungsreise vom Bosporus zu den Bergen und Flüssen Anatoliens.',
      fr: 'Une exploration des rives du Bosphore aux montagnes d’Anatolie.',
    },
    theme: {
      tr: 'Coğrafya & Doğa',
      en: 'Geography & Nature',
      de: 'Geographie & Natur',
      fr: 'Géographie & Nature',
    },
  },
  mutfak: {
    title: {
      tr: 'Anadolu Mutfağı ve Sofra',
      en: 'Anatolian Cuisine & Table',
      de: 'Anatolische Küche & Tafel',
      fr: 'Cuisine et table d’Anatolie',
    },
    subtitle: {
      tr: 'Geleneksel lezzetler, baharatlar ve kırk yıl hatırlı sofra kültürü.',
      en: 'Traditional delicacies, spices, and timeless Turkish table culture.',
      de: 'Traditionelle Köstlichkeiten, Gewürze und türkische Tafelkultur.',
      fr: 'Saveurs traditionnelles, épices et art de la table turc.',
    },
    theme: {
      tr: 'Mutfak & Sofra',
      en: 'Cuisine & Table',
      de: 'Küche & Tafel',
      fr: 'Cuisine & Table',
    },
  },
  bilim: {
    title: {
      tr: 'Bilim, Doğa ve Keşifler',
      en: 'Science, Nature & Discoveries',
      de: 'Wissenschaft, Natur & Entdeckungen',
      fr: 'Sciences, nature et découvertes',
    },
    subtitle: {
      tr: 'Gökbilimden fiziğe, doğa yasalarından bilimsel terimlere uzanan baskı.',
      en: 'An edition spanning astronomy, physics, and natural sciences.',
      de: 'Eine Ausgabe rund um Astronomie, Physik und Naturwissenschaften.',
      fr: 'Une édition dédiée à l’astronomie, à la physique et aux sciences.',
    },
    theme: {
      tr: 'Bilim & Keşif',
      en: 'Science & Discovery',
      de: 'Wissenschaft',
      fr: 'Sciences',
    },
  },
  kultur: {
    title: {
      tr: 'Kültür, Sanat ve Edebiyat',
      en: 'Culture, Arts & Literature',
      de: 'Kultur, Kunst & Literatur',
      fr: 'Culture, arts et littérature',
    },
    subtitle: {
      tr: 'Türk müziği makamlarından geleneksel el sanatlarına ve edebiyata.',
      en: 'From Turkish musical modes to traditional crafts and literature.',
      de: 'Von türkischer Musik bis zu traditionellem Handwerk und Literatur.',
      fr: 'De la musique turque aux arts traditionnels et à la littérature.',
    },
    theme: {
      tr: 'Kültür & Sanat',
      en: 'Culture & Arts',
      de: 'Kultur & Kunst',
      fr: 'Culture & Arts',
    },
  },
  genel: {
    title: {
      tr: 'Günlük Sözlük ve Genel Kültür',
      en: 'Everyday Lexicon & General Knowledge',
      de: 'Alltagswortschatz & Allgemeinwissen',
      fr: 'Lexique quotidien et culture générale',
    },
    subtitle: {
      tr: 'Zengin Türkçe kelime hazinesinden derlenen klasik gazete bulmacası.',
      en: 'A classic newspaper puzzle compiled from the rich Turkish lexicon.',
      de: 'Ein klassisches Zeitungsrätsel aus dem reichen türkischen Wortschatz.',
      fr: 'Une grille de journal classique issue du riche lexique turc.',
    },
    theme: {
      tr: 'Genel Kültür',
      en: 'General Knowledge',
      de: 'Allgemeinwissen',
      fr: 'Culture générale',
    },
  },
};

interface CandidateWord {
  entry: LexiconEntry;
  chars: string[];
}

/**
 * High-speed MRV + Incremental Domain Forward-Checking Solver.
 * Solves 8x8, 10x10, and 12x12 grids in <15ms.
 */
function solveTemplateWithBacktracking(
  slots: TemplateSlot[],
  photoEntry: LexiconEntry,
  category: PuzzleCategory,
  difficulty: Difficulty,
  rng: () => number
): LexiconEntry[] | null {
  const n = slots.length;
  const assignment: (LexiconEntry | null)[] = Array(n).fill(null);
  const usedAnswers = new Set<string>();

  // Pre-order candidate pools per slot length with category & difficulty preference + seeded shuffle
  const candidatesByLength: Record<number, CandidateWord[]> = {};
  for (const lenStr of Object.keys(LEXICON_BY_LENGTH)) {
    const len = Number(lenStr);
    const pool = LEXICON_BY_LENGTH[len] ?? [];
    const scored = pool.map((entry) => {
      const catBonus =
        category !== 'all' && entry.category === category
          ? 2.2
          : entry.category !== 'genel'
            ? 0.35
            : 0;
      const diffBonus = entry.difficulty === difficulty ? 0.5 : 0;
      return {
        entry,
        chars: splitTurkishChars(entry.answer),
        score: catBonus + diffBonus + rng() * 1.6,
      };
    });
    scored.sort((a, b) => b.score - a.score);
    candidatesByLength[len] = scored.map(({ entry, chars }) => ({ entry, chars }));
  }

  // Initialize active candidate domain for every slot
  let initialDomains: CandidateWord[][] = slots.map(
    (s) => candidatesByLength[s.length] ?? []
  );

  // Fix photo clue slot first and propagate constraints to its neighbors
  const photoSlotIdx = slots.findIndex((s) => s.isPhotoClue);
  if (photoSlotIdx !== -1) {
    const photoChars = splitTurkishChars(photoEntry.answer);
    assignment[photoSlotIdx] = photoEntry;
    usedAnswers.add(photoEntry.answer);
    initialDomains = initialDomains.slice();
    for (const inter of slots[photoSlotIdx].intersections) {
      const reqChar = photoChars[inter.myCharIndex];
      initialDomains[inter.otherSlotIndex] = initialDomains[
        inter.otherSlotIndex
      ].filter(
        (c) =>
          c.chars[inter.otherCharIndex] === reqChar &&
          c.entry.answer !== photoEntry.answer
      );
    }
  }

  let steps = 0;
  const MAX_STEPS = 4000;

  function backtrack(domains: CandidateWord[][]): boolean {
    if (++steps > MAX_STEPS) return false;

    // Pick unassigned slot with Minimum Remaining Values (O(n) array length check!)
    let bestSlot = -1;
    let minLen = Infinity;

    for (let i = 0; i < n; i++) {
      if (assignment[i] !== null) continue;
      const dLen = domains[i].length;
      if (dLen === 0) return false;
      if (dLen < minLen) {
        minLen = dLen;
        bestSlot = i;
        if (dLen === 1) break;
      }
    }

    if (bestSlot === -1) {
      return true; // All slots filled!
    }

    const slot = slots[bestSlot];
    const slotDomain = domains[bestSlot];

    for (let k = 0; k < slotDomain.length; k++) {
      const cand = slotDomain[k];
      if (usedAnswers.has(cand.entry.answer)) continue;

      // Forward-propagate constraint to unassigned intersecting neighbors
      let viable = true;
      const nextDomains = domains.slice();

      for (let m = 0; m < slot.intersections.length; m++) {
        const inter = slot.intersections[m];
        const otherIdx = inter.otherSlotIndex;
        if (assignment[otherIdx] !== null) continue;

        const reqChar = cand.chars[inter.myCharIndex];
        const filtered = domains[otherIdx].filter(
          (c) =>
            c.chars[inter.otherCharIndex] === reqChar &&
            c.entry.answer !== cand.entry.answer &&
            !usedAnswers.has(c.entry.answer)
        );
        if (filtered.length === 0) {
          viable = false;
          break;
        }
        nextDomains[otherIdx] = filtered;
      }

      if (!viable) continue;

      assignment[bestSlot] = cand.entry;
      usedAnswers.add(cand.entry.answer);

      if (backtrack(nextDomains)) {
        return true;
      }

      assignment[bestSlot] = null;
      usedAnswers.delete(cand.entry.answer);
    }

    return false;
  }

  const solved = backtrack(initialDomains);
  if (!solved) return null;
  return assignment as LexiconEntry[];
}

export function generateDynamicPuzzle(config: GeneratorConfig): PuzzleDefinition {
  const isDaily = config.mode === 'daily';
  const dailyDate = config.dateStr;
  const seedStr =
    config.seed ||
    `${config.size}-${config.category}-${config.difficulty}-${Date.now().toString(36)}`;
  const rng = createSeededRng(seedStr);

  const masksForSize = GRID_MASKS[config.size] ?? GRID_MASKS[8];
  const startMaskIdx = Math.floor(rng() * masksForSize.length);

  // Filter photo themes that match category if possible, otherwise any theme
  const matchingThemes =
    config.category === 'all' || config.category === 'genel'
      ? PHOTO_CLUE_THEMES
      : [
          ...PHOTO_CLUE_THEMES.filter((t) => t.category === config.category),
          ...PHOTO_CLUE_THEMES.filter((t) => t.category !== config.category),
        ];

  const startThemeIdx = Math.floor(rng() * matchingThemes.length);

  for (let mOffset = 0; mOffset < masksForSize.length; mOffset++) {
    const mask = masksForSize[(startMaskIdx + mOffset) % masksForSize.length];
    const slots = parseMaskToSlots(mask);
    const photoSlot = slots.find((s) => s.isPhotoClue);
    const photoLen = photoSlot?.length ?? 5;

    for (let tOffset = 0; tOffset < matchingThemes.length; tOffset++) {
      const theme: PhotoClueTheme =
        matchingThemes[(startThemeIdx + tOffset) % matchingThemes.length];
      const photoEntry = theme.wordsByLength[photoLen];
      if (!photoEntry) continue;

      const attemptRng = createSeededRng(`${seedStr}-m${mOffset}-t${tOffset}`);
      const solvedEntries = solveTemplateWithBacktracking(
        slots,
        photoEntry,
        config.category,
        config.difficulty,
        attemptRng
      );

      if (solvedEntries) {
        const puzzleId = isDaily
          ? `gunun-bulmacasi-${dailyDate}`
          : `ozel-baski-${seedStr.replace(/[^a-zA-Z0-9-]/g, '').slice(-12)}`;

        const issueNum = isDaily ? 'GÜN' : `${config.size}×${config.size}`;

        const photoWordId = `${puzzleId}-w-photo`;

        const words: WordEntry[] = slots.map((slot, idx) => {
          const lex = solvedEntries[idx];
          const isPhoto = Boolean(slot.isPhotoClue);
          return {
            id: isPhoto ? photoWordId : `${puzzleId}-w-${idx + 1}`,
            answer: lex.answer,
            clueTr: lex.clueTr,
            clueFullTr: lex.clueFullTr,
            gloss: lex.gloss,
            startRow: slot.startRow,
            startCol: slot.startCol,
            direction: slot.direction,
            clueRow: slot.clueRow,
            clueCol: slot.clueCol,
            arrow: slot.arrow,
            isPhotoClue: isPhoto,
            slot: slot.slot,
          };
        });

        const meta = CATEGORY_METADATA[config.category] ?? CATEGORY_METADATA.all;
        const sizeLabel = `${config.size}×${config.size}`;

        const title = isDaily
          ? {
              tr: `Günün Bulmacası (${dailyDate})`,
              en: `Daily Puzzle (${dailyDate})`,
              de: `Tagesrätsel (${dailyDate})`,
              fr: `Grille du Jour (${dailyDate})`,
            }
          : {
              tr: `${meta.title.tr} (${sizeLabel})`,
              en: `${meta.title.en} (${sizeLabel})`,
              de: `${meta.title.de} (${sizeLabel})`,
              fr: `${meta.title.fr} (${sizeLabel})`,
            };

        const puzzle: PuzzleDefinition = {
          id: puzzleId,
          issueNumber: issueNum,
          difficulty: config.difficulty,
          category: config.category,
          isGenerated: true,
          isDaily,
          dailyDate,
          seed: seedStr,
          title,
          subtitle: meta.subtitle,
          theme: meta.theme,
          rows: config.size,
          cols: config.size,
          photoBlock: {
            row: 0,
            col: 0,
            rowSpan: 2,
            colSpan: 2,
            imageUrl: theme.imageUrl,
            svgId: theme.svgId,
            alt: theme.alt,
            captionTr: photoEntry.clueTr,
            wordId: photoWordId,
            arrowRow: 1,
            arrowCol: 1,
            arrow: 'right',
          },
          words,
        };

        const errors = validatePuzzle(puzzle);
        if (errors.length === 0) {
          return puzzle;
        }
      }
    }
  }

  return generateDynamicPuzzle({
    size: 8,
    category: 'all',
    difficulty: config.difficulty,
    seed: `${seedStr}-fallback`,
    mode: config.mode,
    dateStr: config.dateStr,
  });
}

export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const DAILY_CATEGORIES: PuzzleCategory[] = [
  'all',
  'kultur',
  'cografya',
  'mutfak',
  'tarih',
  'bilim',
];

const DAILY_SIZES: Array<{ size: GridSize; difficulty: Difficulty }> = [
  { size: 8, difficulty: 'easy' },
  { size: 10, difficulty: 'medium' },
  { size: 8, difficulty: 'medium' },
  { size: 10, difficulty: 'hard' },
  { size: 12, difficulty: 'master' },
];

export function getDailyPuzzle(dateStr: string = getTodayDateString()): PuzzleDefinition {
  const rng = createSeededRng(`daily-matbaa-${dateStr}`);
  const cat = DAILY_CATEGORIES[Math.floor(rng() * DAILY_CATEGORIES.length)];
  const spec = DAILY_SIZES[Math.floor(rng() * DAILY_SIZES.length)];

  return generateDynamicPuzzle({
    size: spec.size,
    category: cat,
    difficulty: spec.difficulty,
    seed: `daily-matbaa-edition-${dateStr}`,
    mode: 'daily',
    dateStr,
  });
}

export function getRecentDailyPuzzles(count: number = 4): PuzzleDefinition[] {
  const puzzles: PuzzleDefinition[] = [];
  const base = new Date();
  for (let i = 0; i < count; i++) {
    const d = new Date(base);
    d.setDate(base.getDate() - i);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    puzzles.push(getDailyPuzzle(dateStr));
  }
  return puzzles;
}
