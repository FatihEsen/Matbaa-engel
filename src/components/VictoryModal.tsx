import { ArrowRight, Award, X } from 'lucide-react';
import { TranslationBundle } from '../i18n/translations';
import { formatDuration } from '../utils/turkish';

interface VictoryModalProps {
  t: TranslationBundle;
  open: boolean;
  editionTitle: string;
  elapsedSeconds: number;
  score: number;
  hintsUsed: number;
  streak: number;
  hasNextEdition: boolean;
  onNextEdition: () => void;
  onClose: () => void;
}

export function VictoryModal({
  t,
  open,
  editionTitle,
  elapsedSeconds,
  score,
  hintsUsed,
  streak,
  hasNextEdition,
  onNextEdition,
  onClose,
}: VictoryModalProps) {
  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="victory-title"
      className="no-print fixed inset-0 z-50 flex items-center justify-center bg-[#171614]/60 p-4"
    >
      <div className="w-full max-w-md bg-[#faf7f0] border-2 border-[#1c1917] p-6 relative shadow-xl">
        <button
          type="button"
          onClick={onClose}
          aria-label={t.cancel}
          className="absolute top-4 right-4 p-1 text-[#5c564d] hover:text-[#171614] cursor-pointer"
        >
          <X className="w-5 h-5" aria-hidden="true" />
        </button>

        <div className="flex items-center gap-2 text-xs font-semibold text-[#b42318] mb-2">
          <Award className="w-4 h-4" aria-hidden="true" />
          <span>{t.victoryKicker}</span>
        </div>

        <h2
          id="victory-title"
          className="font-display text-2xl sm:text-3xl font-bold text-[#171614] leading-tight"
        >
          {t.victoryTitle}
        </h2>

        <p className="mt-2 font-editorial text-sm text-[#5c564d]">
          {editionTitle} — {t.victorySubtitle}
        </p>

        <div className="my-5 grid grid-cols-2 sm:grid-cols-4 border border-[#1c1917] divide-x divide-[#c8bfa9] bg-[#f5f1e8]">
          <div className="p-3 text-center">
            <div className="text-[11px] text-[#655f55]">{t.victoryTime}</div>
            <div className="mt-0.5 font-mono-tabular text-base font-bold text-[#171614]">
              {formatDuration(elapsedSeconds)}
            </div>
          </div>
          <div className="p-3 text-center">
            <div className="text-[11px] text-[#655f55]">{t.victoryScore}</div>
            <div className="mt-0.5 font-mono-tabular text-base font-bold text-[#171614]">
              {score}
            </div>
          </div>
          <div className="p-3 text-center">
            <div className="text-[11px] text-[#655f55]">{t.victoryHints}</div>
            <div className="mt-0.5 font-mono-tabular text-base font-bold text-[#171614]">
              {hintsUsed}
            </div>
          </div>
          <div className="p-3 text-center">
            <div className="text-[11px] text-[#655f55]">{t.victoryStreak}</div>
            <div className="mt-0.5 font-mono-tabular text-base font-bold text-[#b42318]">
              {streak}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {hasNextEdition && (
            <button
              type="button"
              onClick={onNextEdition}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-[#faf7f0] bg-[#b42318] hover:bg-[#911b12] rounded-sm transition-colors cursor-pointer whitespace-nowrap"
            >
              <span>{t.victoryNextEdition}</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2.5 text-sm font-semibold text-[#171614] bg-[#e8e1d1] hover:bg-[#d8cfbc] border border-[#1c1917] rounded-sm transition-colors cursor-pointer whitespace-nowrap"
          >
            {t.victoryBackToBoard}
          </button>
        </div>
      </div>
    </div>
  );
}
