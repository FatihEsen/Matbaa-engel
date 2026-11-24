import { useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  Eye,
  Lightbulb,
  Pause,
  Play,
  RotateCcw,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { TranslationBundle } from '../i18n/translations';
import {
  Language,
  PuzzleDefinition,
  PuzzleProgress,
  WordEntry,
} from '../types/puzzle';
import { formatDuration } from '../utils/turkish';
import { ClueArrowSvg } from './ClueArrowSvg';

interface PressUtilityRailProps {
  t: TranslationBundle;
  language: Language;
  elapsedSeconds: number;
  isPaused: boolean;
  isSolved: boolean;
  onTogglePause: () => void;
  score: number;
  streak: number;
  percentComplete: number;
  filledCount: number;
  totalLetters: number;
  autoCheck: boolean;
  onToggleAutoCheck: () => void;
  onRevealLetter: () => void;
  onRevealWord: () => void;
  onCheckWord: () => void;
  onCheckBoard: () => void;
  onResetPuzzle: () => void;
  crossingWord: WordEntry | null;
  onSelectWord: (wordId: string) => void;
  puzzles: PuzzleDefinition[];
  currentPuzzleId: string;
  progressByPuzzle: Record<string, PuzzleProgress>;
  onSelectPuzzle: (puzzleId: string) => void;
  onOpenGenerator: () => void;
  onOpenDaily: () => void;
  feedbackMessage: string | null;
}

export function PressUtilityRail({
  t,
  language,
  elapsedSeconds,
  isPaused,
  isSolved,
  onTogglePause,
  score,
  streak,
  percentComplete,
  filledCount,
  totalLetters,
  autoCheck,
  onToggleAutoCheck,
  onRevealLetter,
  onRevealWord,
  onCheckWord,
  onCheckBoard,
  onResetPuzzle,
  crossingWord,
  onSelectWord,
  puzzles,
  currentPuzzleId,
  progressByPuzzle,
  onSelectPuzzle,
  onOpenGenerator,
  onOpenDaily,
  feedbackMessage,
}: PressUtilityRailProps) {
  const [confirmingReset, setConfirmingReset] = useState(false);

  return (
    <aside className="no-print space-y-5">
      {/* Dynamic Press Studio Actions: Generate Custom Puzzle & Daily Puzzle */}
      <section className="bg-[#faf7f0] border border-[#1c1917] p-3.5 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={onOpenGenerator}
          className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#faf7f0] bg-[#b42318] hover:bg-[#911b12] rounded-sm transition-colors cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          <span className="truncate">{t.generatorButton}</span>
        </button>
        <button
          type="button"
          onClick={onOpenDaily}
          className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#171614] bg-[#fef3c7] hover:bg-[#fde68a] border border-[#1c1917] rounded-sm transition-colors cursor-pointer"
        >
          <Calendar className="w-3.5 h-3.5 text-[#b42318] shrink-0" aria-hidden="true" />
          <span className="truncate">{t.dailyButton}</span>
        </button>
      </section>

      {/* Press Ledger: Timer, Score, Streak & Completion */}
      <section className="bg-[#faf7f0] border border-[#1c1917] p-4">
        <div className="grid grid-cols-3 divide-x divide-[#c8bfa9] pb-3.5 border-b border-[#d4ccb8]">
          <div className="pr-3">
            <div className="text-[11px] font-medium text-[#655f55]">{t.timerLabel}</div>
            <div className="mt-0.5 flex items-center gap-1.5">
              <span className="font-mono-tabular text-lg font-bold text-[#171614]">
                {formatDuration(elapsedSeconds)}
              </span>
              {!isSolved && (
                <button
                  type="button"
                  onClick={onTogglePause}
                  aria-label={isPaused ? t.resume : t.pause}
                  title={isPaused ? t.resume : t.pause}
                  className="inline-flex items-center justify-center w-6 h-6 text-[#3f3b35] hover:text-[#b42318] border border-[#c8bfa9] hover:border-[#1c1917] rounded-sm transition-colors cursor-pointer"
                >
                  {isPaused ? (
                    <Play className="w-3 h-3" aria-hidden="true" />
                  ) : (
                    <Pause className="w-3 h-3" aria-hidden="true" />
                  )}
                </button>
              )}
            </div>
          </div>

          <div className="px-3">
            <div className="text-[11px] font-medium text-[#655f55]">{t.scoreLabel}</div>
            <div className="mt-0.5 font-mono-tabular text-lg font-bold text-[#171614]">
              {score}
            </div>
          </div>

          <div className="pl-3">
            <div className="text-[11px] font-medium text-[#655f55]">{t.streakLabel}</div>
            <div className="mt-0.5 font-mono-tabular text-lg font-bold text-[#b42318]">
              {streak}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="pt-3">
          <div className="flex items-center justify-between text-xs text-[#5c564d] mb-1.5">
            <span>{t.progressLabel}</span>
            <span className="font-mono-tabular font-semibold text-[#171614]">
              {filledCount}/{totalLetters} ({percentComplete}%)
            </span>
          </div>
          <div className="w-full h-2 bg-[#e8e1d1] border border-[#c8bfa9] overflow-hidden">
            <div
              className="h-full bg-[#171614] transition-transform duration-200 origin-left"
              style={{ transform: `scaleX(${percentComplete / 100})` }}
            />
          </div>
        </div>
      </section>

      {/* Hint & Verification Controls */}
      <section className="bg-[#faf7f0] border border-[#1c1917] p-4">
        <h2 className="font-display text-base font-bold text-[#171614] pb-2 mb-3 border-b border-[#d4ccb8]">
          {t.toolsHeading}
        </h2>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            disabled={isPaused || isSolved}
            onClick={onRevealLetter}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#171614] bg-[#f5f1e8] hover:bg-[#e8e1d1] border border-[#1c1917]/70 rounded-sm transition-colors cursor-pointer disabled:opacity-45 whitespace-nowrap"
          >
            <Lightbulb className="w-3.5 h-3.5 text-[#b42318] shrink-0" aria-hidden="true" />
            <span className="truncate">{t.revealLetter}</span>
          </button>

          <button
            type="button"
            disabled={isPaused || isSolved}
            onClick={onRevealWord}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#171614] bg-[#f5f1e8] hover:bg-[#e8e1d1] border border-[#1c1917]/70 rounded-sm transition-colors cursor-pointer disabled:opacity-45 whitespace-nowrap"
          >
            <Eye className="w-3.5 h-3.5 text-[#b42318] shrink-0" aria-hidden="true" />
            <span className="truncate">{t.revealWord}</span>
          </button>

          <button
            type="button"
            disabled={isPaused}
            onClick={onCheckWord}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#171614] bg-[#f5f1e8] hover:bg-[#e8e1d1] border border-[#c8bfa9] hover:border-[#1c1917] rounded-sm transition-colors cursor-pointer disabled:opacity-45 whitespace-nowrap"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-[#15803d] shrink-0" aria-hidden="true" />
            <span className="truncate">{t.checkWord}</span>
          </button>

          <button
            type="button"
            disabled={isPaused}
            onClick={onCheckBoard}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#171614] bg-[#f5f1e8] hover:bg-[#e8e1d1] border border-[#c8bfa9] hover:border-[#1c1917] rounded-sm transition-colors cursor-pointer disabled:opacity-45 whitespace-nowrap"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#15803d] shrink-0" aria-hidden="true" />
            <span className="truncate">{t.checkBoard}</span>
          </button>
        </div>

        {/* Auto-check toggle */}
        <label className="mt-3 pt-3 border-t border-[#d4ccb8] flex items-center justify-between gap-3 cursor-pointer">
          <span className="text-xs font-medium text-[#3f3b35]">{t.autoCheck}</span>
          <button
            type="button"
            role="switch"
            aria-checked={autoCheck}
            onClick={onToggleAutoCheck}
            className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full border transition-colors cursor-pointer ${
              autoCheck
                ? 'bg-[#171614] border-[#171614]'
                : 'bg-[#e8e1d1] border-[#c8bfa9]'
            }`}
          >
            <span
              className={`inline-block h-3.5 w-3.5 rounded-full bg-[#faf7f0] transition-transform ${
                autoCheck ? 'translate-x-4' : 'translate-x-0.5'
              }`}
            />
          </button>
        </label>

        {/* Feedback notice */}
        {feedbackMessage && (
          <p
            role="status"
            className="mt-3 px-2.5 py-2 text-xs font-medium text-[#171614] bg-[#fef3c7] border border-[#c8bfa9]"
          >
            {feedbackMessage}
          </p>
        )}

        {/* Inline Reset Confirmation */}
        <div className="mt-3 pt-3 border-t border-[#d4ccb8]">
          {!confirmingReset ? (
            <button
              type="button"
              onClick={() => setConfirmingReset(true)}
              className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#5c564d] hover:text-[#b42318] border border-transparent hover:border-[#c8bfa9] rounded-sm transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{t.resetPuzzle}</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  onResetPuzzle();
                  setConfirmingReset(false);
                }}
                className="flex-1 px-3 py-1.5 text-xs font-semibold text-[#faf7f0] bg-[#b42318] hover:bg-[#911b12] rounded-sm transition-colors cursor-pointer"
              >
                {t.confirmReset}
              </button>
              <button
                type="button"
                onClick={() => setConfirmingReset(false)}
                className="px-3 py-1.5 text-xs font-medium text-[#3f3b35] bg-[#e8e1d1] hover:bg-[#d8cfbc] rounded-sm transition-colors cursor-pointer"
              >
                {t.cancel}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Crossing Clue Preview */}
      {crossingWord && (
        <section className="bg-[#faf7f0] border border-[#c8bfa9] p-3.5">
          <div className="flex items-center justify-between text-[11px] font-medium text-[#655f55] mb-1">
            <span>{t.intersectingClue}</span>
            <span>
              {crossingWord.direction === 'across' ? t.across : t.down}
            </span>
          </div>
          <button
            type="button"
            onClick={() => onSelectWord(crossingWord.id)}
            className="w-full text-left flex items-start gap-2 group cursor-pointer"
          >
            <span className="mt-0.5 inline-flex items-center justify-center w-5 h-5 bg-[#e8e1d1] border border-[#1c1917] shrink-0">
              <ClueArrowSvg arrow={crossingWord.arrow} size={12} />
            </span>
            <span className="font-editorial text-sm text-[#171614] group-hover:text-[#b42318] transition-colors leading-snug">
              {crossingWord.clueFullTr}
            </span>
          </button>
        </section>
      )}

      {/* Quick Edition Switcher */}
      <section className="bg-[#faf7f0] border border-[#1c1917] p-4">
        <h2 className="font-display text-base font-bold text-[#171614] pb-2 mb-2 border-b border-[#d4ccb8]">
          {t.editionsHeading}
        </h2>
        <div className="divide-y divide-[#e1d9c6]">
          {puzzles.map((p) => {
            const prog = progressByPuzzle[p.id];
            const isCurrent = p.id === currentPuzzleId;
            const solved = Boolean(prog?.completedAt);
            const hasStarted = Boolean(prog && Object.keys(prog.entries).length > 0);
            const statusText = solved
              ? t.solvedBadge
              : hasStarted
                ? t.inProgressBadge
                : t.notStartedBadge;

            return (
              <button
                key={p.id}
                type="button"
                onClick={() => onSelectPuzzle(p.id)}
                className={`w-full py-2.5 px-2 text-left flex items-start justify-between gap-2 transition-colors cursor-pointer ${
                  isCurrent ? 'bg-[#fef3c7]' : 'hover:bg-[#f5f1e8]'
                }`}
              >
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-[#171614] truncate">
                    <span className="font-mono-tabular mr-1.5 text-[#b42318]">
                      {p.issueNumber}.
                    </span>
                    {p.title[language]}
                  </div>
                  <div className="mt-0.5 text-[11px] text-[#655f55]">
                    {t.difficulty[p.difficulty]} · {statusText}
                  </div>
                </div>
                {solved && (
                  <CheckCircle2
                    className="w-4 h-4 text-[#15803d] shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                )}
              </button>
            );
          })}
        </div>
      </section>
    </aside>
  );
}
