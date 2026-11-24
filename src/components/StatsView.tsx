import { TranslationBundle } from '../i18n/translations';
import { Language, PuzzleDefinition, UserProfile } from '../types/puzzle';
import { buildGrid, evaluatePuzzleProgress } from '../utils/gridEngine';
import { formatDuration } from '../utils/turkish';

interface StatsViewProps {
  t: TranslationBundle;
  language: Language;
  puzzles: PuzzleDefinition[];
  profile: UserProfile;
  onOpenPuzzle: (puzzleId: string) => void;
}

export function StatsView({
  t,
  language,
  puzzles,
  profile,
  onOpenPuzzle,
}: StatsViewProps) {
  let solvedCount = 0;
  let totalScore = 0;
  let totalHints = 0;

  const rows = puzzles.map((puzzle) => {
    const built = buildGrid(puzzle);
    const prog = profile.progressByPuzzle[puzzle.id] || {
      entries: {},
      flags: {},
      elapsedSeconds: 0,
      hintsUsed: 0,
      checksUsed: 0,
    };
    const evalStats = evaluatePuzzleProgress(puzzle, built, prog);
    const solved = Boolean(prog.completedAt) || evalStats.isSolved;
    const score = prog.bestScore ?? evalStats.score;

    if (solved) solvedCount++;
    totalScore += score;
    totalHints += prog.hintsUsed;

    return {
      puzzle,
      solved,
      inProgress: !solved && evalStats.filledCount > 0,
      percent: evalStats.percentComplete,
      time: prog.bestTimeSeconds ?? prog.elapsedSeconds,
      score,
    };
  });

  return (
    <section className="no-print max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="pb-5 mb-7 border-b border-[#1c1917]">
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#171614] text-balance">
          {t.statsTitle}
        </h1>
        <p className="mt-2 font-editorial text-base text-[#5c564d] max-w-2xl">
          {t.statsSubtitle}
        </p>
      </div>

      {/* 4-Column Tabular KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 bg-[#faf7f0] border border-[#1c1917] divide-y lg:divide-y-0 lg:divide-x divide-[#c8bfa9] mb-8">
        <div className="p-5">
          <div className="text-xs font-medium text-[#655f55]">{t.statsSolved}</div>
          <div className="mt-1 font-mono-tabular text-3xl font-bold text-[#171614]">
            {solvedCount} / {puzzles.length}
          </div>
        </div>
        <div className="p-5">
          <div className="text-xs font-medium text-[#655f55]">{t.statsCurrentStreak}</div>
          <div className="mt-1 font-mono-tabular text-3xl font-bold text-[#b42318]">
            {profile.currentStreak}
          </div>
          <div className="mt-0.5 text-xs text-[#655f55] font-mono-tabular">
            {t.statsBestStreak}: {profile.bestStreak}
          </div>
        </div>
        <div className="p-5">
          <div className="text-xs font-medium text-[#655f55]">{t.statsTotalScore}</div>
          <div className="mt-1 font-mono-tabular text-3xl font-bold text-[#171614]">
            {totalScore}
          </div>
        </div>
        <div className="p-5">
          <div className="text-xs font-medium text-[#655f55]">{t.statsHintsUsed}</div>
          <div className="mt-1 font-mono-tabular text-3xl font-bold text-[#171614]">
            {totalHints}
          </div>
        </div>
      </div>

      {/* Clean Newspaper Ledger Table */}
      <div className="bg-[#faf7f0] border border-[#1c1917]">
        <div className="px-5 py-3.5 border-b border-[#1c1917]">
          <h2 className="font-display text-lg font-bold text-[#171614]">
            {t.statsEditionLedger}
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#c8bfa9] text-xs font-semibold text-[#5c564d]">
                <th className="py-3 px-5">{t.statsEditionCol}</th>
                <th className="py-3 px-4">{t.statsDifficultyCol}</th>
                <th className="py-3 px-4">{t.statsStatusCol}</th>
                <th className="py-3 px-4 text-right">{t.statsTimeCol}</th>
                <th className="py-3 px-5 text-right">{t.statsScoreCol}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e1d9c6] text-sm">
              {rows.map(({ puzzle, solved, inProgress, percent, time, score }) => (
                <tr
                  key={puzzle.id}
                  onClick={() => onOpenPuzzle(puzzle.id)}
                  className="hover:bg-[#f5f1e8] transition-colors cursor-pointer"
                >
                  <td className="py-3.5 px-5 font-medium text-[#171614]">
                    <span className="font-mono-tabular text-[#b42318] mr-2">
                      {puzzle.issueNumber}
                    </span>
                    {puzzle.title[language]}
                  </td>
                  <td className="py-3.5 px-4 text-[#5c564d]">
                    {t.difficulty[puzzle.difficulty]}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`text-xs font-semibold ${
                        solved
                          ? 'text-[#15803d]'
                          : inProgress
                            ? 'text-[#171614]'
                            : 'text-[#655f55]'
                      }`}
                    >
                      {solved
                        ? t.solvedBadge
                        : inProgress
                          ? `${t.inProgressBadge} (${percent}%)`
                          : t.notStartedBadge}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono-tabular text-[#171614]">
                    {time > 0 ? formatDuration(time) : '—'}
                  </td>
                  <td className="py-3.5 px-5 text-right font-mono-tabular font-semibold text-[#171614]">
                    {score > 0 ? score : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
