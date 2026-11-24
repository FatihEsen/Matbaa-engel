import {
  ArrowType,
  ClueSlot,
  GridCell,
  PuzzleDefinition,
  PuzzleProgress,
  WordEntry,
} from '../types/puzzle';
import { splitTurkishChars } from './turkish';

export function cellKey(row: number, col: number): string {
  return `${row},${col}`;
}

export function getWordCells(word: WordEntry): Array<{ row: number; col: number; char: string }> {
  const chars = splitTurkishChars(word.answer);
  return chars.map((char, idx) => ({
    row: word.direction === 'down' ? word.startRow + idx : word.startRow,
    col: word.direction === 'across' ? word.startCol + idx : word.startCol,
    char,
  }));
}

export function getExpectedStartFromArrow(
  clueRow: number,
  clueCol: number,
  arrow: ArrowType
): { row: number; col: number; direction: 'across' | 'down' } {
  switch (arrow) {
    case 'right':
      return { row: clueRow, col: clueCol + 1, direction: 'across' };
    case 'down':
      return { row: clueRow + 1, col: clueCol, direction: 'down' };
    case 'right-down':
      return { row: clueRow, col: clueCol + 1, direction: 'down' };
    case 'down-right':
      return { row: clueRow + 1, col: clueCol, direction: 'across' };
    case 'up-right':
      return { row: clueRow - 1, col: clueCol, direction: 'across' };
    case 'left-down':
      return { row: clueRow, col: clueCol - 1, direction: 'down' };
  }
}

export interface BuiltGrid {
  cells: GridCell[][];
  letterCount: number;
  wordsById: Record<string, WordEntry>;
}

export function buildGrid(puzzle: PuzzleDefinition): BuiltGrid {
  const wordsById: Record<string, WordEntry> = {};
  for (const w of puzzle.words) {
    wordsById[w.id] = w;
  }

  // Initialize everything as empty clue cells first
  const cells: GridCell[][] = Array.from({ length: puzzle.rows }, (_, r) =>
    Array.from({ length: puzzle.cols }, (_, c) => ({
      kind: 'clue' as const,
      row: r,
      col: c,
      clues: [],
    }))
  );

  // Place photo block cells
  const pb = puzzle.photoBlock;
  for (let r = pb.row; r < pb.row + pb.rowSpan; r++) {
    for (let c = pb.col; c < pb.col + pb.colSpan; c++) {
      cells[r][c] = {
        kind: 'photo',
        row: r,
        col: c,
        isAnchor: r === pb.row && c === pb.col,
        photo: pb,
      };
    }
  }

  // Place all letter cells from words
  let letterCount = 0;
  for (const word of puzzle.words) {
    const coords = getWordCells(word);
    for (const { row, col, char } of coords) {
      const existing = cells[row][col];
      if (existing.kind !== 'letter') {
        letterCount++;
        cells[row][col] = {
          kind: 'letter',
          row,
          col,
          expected: char,
          acrossWordId: word.direction === 'across' ? word.id : undefined,
          downWordId: word.direction === 'down' ? word.id : undefined,
        };
      } else {
        if (word.direction === 'across') {
          existing.acrossWordId = word.id;
        } else {
          existing.downWordId = word.id;
        }
      }
    }
  }

  // Attach clue slots to clue cells
  for (const word of puzzle.words) {
    if (word.isPhotoClue) continue;
    const target = cells[word.clueRow]?.[word.clueCol];
    if (target && target.kind === 'clue') {
      const slot: ClueSlot = {
        wordId: word.id,
        clueTr: word.clueTr,
        arrow: word.arrow,
        direction: word.direction,
        startRow: word.startRow,
        startCol: word.startCol,
        slot: word.slot,
      };
      target.clues.push(slot);
    }
  }

  // Sort split clues consistently (top before bottom, across before down)
  for (let r = 0; r < puzzle.rows; r++) {
    for (let c = 0; c < puzzle.cols; c++) {
      const cell = cells[r][c];
      if (cell.kind === 'clue' && cell.clues.length === 2) {
        cell.clues.sort((a, b) => {
          if (a.slot === 'top' || b.slot === 'bottom') return -1;
          if (b.slot === 'top' || a.slot === 'bottom') return 1;
          return a.arrow === 'right' || a.arrow === 'up-right' ? -1 : 1;
        });
      }
    }
  }

  return { cells, letterCount, wordsById };
}

export function evaluatePuzzleProgress(
  puzzle: PuzzleDefinition,
  built: BuiltGrid,
  progress: PuzzleProgress
): {
  filledCount: number;
  correctCount: number;
  totalLetters: number;
  percentComplete: number;
  solvedWordIds: Set<string>;
  isSolved: boolean;
  score: number;
} {
  let filledCount = 0;
  let correctCount = 0;

  for (let r = 0; r < puzzle.rows; r++) {
    for (let c = 0; c < puzzle.cols; c++) {
      const cell = built.cells[r][c];
      if (cell.kind === 'letter') {
        const val = progress.entries[cellKey(r, c)];
        if (val) {
          filledCount++;
          if (val === cell.expected) {
            correctCount++;
          }
        }
      }
    }
  }

  const solvedWordIds = new Set<string>();
  for (const word of puzzle.words) {
    const coords = getWordCells(word);
    const allMatch = coords.every(({ row, col, char }) => progress.entries[cellKey(row, col)] === char);
    if (allMatch) {
      solvedWordIds.add(word.id);
    }
  }

  const isSolved = built.letterCount > 0 && correctCount === built.letterCount;
  const percentComplete =
    built.letterCount > 0 ? Math.round((filledCount / built.letterCount) * 100) : 0;

  // Transparent newspaper puzzle scoring:
  // 50 pts per solved word + up to 250 time bonus on completion - 25 pts per hint - 10 pts per check
  const wordPoints = solvedWordIds.size * 50;
  const timeBonus = isSolved ? Math.max(0, 250 - Math.floor(progress.elapsedSeconds / 4)) : 0;
  const penalty = progress.hintsUsed * 25 + progress.checksUsed * 10;
  const score = Math.max(0, wordPoints + timeBonus - penalty);

  return {
    filledCount,
    correctCount,
    totalLetters: built.letterCount,
    percentComplete,
    solvedWordIds,
    isSolved,
    score,
  };
}

