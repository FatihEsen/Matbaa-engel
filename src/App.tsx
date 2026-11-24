/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActiveClueBanner } from './components/ActiveClueBanner';
import { ArchiveView } from './components/ArchiveView';
import { CrosswordGrid } from './components/CrosswordGrid';
import { GeneratorModal } from './components/GeneratorModal';
import { GuideView } from './components/GuideView';
import { MastheadHeader } from './components/MastheadHeader';
import { PressUtilityRail } from './components/PressUtilityRail';
import { PrintModal, PrintSheet } from './components/PrintModal';
import { StatsView } from './components/StatsView';
import { TurkishKeyboard } from './components/TurkishKeyboard';
import { VictoryModal } from './components/VictoryModal';
import { PUZZLES } from './data/puzzles';
import { TRANSLATIONS } from './i18n/translations';
import {
  ActiveView,
  CellFlag,
  GeneratorConfig,
  Language,
  PrintMode,
  PuzzleDefinition,
  PuzzleProgress,
  UserProfile,
  WordDirection,
} from './types/puzzle';
import {
  buildGrid,
  cellKey,
  evaluatePuzzleProgress,
  getWordCells,
} from './utils/gridEngine';
import {
  generateDynamicPuzzle,
  getRecentDailyPuzzles,
} from './utils/puzzleGenerator';
import {
  playBackspaceTap,
  playErrorTick,
  playKeyTap,
  playPuzzleVictory,
  playWordSolved,
} from './utils/sound';
import {
  createEmptyProgress,
  loadUserProfile,
  saveUserProfile,
} from './utils/storage';
import { isTurkishLetter, toTurkishUpper } from './utils/turkish';

