import { Check } from 'lucide-react';
import {
  CellFlag,
  ClueSlot,
  Language,
  PrintMode,
  PuzzleDefinition,
} from '../types/puzzle';
import { BuiltGrid, cellKey, getWordCells } from '../utils/gridEngine';
import { ClueArrowSvg } from './ClueArrowSvg';
import { WoodcutArtwork } from './WoodcutArtwork';

interface CrosswordGridProps {
  puzzle: PuzzleDefinition;
  built: BuiltGrid;
  language: Language;
  entries: Record<string, string>;
  flags: Record<string, CellFlag>;
  activeCell: { row: number; col: number } | null;
  activeWordId: string | null;
  solvedWordIds: Set<string>;
  isPaused?: boolean;
  pausedText?: string;
  resumeLabel?: string;
  onResume?: () => void;
  onSelectLetterCell?: (row: number, col: number) => void;
  onSelectWordById?: (wordId: string) => void;
  printMode?: PrintMode;
}

function renderArrowBadge(
  slot: ClueSlot,
  isActive: boolean,
  compact: boolean,
  isDenseGrid: boolean
) {
  const iconSize = isDenseGrid ? (compact ? 9 : 10) : compact ? 11 : 13;
  return (
    <span
      className={`inline-flex items-center justify-center shrink-0 ${
        isDenseGrid ? 'w-3 h-3' : compact ? 'w-3.5 h-3.5' : 'w-4 h-4'
      }`}
    >
      <ClueArrowSvg arrow={slot.arrow} accent={isActive} size={iconSize} />
    </span>
  );
}

