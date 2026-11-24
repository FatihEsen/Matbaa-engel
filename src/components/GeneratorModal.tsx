import { useState } from 'react';
import { Calendar, Sparkles, X } from 'lucide-react';
import { getLexiconStats } from '../data/lexicon';
import { TranslationBundle } from '../i18n/translations';
import {
  Difficulty,
  GeneratorConfig,
  GridSize,
  PuzzleCategory,
} from '../types/puzzle';

interface GeneratorModalProps {
  t: TranslationBundle;
  onClose: () => void;
  onGenerate: (config: GeneratorConfig) => void;
  onOpenDaily: () => void;
}

const CATEGORIES: PuzzleCategory[] = [
  'all',
  'kultur',
  'cografya',
  'mutfak',
  'tarih',
  'bilim',
  'genel',
];

const GRID_SIZES: GridSize[] = [8, 10, 12];

const DIFFICULTIES: Difficulty[] = ['easy', 'medium', 'hard', 'master'];

export function GeneratorModal({
  t,
  onClose,
  onGenerate,
  onOpenDaily,
}: GeneratorModalProps) {
  const [category, setCategory] = useState<PuzzleCategory>('all');
  const [size, setSize] = useState<GridSize>(10);
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');

  const stats = getLexiconStats();

  const handleCreate = () => {
    onGenerate({
      size,
      category,
      difficulty,
      mode: 'custom',
      seed: `custom-${size}-${category}-${difficulty}-${Date.now().toString(36)}`,
    });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="generator-modal-title"
      className="no-print fixed inset-0 z-50 bg-[#171614]/60 flex items-center justify-center p-4"
    >
      <div className="bg-[#faf7f0] border-2 border-[#1c1917] max-w-xl w-full p-6 sm:p-7 shadow-[0_12px_40px_rgba(23,22,20,0.28)] max-h-[92vh] overflow-y-auto">
        <div className="flex items-start justify-between gap-4 pb-3 border-b-2 border-double border-[#1c1917]">
          <div>
            <div className="text-xs font-semibold text-[#b42318]">
              {t.lexiconSummaryLabel.replace('{count}', String(stats.total))}
            </div>
            <h2
              id="generator-modal-title"
              className="mt-0.5 font-display text-2xl font-bold text-[#171614]"
            >
              {t.generatorTitle}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t.cancel}
            className="p-1 text-[#5c564d] hover:text-[#171614] cursor-pointer"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <p className="mt-3 font-editorial text-sm text-[#5c564d] leading-relaxed">
          {t.generatorSubtitle}
        </p>

        {/* Daily Puzzle Quick Banner */}
        <div className="mt-4 p-3.5 bg-[#f5f1e8] border border-[#1c1917] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Calendar className="w-4 h-4 text-[#b42318] shrink-0" aria-hidden="true" />
            <span className="text-xs font-semibold text-[#171614]">
              {t.dailyButton}
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              onOpenDaily();
              onClose();
            }}
            className="px-3.5 py-1.5 text-xs font-semibold text-[#171614] bg-[#fef3c7] hover:bg-[#fde68a] border border-[#1c1917] rounded-sm transition-colors cursor-pointer"
          >
            {t.generatorDailyQuickBtn}
          </button>
        </div>

        {/* 1. Category / Theme Selector */}
        <div className="mt-5">
          <label className="block text-xs font-bold uppercase tracking-wider text-[#3f3b35] mb-2">
            {t.generatorCategoryLabel}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {CATEGORIES.map((cat) => {
              const active = category === cat;
              const wordCount =
                cat === 'all' ? stats.total : stats.byCategory[cat] ?? 0;

              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-2 text-left border flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                    active
                      ? 'bg-[#171614] text-[#faf7f0] border-[#171614]'
                      : 'bg-[#f5f1e8] text-[#171614] border-[#c8bfa9] hover:border-[#1c1917]'
                  }`}
                >
                  <span className="text-xs font-semibold truncate">
                    {t.categories[cat]}
                  </span>
                  <span
                    className={`font-mono-tabular text-[11px] shrink-0 ${
                      active ? 'text-[#fde68a]' : 'text-[#655f55]'
                    }`}
                  >
                    {wordCount}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Grid Size Selector (8x8, 10x10, 12x12) */}
        <div className="mt-5">
          <label className="block text-xs font-bold uppercase tracking-wider text-[#3f3b35] mb-2">
            {t.generatorSizeLabel}
          </label>
          <div className="grid grid-cols-3 gap-2">
            {GRID_SIZES.map((s) => {
              const active = size === s;
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSize(s)}
                  className={`px-3 py-2.5 text-center border transition-colors cursor-pointer ${
                    active
                      ? 'bg-[#b42318] text-[#faf7f0] border-[#171614]'
                      : 'bg-[#f5f1e8] text-[#171614] border-[#c8bfa9] hover:border-[#1c1917]'
                  }`}
                >
                  <div className="font-mono-tabular text-sm font-bold">
                    {s}×{s}
                  </div>
                  <div
                    className={`mt-0.5 text-[11px] leading-tight ${
                      active ? 'text-[#faf7f0]/90' : 'text-[#5c564d]'
                    }`}
                  >
                    {t.gridSizes[s]}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Difficulty Level Selector */}
        <div className="mt-5">
          <label className="block text-xs font-bold uppercase tracking-wider text-[#3f3b35] mb-2">
            {t.generatorDifficultyLabel}
          </label>
          <div className="grid grid-cols-4 gap-2">
            {DIFFICULTIES.map((diff) => {
              const active = difficulty === diff;
              return (
                <button
                  key={diff}
                  type="button"
                  onClick={() => setDifficulty(diff)}
                  className={`px-2.5 py-2 text-xs font-semibold border transition-colors cursor-pointer ${
                    active
                      ? 'bg-[#171614] text-[#faf7f0] border-[#171614]'
                      : 'bg-[#f5f1e8] text-[#171614] border-[#c8bfa9] hover:border-[#1c1917]'
                  }`}
                >
                  {t.difficulty[diff]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="mt-6 pt-4 border-t border-[#d4ccb8] flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-[#3f3b35] bg-[#e8e1d1] hover:bg-[#d8cfbc] rounded-sm transition-colors cursor-pointer"
          >
            {t.cancel}
          </button>
          <button
            type="button"
            onClick={handleCreate}
            className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-[#faf7f0] bg-[#b42318] hover:bg-[#911b12] rounded-sm transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{t.generatorCreateBtn}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
