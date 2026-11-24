import { ArrowLeftRight, ChevronLeft, ChevronRight, Languages } from 'lucide-react';
import { TranslationBundle } from '../i18n/translations';
import { Language, WordEntry } from '../types/puzzle';
import { splitTurkishChars } from '../utils/turkish';
import { ClueArrowSvg } from './ClueArrowSvg';

interface ActiveClueBannerProps {
  t: TranslationBundle;
  language: Language;
  activeWord: WordEntry | null;
  showClueGloss: boolean;
  onToggleClueGloss: () => void;
  onPrevClue: () => void;
  onNextClue: () => void;
  onFlipDirection: () => void;
  canFlipDirection: boolean;
}

export function ActiveClueBanner({
  t,
  language,
  activeWord,
  showClueGloss,
  onToggleClueGloss,
  onPrevClue,
  onNextClue,
  onFlipDirection,
  canFlipDirection,
}: ActiveClueBannerProps) {
  if (!activeWord) {
    return null;
  }

  const charLength = splitTurkishChars(activeWord.answer).length;
  const dirLabel = activeWord.isPhotoClue
    ? t.photoClue
    : activeWord.direction === 'across'
      ? t.across
      : t.down;

  const translatedGloss =
    language !== 'tr' ? activeWord.gloss[language] : undefined;

  return (
    <section
      aria-live="polite"
      className="bg-[#faf7f0] border-2 border-[#1c1917] px-4 py-3 sm:px-5 sm:py-3.5"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 mb-2 border-b border-[#d4ccb8]">
        <div className="flex items-center gap-2 text-xs text-[#5c564d]">
          <span className="inline-flex items-center justify-center w-6 h-6 bg-[#e8e1d1] border border-[#1c1917]">
            <ClueArrowSvg arrow={activeWord.arrow} accent={activeWord.isPhotoClue} size={14} />
          </span>
          <span className="font-semibold text-[#171614]">{dirLabel}</span>
          <span aria-hidden="true">·</span>
          <span className="font-mono-tabular">
            {charLength} {t.lettersUnit}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {language !== 'tr' && (
            <button
              type="button"
              onClick={onToggleClueGloss}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium border rounded-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                showClueGloss
                  ? 'bg-[#171614] text-[#faf7f0] border-[#171614]'
                  : 'bg-[#f5f1e8] text-[#3f3b35] border-[#c8bfa9] hover:border-[#171614]'
              }`}
            >
              <Languages className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{showClueGloss ? t.hideGloss : t.showGloss}</span>
            </button>
          )}

          {canFlipDirection && (
            <button
              type="button"
              onClick={onFlipDirection}
              title={t.flipDirection}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-[#171614] bg-[#f5f1e8] hover:bg-[#e8e1d1] border border-[#c8bfa9] rounded-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <ArrowLeftRight className="w-3.5 h-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">{t.flipDirection}</span>
            </button>
          )}

          <button
            type="button"
            onClick={onPrevClue}
            aria-label={t.prevClue}
            title={t.prevClue}
            className="inline-flex items-center justify-center w-8 h-7 text-[#171614] bg-[#f5f1e8] hover:bg-[#e8e1d1] border border-[#c8bfa9] rounded-sm transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={onNextClue}
            aria-label={t.nextClue}
            title={t.nextClue}
            className="inline-flex items-center justify-center w-8 h-7 text-[#171614] bg-[#f5f1e8] hover:bg-[#e8e1d1] border border-[#c8bfa9] rounded-sm transition-colors cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      <p className="font-editorial text-base sm:text-lg font-semibold text-[#171614] leading-snug">
        {activeWord.clueFullTr}
      </p>

      {translatedGloss && showClueGloss && (
        <p className="mt-1 text-xs sm:text-[13px] text-[#5c564d] italic">
          {translatedGloss}
        </p>
      )}
    </section>
  );
}