export function CrosswordGrid({
  puzzle,
  built,
  language,
  entries,
  flags,
  activeCell,
  activeWordId,
  solvedWordIds,
  isPaused = false,
  pausedText,
  resumeLabel,
  onResume,
  onSelectLetterCell,
  onSelectWordById,
  printMode,
}: CrosswordGridProps) {
  const isPrinting = Boolean(printMode);
  const is12 = puzzle.cols >= 12;
  const is10 = puzzle.cols === 10;
  const isDenseGrid = puzzle.cols >= 10;

  // Set of coordinates belonging to the currently active word
  const activeWordCoordSet = new Set<string>();
  if (!isPrinting && activeWordId && built.wordsById[activeWordId]) {
    for (const c of getWordCells(built.wordsById[activeWordId])) {
      activeWordCoordSet.add(cellKey(c.row, c.col));
    }
  }

  return (
    <div className="relative select-none">
      <div
        role="grid"
        aria-label={puzzle.title[language]}
        style={{
          gridTemplateColumns: `repeat(${puzzle.cols}, minmax(0, 1fr))`,
        }}
        className={`grid w-full bg-[#1c1917] p-[2px] gap-[1.5px] ${
          isPrinting ? 'border-2 border-black' : 'border-2 border-[#1c1917] shadow-[0_2px_10px_rgba(23,22,20,0.08)]'
        }`}
      >
        {built.cells.map((rowCells, r) =>
          rowCells.map((cell, c) => {
            const key = cellKey(r, c);

            // 1. Embedded Illustrated Photo Clue Block (2x2)
            if (cell.kind === 'photo') {
              if (!cell.isAnchor) {
                return null;
              }
              const isPhotoActive = !isPrinting && activeWordId === cell.photo.wordId;
              const isPhotoSolved = !isPrinting && solvedWordIds.has(cell.photo.wordId);

              return (
                <button
                  key={key}
                  type="button"
                  disabled={isPrinting}
                  onClick={() => onSelectWordById?.(cell.photo.wordId)}
                  style={{
                    gridColumn: `span ${cell.photo.colSpan} / span ${cell.photo.colSpan}`,
                    gridRow: `span ${cell.photo.rowSpan} / span ${cell.photo.rowSpan}`,
                  }}
                  className={`relative w-full h-full overflow-hidden bg-[#f4efe4] text-left group focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#b42318] ${
                    isPrinting ? '' : 'cursor-pointer'
                  } ${isPhotoActive ? 'ring-2 ring-inset ring-[#b42318]' : ''}`}
                >
                  <WoodcutArtwork
                    photo={cell.photo}
                    language={language}
                    className="w-full h-full transition-transform duration-200 group-hover:scale-[1.02]"
                  />

                  {/* Subtle bottom editorial caption scrim */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#171614]/85 via-[#171614]/45 to-transparent px-2 py-1.5 flex items-center justify-between gap-1">
                    <span className="text-[10px] sm:text-[11px] font-semibold text-[#faf7f0] leading-tight truncate">
                      {cell.photo.captionTr}
                    </span>
                    {isPhotoSolved && (
                      <Check className="w-3.5 h-3.5 text-[#86efac] shrink-0" aria-hidden="true" />
                    )}
                  </div>

                  {/* Classic newspaper red arrow tab pointing into the answer row */}
                  <span
                    aria-hidden="true"
                    className="absolute right-0 bottom-6 sm:bottom-8 inline-flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 bg-[#faf7f0] border-y border-l border-[#1c1917] shadow-xs"
                  >
                    <ClueArrowSvg arrow={cell.photo.arrow} accent size={13} />
                  </span>
                </button>
              );
            }

            // 2. Clue Tile (Single, Split Dual-Clue, or Solid Press Separator)
            if (cell.kind === 'clue') {
              if (cell.clues.length === 0) {
                return (
                  <div
                    key={key}
                    aria-hidden="true"
                    className="aspect-square bg-[#1c1917] flex items-center justify-center"
                  >
                    <span className="w-1.5 h-1.5 rotate-45 bg-[#3f3b35]" />
                  </div>
                );
              }

              const isSplit = cell.clues.length === 2;

              const clueTextSizeClass = is12
                ? isSplit
                  ? 'text-[6.2px] sm:text-[7px] lg:text-[7.5px]'
                  : 'text-[7px] sm:text-[8px] lg:text-[8.5px]'
                : is10
                  ? isSplit
                    ? 'text-[6.8px] sm:text-[7.8px] lg:text-[8.2px]'
                    : 'text-[7.5px] sm:text-[8.8px] lg:text-[9.5px]'
                  : isSplit
                    ? 'text-[7.5px] sm:text-[8.5px] lg:text-[9px]'
                    : 'text-[8.5px] sm:text-[10px] lg:text-[10.5px]';

              return (
                <div
                  key={key}
                  className={`aspect-square flex flex-col overflow-hidden ${
                    isPrinting ? 'bg-[#ebe6da]' : 'bg-[#ebe4d4]'
                  }`}
                >
                  {cell.clues.map((slot, idx) => {
                    const isSlotActive = !isPrinting && activeWordId === slot.wordId;
                    const isSlotSolved = !isPrinting && solvedWordIds.has(slot.wordId);

                    return (
                      <button
                        key={slot.wordId}
                        type="button"
                        disabled={isPrinting}
                        onClick={() => onSelectWordById?.(slot.wordId)}
                        title={slot.clueTr}
                        className={`relative flex-1 min-h-0 w-full ${
                          isDenseGrid ? 'px-0.5 sm:px-1' : 'px-1 sm:px-1.5'
                        } py-0.5 flex flex-row items-center justify-between gap-0.5 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#b42318] ${
                          idx === 1 ? 'border-t border-[#1c1917]/55' : ''
                        } ${isPrinting ? '' : 'cursor-pointer'} ${
                          isSlotActive
                            ? 'bg-[#fde68a] text-[#171614]'
                            : isSlotSolved
                              ? 'bg-[#e3decb] text-[#5c564d]'
                              : 'hover:bg-[#e0d7c3] text-[#171614]'
                        }`}
                      >
                        <span
                          lang="tr"
                          className={`flex-1 min-w-0 font-sans-grid font-semibold leading-[1.05] tracking-[-0.02em] break-words hyphens-auto ${clueTextSizeClass} ${
                            isSlotSolved ? 'line-through decoration-[#15803d]/60' : ''
                          }`}
                        >
                          {slot.clueTr}
                        </span>

                        <div className="shrink-0 flex items-center justify-center">
                          {renderArrowBadge(slot, isSlotActive, isSplit, isDenseGrid)}
                        </div>
                      </button>
                    );
                  })}
                </div>
              );
            }

            // 3. Playable Letter Cell
            const userChar = entries[key] || '';
            const flag = flags[key] || 'normal';
            const isSelected =
              !isPrinting && activeCell?.row === r && activeCell?.col === c;
            const isInActiveWord = !isPrinting && activeWordCoordSet.has(key);

            let displayChar = userChar;
            if (printMode === 'blank') {
              displayChar = '';
            } else if (printMode === 'solution') {
              displayChar = cell.expected;
            }

            let cellBg = 'bg-white';
            if (!isPrinting) {
              if (isSelected) {
                cellBg = 'bg-[#fde68a]';
              } else if (isInActiveWord) {
                cellBg = 'bg-[#fef3c7]';
              } else if (flag === 'checked-error') {
                cellBg = 'bg-[#fef2f2]';
              } else if (flag === 'checked-ok') {
                cellBg = 'bg-[#f0fdf4]';
              }
            }

            let letterColor = 'text-[#171614]';
            if (!isPrinting) {
              if (flag === 'checked-error') {
                letterColor = 'text-[#b91c1c]';
              } else if (flag === 'checked-ok') {
                letterColor = 'text-[#15803d]';
              } else if (flag === 'revealed') {
                letterColor = 'text-[#1e3a8a]';
              }
            }

            const letterSizeClass = isPrinting
              ? is12
                ? 'text-[14px] text-black'
                : is10
                  ? 'text-[16px] text-black'
                  : 'text-[18px] text-black'
              : is12
                ? 'text-[14px] sm:text-[17px] lg:text-[20px]'
                : is10
                  ? 'text-[16px] sm:text-[20px] lg:text-[23px]'
                  : 'text-[19px] sm:text-[23px] lg:text-[26px]';

            return (
              <button
                key={key}
                type="button"
                role="gridcell"
                disabled={isPrinting}
                aria-label={`${r + 1}, ${c + 1}${displayChar ? `: ${displayChar}` : ''}`}
                aria-selected={isSelected}
                onClick={() => onSelectLetterCell?.(r, c)}
                className={`relative aspect-square flex items-center justify-center transition-colors duration-100 focus-visible:outline-none ${cellBg} ${
                  isPrinting ? '' : 'cursor-pointer hover:bg-[#fef9e7]'
                } ${
                  isSelected
                    ? 'ring-2 ring-inset ring-[#b42318] z-10'
                    : ''
                } ${!isPrinting && flag === 'checked-error' ? 'cell-error-slash' : ''}`}
              >
                <span
                  key={`${key}-${displayChar}`}
                  className={`font-sans-grid font-bold uppercase leading-none ${letterSizeClass} ${letterColor} ${
                    !isPrinting && displayChar ? 'animate-cell-pop' : ''
                  }`}
                >
                  {isPaused && !isPrinting ? '' : displayChar}
                </span>

                {/* Non-hue-only status indicators */}
                {!isPrinting && flag === 'checked-ok' && (
                  <span
                    aria-hidden="true"
                    className="absolute top-0.5 right-0.5 text-[#15803d]"
                  >
                    <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 stroke-[3]" />
                  </span>
                )}

                {!isPrinting && flag === 'revealed' && (
                  <span
                    aria-hidden="true"
                    className="absolute top-0 right-0 w-0 h-0 border-t-[8px] border-l-[8px] border-t-[#1e3a8a] border-l-transparent"
                  />
                )}
              </button>
            );
          })
        )}
      </div>

      {/* Clean Pause Curtain Overlay */}
      {isPaused && !isPrinting && (
        <div className="absolute inset-0 bg-[#f5f1e8]/95 border-2 border-[#1c1917] flex flex-col items-center justify-center p-6 text-center z-20">
          <p className="font-display text-xl sm:text-2xl font-bold text-[#171614] mb-2">
            {puzzle.title[language]}
          </p>
          <p className="text-sm text-[#5c564d] max-w-sm mb-5">{pausedText}</p>
          <button
            type="button"
            onClick={onResume}
            className="px-5 py-2.5 text-sm font-semibold text-[#faf7f0] bg-[#b42318] hover:bg-[#911b12] rounded-sm transition-colors cursor-pointer"
          >
            {resumeLabel}
          </button>
        </div>
      )}
    </div>
  );
}