export default function App() {
  const [profile, setProfile] = useState<UserProfile>(() => loadUserProfile());
  const [activeView, setActiveView] = useState<ActiveView>('play');
  const [currentPuzzleId, setCurrentPuzzleId] = useState<string>(PUZZLES[0].id);
  const [direction, setDirection] = useState<WordDirection>('across');
  const [activeCell, setActiveCell] = useState<{ row: number; col: number } | null>({
    row: PUZZLES[0].words[0].startRow,
    col: PUZZLES[0].words[0].startCol,
  });
  const [isPaused, setIsPaused] = useState(false);
  const [victoryOpen, setVictoryOpen] = useState(false);
  const [printOpen, setPrintOpen] = useState(false);
  const [generatorOpen, setGeneratorOpen] = useState(false);
  const [printMode, setPrintMode] = useState<PrintMode>('blank');
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const feedbackTimerRef = useRef<number | null>(null);

  const showFeedback = useCallback((msg: string) => {
    setFeedbackMessage(msg);
    if (feedbackTimerRef.current) {
      window.clearTimeout(feedbackTimerRef.current);
    }
    feedbackTimerRef.current = window.setTimeout(() => {
      setFeedbackMessage(null);
    }, 3400);
  }, []);

  // Persist profile on every change
  useEffect(() => {
    saveUserProfile(profile);
  }, [profile]);

  // Sync HTML lang attribute
  useEffect(() => {
    document.documentElement.lang = profile.language;
  }, [profile.language]);

  const t = TRANSLATIONS[profile.language];

  const dailyPuzzles = useMemo(() => getRecentDailyPuzzles(4), []);

  const allPuzzles = useMemo(() => {
    const map = new Map<string, PuzzleDefinition>();
    for (const p of dailyPuzzles) map.set(p.id, p);
    for (const p of profile.generatedPuzzles) map.set(p.id, p);
    for (const p of PUZZLES) map.set(p.id, p);
    return Array.from(map.values());
  }, [dailyPuzzles, profile.generatedPuzzles]);

  const railPuzzles = useMemo(() => {
    const map = new Map<string, PuzzleDefinition>();
    if (dailyPuzzles[0]) map.set(dailyPuzzles[0].id, dailyPuzzles[0]);
    for (const p of profile.generatedPuzzles.slice(0, 4)) map.set(p.id, p);
    for (const p of PUZZLES) map.set(p.id, p);
    return Array.from(map.values());
  }, [dailyPuzzles, profile.generatedPuzzles]);

  const currentPuzzle = useMemo(
    () => allPuzzles.find((p) => p.id === currentPuzzleId) ?? PUZZLES[0],
    [allPuzzles, currentPuzzleId]
  );

  const built = useMemo(() => buildGrid(currentPuzzle), [currentPuzzle]);

  const currentProgress: PuzzleProgress = useMemo(
    () => profile.progressByPuzzle[currentPuzzle.id] ?? createEmptyProgress(),
    [profile.progressByPuzzle, currentPuzzle.id]
  );

  const evaluation = useMemo(
    () => evaluatePuzzleProgress(currentPuzzle, built, currentProgress),
    [currentPuzzle, built, currentProgress]
  );

  // Resolve activeWordId & crossingWordId from activeCell + direction
  const { activeWord, crossingWord } = useMemo(() => {
    if (!activeCell) {
      const first = currentPuzzle.words[0] ?? null;
      return { activeWord: first, crossingWord: null };
    }
    const cell = built.cells[activeCell.row]?.[activeCell.col];
    if (!cell || cell.kind !== 'letter') {
      const first = currentPuzzle.words[0] ?? null;
      return { activeWord: first, crossingWord: null };
    }
    const primaryId =
      direction === 'across'
        ? cell.acrossWordId ?? cell.downWordId
        : cell.downWordId ?? cell.acrossWordId;
    const secondaryId =
      primaryId === cell.acrossWordId ? cell.downWordId : cell.acrossWordId;

    return {
      activeWord: primaryId ? built.wordsById[primaryId] ?? null : null,
      crossingWord: secondaryId ? built.wordsById[secondaryId] ?? null : null,
    };
  }, [activeCell, built, currentPuzzle.words, direction]);

  const activeWordId = activeWord?.id ?? null;

  // Live solving timer
  useEffect(() => {
    if (
      activeView !== 'play' ||
      isPaused ||
      victoryOpen ||
      printOpen ||
      evaluation.isSolved
    ) {
      return;
    }

    const interval = window.setInterval(() => {
      setProfile((prev) => {
        const existing = prev.progressByPuzzle[currentPuzzle.id] ?? createEmptyProgress();
        if (existing.completedAt) return prev;
        return {
          ...prev,
          progressByPuzzle: {
            ...prev.progressByPuzzle,
            [currentPuzzle.id]: {
              ...existing,
              elapsedSeconds: existing.elapsedSeconds + 1,
            },
          },
        };
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [activeView, isPaused, victoryOpen, printOpen, evaluation.isSolved, currentPuzzle.id]);

  // Helper to update current puzzle progress and detect newly solved words / puzzle victory
  const mutateCurrentProgress = useCallback(
    (updater: (prev: PuzzleProgress) => PuzzleProgress) => {
      setProfile((prevProfile) => {
        const prevProg =
          prevProfile.progressByPuzzle[currentPuzzle.id] ?? createEmptyProgress();
        const prevEval = evaluatePuzzleProgress(currentPuzzle, built, prevProg);
        const nextProg = updater(prevProg);
        const nextEval = evaluatePuzzleProgress(currentPuzzle, built, nextProg);

        let nextStreak = prevProfile.currentStreak;
        let nextBestStreak = prevProfile.bestStreak;
        let nextLastSolvedDate = prevProfile.lastSolvedDate;
        let finalizedProg = nextProg;

        if (!prevEval.isSolved && nextEval.isSolved) {
          const today = new Date().toISOString().slice(0, 10);
          if (!prevProg.completedAt) {
            nextStreak = prevProfile.currentStreak + 1;
            nextBestStreak = Math.max(prevProfile.bestStreak, nextStreak);
            nextLastSolvedDate = today;
          }
          finalizedProg = {
            ...nextProg,
            completedAt: nextProg.completedAt ?? new Date().toISOString(),
            bestScore: Math.max(nextProg.bestScore ?? 0, nextEval.score),
            bestTimeSeconds:
              nextProg.bestTimeSeconds !== undefined
                ? Math.min(nextProg.bestTimeSeconds, nextProg.elapsedSeconds)
                : nextProg.elapsedSeconds,
          };
          playPuzzleVictory(prevProfile.soundEnabled);
          window.setTimeout(() => setVictoryOpen(true), 160);
        } else if (nextEval.solvedWordIds.size > prevEval.solvedWordIds.size) {
          playWordSolved(prevProfile.soundEnabled);
        }

        return {
          ...prevProfile,
          currentStreak: nextStreak,
          bestStreak: nextBestStreak,
          lastSolvedDate: nextLastSolvedDate,
          progressByPuzzle: {
            ...prevProfile.progressByPuzzle,
            [currentPuzzle.id]: finalizedProg,
          },
        };
      });
    },
    [built, currentPuzzle]
  );

  // Select a puzzle from Archive, Rail, or Next Edition
  const handleSelectPuzzle = useCallback(
    (puzzleId: string) => {
      const target = allPuzzles.find((p) => p.id === puzzleId);
      if (!target) return;
      setCurrentPuzzleId(target.id);
      setActiveView('play');
      setIsPaused(false);
      setVictoryOpen(false);
      setFeedbackMessage(null);
      const firstWord = target.words[0];
      if (firstWord) {
        setDirection(firstWord.direction);
        setActiveCell({ row: firstWord.startRow, col: firstWord.startCol });
      }
    },
    [allPuzzles]
  );

  // Generate a new dynamic puzzle and open it immediately
  const handleGeneratePuzzle = useCallback((config: GeneratorConfig) => {
    const newPuzzle = generateDynamicPuzzle(config);
    setProfile((prev) => ({
      ...prev,
      generatedPuzzles: [
        newPuzzle,
        ...prev.generatedPuzzles.filter((p) => p.id !== newPuzzle.id),
      ].slice(0, 24),
    }));
    setCurrentPuzzleId(newPuzzle.id);
    setActiveView('play');
    setIsPaused(false);
    setVictoryOpen(false);
    setGeneratorOpen(false);
    setFeedbackMessage(null);
    const firstWord = newPuzzle.words[0];
    if (firstWord) {
      setDirection(firstWord.direction);
      setActiveCell({ row: firstWord.startRow, col: firstWord.startCol });
    }
  }, []);

  const handleOpenDaily = useCallback(() => {
    const todayPuzzle = dailyPuzzles[0];
    if (todayPuzzle) {
      handleSelectPuzzle(todayPuzzle.id);
    }
  }, [dailyPuzzles, handleSelectPuzzle]);

  // Select a letter cell; clicking already-active cell flips direction if intersection exists
  const handleSelectLetterCell = useCallback(
    (row: number, col: number) => {
      const cell = built.cells[row]?.[col];
      if (!cell || cell.kind !== 'letter') return;

      if (activeCell && activeCell.row === row && activeCell.col === col) {
        if (cell.acrossWordId && cell.downWordId) {
          setDirection((prev) => (prev === 'across' ? 'down' : 'across'));
        }
        return;
      }

      setActiveCell({ row, col });
      if (direction === 'across' && !cell.acrossWordId && cell.downWordId) {
        setDirection('down');
      } else if (direction === 'down' && !cell.downWordId && cell.acrossWordId) {
        setDirection('across');
      }
    },
    [activeCell, built.cells, direction]
  );

  // Select a word directly by clicking a clue tile, photo block, or crossing clue
  const handleSelectWordById = useCallback(
    (wordId: string) => {
      const word = built.wordsById[wordId];
      if (!word) return;
      setDirection(word.direction);
      const coords = getWordCells(word);
      const firstEmpty = coords.find(
        (c) => !currentProgress.entries[cellKey(c.row, c.col)]
      );
      const target = firstEmpty ?? coords[0];
      if (target) {
        setActiveCell({ row: target.row, col: target.col });
      }
    },
    [built.wordsById, currentProgress.entries]
  );

  const handleFlipDirection = useCallback(() => {
    if (!activeCell) return;
    const cell = built.cells[activeCell.row]?.[activeCell.col];
    if (cell?.kind === 'letter' && cell.acrossWordId && cell.downWordId) {
      setDirection((prev) => (prev === 'across' ? 'down' : 'across'));
    }
  }, [activeCell, built.cells]);

  const handleStepClue = useCallback(
    (delta: 1 | -1) => {
      const words = currentPuzzle.words;
      if (words.length === 0) return;
      const idx = words.findIndex((w) => w.id === activeWordId);
      const nextIdx =
        idx === -1
          ? 0
          : (idx + delta + words.length) % words.length;
      handleSelectWordById(words[nextIdx].id);
    },
    [activeWordId, currentPuzzle.words, handleSelectWordById]
  );

  // Enter a Turkish character into activeCell and advance cursor cleanly
  const handleCharInput = useCallback(
    (rawChar: string) => {
      if (isPaused || !activeCell || !activeWord) return;
      const upper = toTurkishUpper(rawChar);
      if (!isTurkishLetter(upper)) return;

      const cell = built.cells[activeCell.row]?.[activeCell.col];
      if (!cell || cell.kind !== 'letter') return;

      const k = cellKey(activeCell.row, activeCell.col);
      playKeyTap(profile.soundEnabled);

      mutateCurrentProgress((prev) => {
        const nextEntries = { ...prev.entries, [k]: upper };
        const nextFlags: Record<string, CellFlag> = { ...prev.flags };
        if (profile.autoCheck) {
          nextFlags[k] = upper === cell.expected ? 'checked-ok' : 'checked-error';
          if (upper !== cell.expected) {
            playErrorTick(profile.soundEnabled);
          }
        } else {
          delete nextFlags[k];
        }
        return {
          ...prev,
          entries: nextEntries,
          flags: nextFlags,
        };
      });

      // Advance cursor along activeWord
      const coords = getWordCells(activeWord);
      const curIndex = coords.findIndex(
        (c) => c.row === activeCell.row && c.col === activeCell.col
      );
      if (curIndex !== -1 && curIndex < coords.length - 1) {
        // Prefer next empty cell ahead; fallback to immediate next cell
        const nextEmptyAhead = coords
          .slice(curIndex + 1)
          .find((c) => !currentProgress.entries[cellKey(c.row, c.col)]);
        const target = nextEmptyAhead ?? coords[curIndex + 1];
        setActiveCell({ row: target.row, col: target.col });
      }
    },
    [
      activeCell,
      activeWord,
      built.cells,
      currentProgress.entries,
      isPaused,
      mutateCurrentProgress,
      profile.autoCheck,
      profile.soundEnabled,
    ]
  );

  const handleBackspace = useCallback(() => {
    if (isPaused || !activeCell || !activeWord) return;
    const k = cellKey(activeCell.row, activeCell.col);
    const hasCharHere = Boolean(currentProgress.entries[k]);
    playBackspaceTap(profile.soundEnabled);

    if (hasCharHere) {
      mutateCurrentProgress((prev) => {
        const nextEntries = { ...prev.entries };
        const nextFlags = { ...prev.flags };
        delete nextEntries[k];
        delete nextFlags[k];
        return { ...prev, entries: nextEntries, flags: nextFlags };
      });
      return;
    }

    const coords = getWordCells(activeWord);
    const curIndex = coords.findIndex(
      (c) => c.row === activeCell.row && c.col === activeCell.col
    );
    if (curIndex > 0) {
      const prevCoord = coords[curIndex - 1];
      const prevKey = cellKey(prevCoord.row, prevCoord.col);
      setActiveCell({ row: prevCoord.row, col: prevCoord.col });
      mutateCurrentProgress((prev) => {
        const nextEntries = { ...prev.entries };
        const nextFlags = { ...prev.flags };
        delete nextEntries[prevKey];
        delete nextFlags[prevKey];
        return { ...prev, entries: nextEntries, flags: nextFlags };
      });
    }
  }, [
    activeCell,
    activeWord,
    currentProgress.entries,
    isPaused,
    mutateCurrentProgress,
    profile.soundEnabled,
  ]);

  // Spatial arrow-key movement skipping clue/photo tiles cleanly
  const handleArrowMove = useCallback(
    (dr: number, dc: number) => {
      if (!activeCell) return;
      let r = activeCell.row + dr;
      let c = activeCell.col + dc;
      while (r >= 0 && r < currentPuzzle.rows && c >= 0 && c < currentPuzzle.cols) {
        const target = built.cells[r][c];
        if (target.kind === 'letter') {
          setActiveCell({ row: r, col: c });
          if (dc !== 0 && target.acrossWordId) {
            setDirection('across');
          } else if (dr !== 0 && target.downWordId) {
            setDirection('down');
          }
          return;
        }
        r += dr;
        c += dc;
      }
    },
    [activeCell, built.cells, currentPuzzle.cols, currentPuzzle.rows]
  );

  // Physical Keyboard Listener (true Turkish casing!)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (activeView !== 'play' || isPaused || victoryOpen || printOpen) return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      const targetTag = (e.target as HTMLElement | null)?.tagName;
      if (targetTag === 'INPUT' || targetTag === 'TEXTAREA') return;

      if (e.key === 'Backspace' || e.key === 'Delete') {
        e.preventDefault();
        handleBackspace();
        return;
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleArrowMove(0, 1);
        return;
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handleArrowMove(0, -1);
        return;
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        handleArrowMove(1, 0);
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        handleArrowMove(-1, 0);
        return;
      }
      if (e.key === ' ') {
        e.preventDefault();
        handleFlipDirection();
        return;
      }
      if (e.key === 'Tab') {
        e.preventDefault();
        handleStepClue(e.shiftKey ? -1 : 1);
        return;
      }
      if (e.key.length === 1 && isTurkishLetter(e.key)) {
        e.preventDefault();
        handleCharInput(e.key);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [
    activeView,
    handleArrowMove,
    handleBackspace,
    handleCharInput,
    handleFlipDirection,
    handleStepClue,
    isPaused,
    printOpen,
    victoryOpen,
  ]);

  // Hints & Verification Handlers
  const handleRevealLetter = useCallback(() => {
    if (!activeCell || isPaused) return;
    const cell = built.cells[activeCell.row]?.[activeCell.col];
    if (!cell || cell.kind !== 'letter') return;
    const k = cellKey(activeCell.row, activeCell.col);

    playKeyTap(profile.soundEnabled);
    mutateCurrentProgress((prev) => ({
      ...prev,
      entries: { ...prev.entries, [k]: cell.expected },
      flags: { ...prev.flags, [k]: 'revealed' },
      hintsUsed: prev.hintsUsed + 1,
    }));
  }, [activeCell, built.cells, isPaused, mutateCurrentProgress, profile.soundEnabled]);

  const handleRevealWord = useCallback(() => {
    if (!activeWord || isPaused) return;
    const coords = getWordCells(activeWord);

    playWordSolved(profile.soundEnabled);
    mutateCurrentProgress((prev) => {
      const nextEntries = { ...prev.entries };
      const nextFlags = { ...prev.flags };
      let addedHints = 0;

      for (const { row, col, char } of coords) {
        const k = cellKey(row, col);
        if (nextEntries[k] !== char) {
          nextEntries[k] = char;
          nextFlags[k] = 'revealed';
          addedHints++;
        }
      }

      return {
        ...prev,
        entries: nextEntries,
        flags: nextFlags,
        hintsUsed: prev.hintsUsed + Math.max(1, addedHints),
      };
    });
  }, [activeWord, isPaused, mutateCurrentProgress, profile.soundEnabled]);

  const handleCheckWord = useCallback(() => {
    if (!activeWord || isPaused) return;
    const coords = getWordCells(activeWord);
    let hasError = false;

    mutateCurrentProgress((prev) => {
      const nextFlags = { ...prev.flags };
      for (const { row, col, char } of coords) {
        const k = cellKey(row, col);
        const val = prev.entries[k];
        if (!val) continue;
        if (val === char) {
          if (nextFlags[k] !== 'revealed') nextFlags[k] = 'checked-ok';
        } else {
          nextFlags[k] = 'checked-error';
          hasError = true;
        }
      }
      return {
        ...prev,
        flags: nextFlags,
        checksUsed: prev.checksUsed + 1,
      };
    });

    if (hasError) {
      playErrorTick(profile.soundEnabled);
      showFeedback(t.toastWordHasErrors);
    } else {
      showFeedback(t.toastWordCorrect);
    }
  }, [
    activeWord,
    isPaused,
    mutateCurrentProgress,
    profile.soundEnabled,
    showFeedback,
    t.toastWordCorrect,
    t.toastWordHasErrors,
  ]);

  const handleCheckBoard = useCallback(() => {
    if (isPaused) return;
    let hasError = false;

    mutateCurrentProgress((prev) => {
      const nextFlags = { ...prev.flags };
      for (let r = 0; r < currentPuzzle.rows; r++) {
        for (let c = 0; c < currentPuzzle.cols; c++) {
          const cell = built.cells[r][c];
          if (cell.kind !== 'letter') continue;
          const k = cellKey(r, c);
          const val = prev.entries[k];
          if (!val) continue;
          if (val === cell.expected) {
            if (nextFlags[k] !== 'revealed') nextFlags[k] = 'checked-ok';
          } else {
            nextFlags[k] = 'checked-error';
            hasError = true;
          }
        }
      }
      return {
        ...prev,
        flags: nextFlags,
        checksUsed: prev.checksUsed + 1,
      };
    });

    if (hasError) {
      playErrorTick(profile.soundEnabled);
      showFeedback(t.toastErrorsFound);
    } else {
      showFeedback(t.toastBoardClean);
    }
  }, [
    built.cells,
    currentPuzzle.cols,
    currentPuzzle.rows,
    isPaused,
    mutateCurrentProgress,
    profile.soundEnabled,
    showFeedback,
    t.toastBoardClean,
    t.toastErrorsFound,
  ]);

  const handleResetPuzzle = useCallback(() => {
    setProfile((prev) => ({
      ...prev,
      progressByPuzzle: {
        ...prev.progressByPuzzle,
        [currentPuzzle.id]: createEmptyProgress(),
      },
    }));
    setIsPaused(false);
    setVictoryOpen(false);
    setFeedbackMessage(null);
    const first = currentPuzzle.words[0];
    if (first) {
      setDirection(first.direction);
      setActiveCell({ row: first.startRow, col: first.startCol });
    }
  }, [currentPuzzle]);

  const handleConfirmPrint = useCallback(() => {
    setPrintOpen(false);
    window.setTimeout(() => {
      window.print();
    }, 120);
  }, []);

  const currentIdx = allPuzzles.findIndex((p) => p.id === currentPuzzle.id);
  const nextPuzzle =
    currentIdx >= 0 && currentIdx < allPuzzles.length - 1
      ? allPuzzles[currentIdx + 1]
      : null;

  return (
    <div className="min-h-screen flex flex-col">
      <MastheadHeader
        t={t}
        activeView={activeView}
        onSelectView={setActiveView}
        onOpenPrint={() => setPrintOpen(true)}
        language={profile.language}
        onChangeLanguage={(lang: Language) =>
          setProfile((prev) => ({ ...prev, language: lang }))
        }
        soundEnabled={profile.soundEnabled}
        onToggleSound={() =>
          setProfile((prev) => ({ ...prev, soundEnabled: !prev.soundEnabled }))
        }
        currentPuzzle={currentPuzzle}
      />

      <main className="flex-1 no-print">
        {activeView === 'play' && (
          <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
              {/* Primary Broadsheet Canvas (~67%) */}
              <div className="lg:col-span-8 space-y-3.5">
                <ActiveClueBanner
                  t={t}
                  language={profile.language}
                  activeWord={activeWord}
                  showClueGloss={profile.showClueGloss}
                  onToggleClueGloss={() =>
                    setProfile((prev) => ({
                      ...prev,
                      showClueGloss: !prev.showClueGloss,
                    }))
                  }
                  onPrevClue={() => handleStepClue(-1)}
                  onNextClue={() => handleStepClue(1)}
                  onFlipDirection={handleFlipDirection}
                  canFlipDirection={Boolean(crossingWord)}
                />

                <div className="max-w-[760px] mx-auto">
                  <CrosswordGrid
                    puzzle={currentPuzzle}
                    built={built}
                    language={profile.language}
                    entries={currentProgress.entries}
                    flags={currentProgress.flags}
                    activeCell={activeCell}
                    activeWordId={activeWordId}
                    solvedWordIds={evaluation.solvedWordIds}
                    isPaused={isPaused}
                    pausedText={t.pausedBanner}
                    resumeLabel={t.resume}
                    onResume={() => setIsPaused(false)}
                    onSelectLetterCell={handleSelectLetterCell}
                    onSelectWordById={handleSelectWordById}
                  />

                  <TurkishKeyboard
                    t={t}
                    visible={profile.showKeyboard}
                    onToggleVisible={() =>
                      setProfile((prev) => ({
                        ...prev,
                        showKeyboard: !prev.showKeyboard,
                      }))
                    }
                    onKeyInput={handleCharInput}
                    onBackspace={handleBackspace}
                    onFlipDirection={handleFlipDirection}
                    disabled={isPaused}
                  />
                </div>
              </div>

              {/* Right Press Utility Rail (~33%) */}
              <div className="lg:col-span-4">
                <PressUtilityRail
                  t={t}
                  language={profile.language}
                  elapsedSeconds={currentProgress.elapsedSeconds}
                  isPaused={isPaused}
                  isSolved={evaluation.isSolved}
                  onTogglePause={() => setIsPaused((p) => !p)}
                  score={evaluation.score}
                  streak={profile.currentStreak}
                  percentComplete={evaluation.percentComplete}
                  filledCount={evaluation.filledCount}
                  totalLetters={evaluation.totalLetters}
                  autoCheck={profile.autoCheck}
                  onToggleAutoCheck={() =>
                    setProfile((prev) => ({
                      ...prev,
                      autoCheck: !prev.autoCheck,
                    }))
                  }
                  onRevealLetter={handleRevealLetter}
                  onRevealWord={handleRevealWord}
                  onCheckWord={handleCheckWord}
                  onCheckBoard={handleCheckBoard}
                  onResetPuzzle={handleResetPuzzle}
                  crossingWord={crossingWord}
                  onSelectWord={handleSelectWordById}
                  puzzles={railPuzzles}
                  currentPuzzleId={currentPuzzle.id}
                  progressByPuzzle={profile.progressByPuzzle}
                  onSelectPuzzle={handleSelectPuzzle}
                  onOpenGenerator={() => setGeneratorOpen(true)}
                  onOpenDaily={handleOpenDaily}
                  feedbackMessage={feedbackMessage}
                />
              </div>
            </div>
          </div>
        )}

        {activeView === 'archive' && (
          <ArchiveView
            t={t}
            language={profile.language}
            dailyPuzzles={dailyPuzzles}
            generatedPuzzles={profile.generatedPuzzles}
            curatedPuzzles={PUZZLES}
            progressByPuzzle={profile.progressByPuzzle}
            onOpenPuzzle={handleSelectPuzzle}
            onOpenGenerator={() => setGeneratorOpen(true)}
            onOpenDaily={handleOpenDaily}
          />
        )}

        {activeView === 'stats' && (
          <StatsView
            t={t}
            language={profile.language}
            puzzles={allPuzzles}
            profile={profile}
            onOpenPuzzle={handleSelectPuzzle}
          />
        )}

        {activeView === 'guide' && (
          <GuideView t={t} onReturnToPlay={() => setActiveView('play')} />
        )}
      </main>

      {/* Quiet Editorial Footer */}
      <footer className="no-print mt-auto border-t border-[#c8bfa9] bg-[#f5f1e8]">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center justify-between gap-2 text-xs text-[#655f55]">
          <span className="font-editorial">{t.printSheetFooter}</span>
          <span className="font-mono-tabular">
            {t.editionLabel} 01–04 · TR · EN · DE · FR
          </span>
        </div>
      </footer>

      {/* Modals */}
      <VictoryModal
        t={t}
        open={victoryOpen}
        editionTitle={`${t.editionLabel} ${currentPuzzle.issueNumber} · ${currentPuzzle.title[profile.language]}`}
        elapsedSeconds={currentProgress.elapsedSeconds}
        score={evaluation.score}
        hintsUsed={currentProgress.hintsUsed}
        streak={profile.currentStreak}
        hasNextEdition={Boolean(nextPuzzle)}
        onNextEdition={() => {
          if (nextPuzzle) handleSelectPuzzle(nextPuzzle.id);
        }}
        onClose={() => setVictoryOpen(false)}
      />

      <PrintModal
        t={t}
        open={printOpen}
        printMode={printMode}
        onChangePrintMode={setPrintMode}
        onConfirmPrint={handleConfirmPrint}
        onClose={() => setPrintOpen(false)}
      />

      {generatorOpen && (
        <GeneratorModal
          t={t}
          onClose={() => setGeneratorOpen(false)}
          onGenerate={handleGeneratePuzzle}
          onOpenDaily={handleOpenDaily}
        />
      )}

      {/* Dedicated Printable Broadsheet Output */}
      <PrintSheet
        t={t}
        language={profile.language}
        puzzle={currentPuzzle}
        built={built}
        entries={currentProgress.entries}
        flags={currentProgress.flags}
        printMode={printMode}
      />
    </div>
  );
}