/**
 * Deterministic topology validator ensuring 100% valid çengel bulmaca geometry.
 */
export function validatePuzzle(puzzle: PuzzleDefinition): string[] {
  const errors: string[] = [];
  const built = buildGrid(puzzle);
  const pb = puzzle.photoBlock;

  // 1. Check all words stay in bounds, don't overwrite photo, and agree at intersections
  const charGrid: (string | null)[][] = Array.from({ length: puzzle.rows }, () =>
    Array.from({ length: puzzle.cols }, () => null)
  );

  for (const word of puzzle.words) {
    const chars = splitTurkishChars(word.answer);
    if (chars.length < 2) {
      errors.push(`${puzzle.id}/${word.id}: word length < 2`);
    }

    const expectedStart = getExpectedStartFromArrow(word.clueRow, word.clueCol, word.arrow);
    if (
      expectedStart.row !== word.startRow ||
      expectedStart.col !== word.startCol ||
      expectedStart.direction !== word.direction
    ) {
      errors.push(
        `${puzzle.id}/${word.id}: arrow ${word.arrow} from (${word.clueRow},${word.clueCol}) expects (${expectedStart.row},${expectedStart.col}) ${expectedStart.direction}, got (${word.startRow},${word.startCol}) ${word.direction}`
      );
    }

    if (word.isPhotoClue) {
      if (word.clueRow !== pb.arrowRow || word.clueCol !== pb.arrowCol) {
        errors.push(`${puzzle.id}/${word.id}: photo clue origin mismatch`);
      }
    } else {
      const clueCell = built.cells[word.clueRow]?.[word.clueCol];
      if (!clueCell || clueCell.kind !== 'clue') {
        errors.push(
          `${puzzle.id}/${word.id}: clue cell (${word.clueRow},${word.clueCol}) is not a clue cell`
        );
      }
    }

    chars.forEach((ch, idx) => {
      const r = word.direction === 'down' ? word.startRow + idx : word.startRow;
      const c = word.direction === 'across' ? word.startCol + idx : word.startCol;
      if (r < 0 || r >= puzzle.rows || c < 0 || c >= puzzle.cols) {
        errors.push(`${puzzle.id}/${word.id}: out of bounds at (${r},${c})`);
        return;
      }
      if (r >= pb.row && r < pb.row + pb.rowSpan && c >= pb.col && c < pb.col + pb.colSpan) {
        errors.push(`${puzzle.id}/${word.id}: overlaps photo block at (${r},${c})`);
        return;
      }
      if (charGrid[r][c] && charGrid[r][c] !== ch) {
        errors.push(
          `${puzzle.id}/${word.id}: intersection conflict at (${r},${c}): '${charGrid[r][c]}' vs '${ch}'`
        );
      }
      charGrid[r][c] = ch;
    });
  }

  // 2. Ensure every horizontal run >= 2 is a registered across word
  const acrossSet = new Set(
    puzzle.words
      .filter((w) => w.direction === 'across')
      .map((w) => `${w.startRow},${w.startCol},${splitTurkishChars(w.answer).length}`)
  );
  for (let r = 0; r < puzzle.rows; r++) {
    let c = 0;
    while (c < puzzle.cols) {
      if (charGrid[r][c]) {
        const start = c;
        let run = '';
        while (c < puzzle.cols && charGrid[r][c]) {
          run += charGrid[r][c];
          c++;
        }
        const len = c - start;
        if (len >= 2 && !acrossSet.has(`${r},${start},${len}`)) {
          errors.push(`${puzzle.id}: unregistered ACROSS run "${run}" at (${r},${start}) len=${len}`);
        }
      } else {
        c++;
      }
    }
  }

  // 3. Ensure every vertical run >= 2 is a registered down word
  const downSet = new Set(
    puzzle.words
      .filter((w) => w.direction === 'down')
      .map((w) => `${w.startRow},${w.startCol},${splitTurkishChars(w.answer).length}`)
  );
  for (let c = 0; c < puzzle.cols; c++) {
    let r = 0;
    while (r < puzzle.rows) {
      if (charGrid[r][c]) {
        const start = r;
        let run = '';
        while (r < puzzle.rows && charGrid[r][c]) {
          run += charGrid[r][c];
          r++;
        }
        const len = r - start;
        if (len >= 2 && !downSet.has(`${start},${c},${len}`)) {
          errors.push(`${puzzle.id}: unregistered DOWN run "${run}" at (${start},${c}) len=${len}`);
        }
      } else {
        r++;
      }
    }
  }

  // 4. Ensure no clue cell has >2 clues
  for (let r = 0; r < puzzle.rows; r++) {
    for (let c = 0; c < puzzle.cols; c++) {
      const cell = built.cells[r][c];
      if (cell.kind === 'clue' && cell.clues.length > 2) {
        errors.push(`${puzzle.id}: overloaded clue cell (${cell.clues.length}) at (${r},${c})`);
      }
    }
  }

  return errors;
}
