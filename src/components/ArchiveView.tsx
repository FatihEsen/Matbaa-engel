import { ArrowRight, Calendar, CheckCircle2, Sparkles } from 'lucide-react';
import { getLexiconStats } from '../data/lexicon';
import { TranslationBundle } from '../i18n/translations';
import { Language, PuzzleDefinition, PuzzleProgress } from '../types/puzzle';
import { buildGrid, evaluatePuzzleProgress } from '../utils/gridEngine';
import { formatDuration } from '../utils/turkish';
import { WoodcutArtwork } from './WoodcutArtwork';

interface ArchiveViewProps {
  t: TranslationBundle;
  language: Language;
  dailyPuzzles: PuzzleDefinition[];
  generatedPuzzles: PuzzleDefinition[];
  curatedPuzzles: PuzzleDefinition[];
  progressByPuzzle: Record<string, PuzzleProgress>;
  onOpenPuzzle: (puzzleId: string) => void;
  onOpenGenerator: () => void;
  onOpenDaily: () => void;
}

export function ArchiveView({
  t,
  language,
  dailyPuzzles,
  generatedPuzzles,
  curatedPuzzles,
  progressByPuzzle,
  onOpenPuzzle,
  onOpenGenerator,
  onOpenDaily,
}: ArchiveViewProps) {
  const stats = getLexiconStats();

  const renderPuzzleGrid = (list: PuzzleDefinition[]) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {list.map((puzzle) => {
        const built = buildGrid(puzzle);
        const progress: PuzzleProgress = progressByPuzzle[puzzle.id] || {
          entries: {},
          flags: {},
          elapsedSeconds: 0,
          hintsUsed: 0,
          checksUsed: 0,
        };
        const evalStats = evaluatePuzzleProgress(puzzle, built, progress);
        const isSolved = Boolean(progress.completedAt) || evalStats.isSolved;
        const isStarted = evalStats.filledCount > 0;

        const ctaLabel = isSolved
          ? t.reviewEdition
          : isStarted
            ? t.resumeEdition
            : t.openEdition;

        return (
          <article
            key={puzzle.id}
            className="bg-[#faf7f0] border border-[#1c1917] flex flex-col sm:flex-row overflow-hidden"
          >
            {/* Woodcut Illustration Preview */}
            <div className="sm:w-44 sm:shrink-0 aspect-square sm:aspect-auto border-b sm:border-b-0 sm:border-r border-[#1c1917] bg-[#f3ede0]">
              <WoodcutArtwork
                photo={puzzle.photoBlock}
                language={language}
                className="w-full h-full"
              />
            </div>

            {/* Editorial Card Body */}
            <div className="flex-1 p-5 flex flex-col justify-between gap-4">
              <div>
                <div className="flex items-center justify-between gap-2 text-xs text-[#5c564d]">
                  <span>
                    <span className="font-mono-tabular font-semibold text-[#b42318]">
                      {t.editionLabel} {puzzle.issueNumber}
                    </span>
                    {' · '}
                    <span className="font-mono-tabular">
                      {puzzle.rows}×{puzzle.cols}
                    </span>
                    {' · '}
                    {t.difficulty[puzzle.difficulty]}
                    {' · '}
                    {puzzle.theme[language]}
                  </span>
                  {isSolved && (
                    <CheckCircle2
                      className="w-4 h-4 text-[#15803d] shrink-0"
                      aria-hidden="true"
                    />
                  )}
                </div>

                <h3 className="mt-1.5 font-display text-xl font-bold text-[#171614] leading-snug">
                  {puzzle.title[language]}
                </h3>

                <p className="mt-1.5 font-editorial text-sm text-[#5c564d] leading-relaxed">
                  {puzzle.subtitle[language]}
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs text-[#5c564d] mb-2 font-mono-tabular">
                  <span>
                    {puzzle.words.length} {t.wordsCount} · {evalStats.percentComplete}%
                  </span>
                  <span>
                    {progress.elapsedSeconds > 0
                      ? formatDuration(progress.elapsedSeconds)
                      : '00:00'}
                  </span>
                </div>

                <div className="w-full h-1.5 bg-[#e8e1d1] mb-4 overflow-hidden">
                  <div
                    className={`h-full transition-transform origin-left ${
                      isSolved ? 'bg-[#15803d]' : 'bg-[#171614]'
                    }`}
                    style={{ transform: `scaleX(${evalStats.percentComplete / 100})` }}
                  />
                </div>

                <button
                  type="button"
                  onClick={() => onOpenPuzzle(puzzle.id)}
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-[#faf7f0] bg-[#171614] hover:bg-[#b42318] rounded-sm transition-colors cursor-pointer"
                >
                  <span>{ctaLabel}</span>
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );

  return (
    <section className="no-print max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header & Lexicon Database Overview */}
      <div className="pb-6 border-b-2 border-double border-[#1c1917] flex flex-col lg:flex-row lg:items-end justify-between gap-5">
        <div>
          <div className="text-xs font-semibold text-[#b42318] font-mono-tabular">
            {t.lexiconSummaryLabel.replace('{count}', String(stats.total))}
          </div>
          <h1 className="mt-1 font-display text-3xl sm:text-4xl font-bold text-[#171614] text-balance">
            {t.archiveTitle}
          </h1>
          <p className="mt-2 font-editorial text-base text-[#5c564d] max-w-2xl">
            {t.archiveSubtitle}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={onOpenDaily}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-[#171614] bg-[#fef3c7] hover:bg-[#fde68a] border border-[#1c1917] rounded-sm transition-colors cursor-pointer"
          >
            <Calendar className="w-4 h-4 text-[#b42318]" aria-hidden="true" />
            <span>{t.dailyButton}</span>
          </button>
          <button
            type="button"
            onClick={onOpenGenerator}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-[#faf7f0] bg-[#b42318] hover:bg-[#911b12] rounded-sm transition-colors cursor-pointer"
          >
            <Sparkles className="w-4 h-4" aria-hidden="true" />
            <span>{t.generatorButton}</span>
          </button>
        </div>
      </div>

      {/* 1. Daily Puzzles Section */}
      <div>
        <h2 className="font-display text-2xl font-bold text-[#171614] pb-2.5 mb-5 border-b border-[#1c1917]">
          {t.archiveDailyHeading}
        </h2>
        {renderPuzzleGrid(dailyPuzzles)}
      </div>

      {/* 2. User-Generated Custom Editions (when present) */}
      {generatedPuzzles.length > 0 && (
        <div>
          <h2 className="font-display text-2xl font-bold text-[#171614] pb-2.5 mb-5 border-b border-[#1c1917]">
            {t.archiveGeneratedHeading}
          </h2>
          {renderPuzzleGrid(generatedPuzzles)}
        </div>
      )}

      {/* 3. Classic Curated Editions */}
      <div>
        <h2 className="font-display text-2xl font-bold text-[#171614] pb-2.5 mb-5 border-b border-[#1c1917]">
          {t.archiveCuratedHeading}
        </h2>
        {renderPuzzleGrid(curatedPuzzles)}
      </div>
    </section>
  );
}
