import { Printer, X } from 'lucide-react';
import { TranslationBundle } from '../i18n/translations';
import {
  CellFlag,
  Language,
  PrintMode,
  PuzzleDefinition,
} from '../types/puzzle';
import { BuiltGrid } from '../utils/gridEngine';
import { CrosswordGrid } from './CrosswordGrid';

interface PrintModalProps {
  t: TranslationBundle;
  open: boolean;
  printMode: PrintMode;
  onChangePrintMode: (mode: PrintMode) => void;
  onConfirmPrint: () => void;
  onClose: () => void;
}

export function PrintModal({
  t,
  open,
  printMode,
  onChangePrintMode,
  onConfirmPrint,
  onClose,
}: PrintModalProps) {
  if (!open) return null;

  const options: Array<{ id: PrintMode; title: string; desc: string }> = [
    { id: 'blank', title: t.printBlank, desc: t.printBlankDesc },
    { id: 'progress', title: t.printProgress, desc: t.printProgressDesc },
    { id: 'solution', title: t.printSolution, desc: t.printSolutionDesc },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="print-modal-title"
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

        <h2
          id="print-modal-title"
          className="font-display text-2xl font-bold text-[#171614]"
        >
          {t.printModalTitle}
        </h2>
        <p className="mt-1.5 text-sm text-[#5c564d]">{t.printModalDesc}</p>

        <div className="my-5 space-y-2.5">
          {options.map((opt) => {
            const active = printMode === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onChangePrintMode(opt.id)}
                className={`w-full text-left p-3.5 border transition-colors cursor-pointer ${
                  active
                    ? 'bg-[#fef3c7] border-[#1c1917]'
                    : 'bg-[#f5f1e8] border-[#c8bfa9] hover:border-[#1c1917]'
                }`}
              >
                <div className="text-sm font-semibold text-[#171614]">
                  {opt.title}
                </div>
                <div className="mt-0.5 text-xs text-[#5c564d]">{opt.desc}</div>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onConfirmPrint}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-[#faf7f0] bg-[#b42318] hover:bg-[#911b12] rounded-sm transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" aria-hidden="true" />
            <span>{t.printConfirm}</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 text-sm font-medium text-[#3f3b35] bg-[#e8e1d1] hover:bg-[#d8cfbc] rounded-sm transition-colors cursor-pointer"
          >
            {t.cancel}
          </button>
        </div>
      </div>
    </div>
  );
}

interface PrintSheetProps {
  t: TranslationBundle;
  language: Language;
  puzzle: PuzzleDefinition;
  built: BuiltGrid;
  entries: Record<string, string>;
  flags: Record<string, CellFlag>;
  printMode: PrintMode;
}

/**
 * Dedicated broadsheet page visible exclusively during @media print.
 */
export function PrintSheet({
  t,
  language,
  puzzle,
  built,
  entries,
  flags,
  printMode,
}: PrintSheetProps) {
  return (
    <div className="print-only bg-white text-black p-2">
      <div className="border-b-2 border-black pb-2 mb-3 flex items-baseline justify-between">
        <div>
          <div className="font-display text-3xl font-extrabold tracking-tight">
            {t.appName}
          </div>
          <div className="font-editorial text-sm mt-0.5">
            {t.editionLabel} {puzzle.issueNumber} · {puzzle.title[language]} ·{' '}
            {t.difficulty[puzzle.difficulty]}
          </div>
        </div>
        <div className="text-xs font-mono-tabular text-right">
          {printMode === 'blank'
            ? t.printBlank
            : printMode === 'progress'
              ? t.printProgress
              : t.printSolution}
        </div>
      </div>

      <div className="max-w-[170mm] mx-auto my-4">
        <CrosswordGrid
          puzzle={puzzle}
          built={built}
          language={language}
          entries={entries}
          flags={flags}
          activeCell={null}
          activeWordId={null}
          solvedWordIds={new Set()}
          printMode={printMode}
        />
      </div>

      <div className="mt-4 pt-2 border-t border-black flex items-center justify-between text-[11px] font-editorial">
        <span>{t.printSheetFooter}</span>
        <span>
          {puzzle.words.length} {t.wordsCount}
        </span>
      </div>
    </div>
  );
}
