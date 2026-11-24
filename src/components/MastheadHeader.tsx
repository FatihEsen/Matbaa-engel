import { Printer, Volume2, VolumeX } from 'lucide-react';
import { TranslationBundle } from '../i18n/translations';
import { ActiveView, Language, PuzzleDefinition } from '../types/puzzle';

interface MastheadHeaderProps {
  t: TranslationBundle;
  activeView: ActiveView;
  onSelectView: (view: ActiveView) => void;
  onOpenPrint: () => void;
  language: Language;
  onChangeLanguage: (lang: Language) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  currentPuzzle: PuzzleDefinition;
}

const LANGUAGES: Array<{ code: Language; label: string }> = [
  { code: 'tr', label: 'TR' },
  { code: 'en', label: 'EN' },
  { code: 'de', label: 'DE' },
  { code: 'fr', label: 'FR' },
];

export function MastheadHeader({
  t,
  activeView,
  onSelectView,
  onOpenPrint,
  language,
  onChangeLanguage,
  soundEnabled,
  onToggleSound,
  currentPuzzle,
}: MastheadHeaderProps) {
  const navItems: Array<{ id: ActiveView; label: string }> = [
    { id: 'play', label: t.navPlay },
    { id: 'archive', label: t.navArchive },
    { id: 'stats', label: t.navStats },
    { id: 'guide', label: t.navGuide },
  ];

  return (
    <div className="no-print bg-[#f5f1e8]">
      {/* Strict 3-Zone Top Bar Contract */}
      <header className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single-line Brand Wordmark */}
        <button
          type="button"
          onClick={() => onSelectView('play')}
          className="font-display text-2xl sm:text-[26px] font-extrabold tracking-tight text-[#171614] hover:text-[#b42318] transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#b42318]"
        >
          {t.appName}
        </button>

        {/* Zone 2: 4 Clean Single-Line Navigation Links */}
        <nav
          aria-label="Primary"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-[#3f3b35]"
        >
          {navItems.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectView(item.id)}
                className={`py-1 whitespace-nowrap shrink-0 cursor-pointer transition-colors border-b-2 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#b42318] ${
                  isActive
                    ? 'text-[#171614] font-semibold border-[#b42318]'
                    : 'border-transparent hover:text-[#171614] hover:border-[#c8bfa9]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="shrink-0">
          <button
            type="button"
            onClick={onOpenPrint}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-[#faf7f0] bg-[#b42318] hover:bg-[#911b12] rounded-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171614]"
          >
            <Printer className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>{t.actionPrint}</span>
          </button>
        </div>
      </header>

      {/* Classic Double Newspaper Rule */}
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="newspaper-double-rule" />
      </div>

      {/* Edition Metadata & Multilingual Switcher Ribbon */}
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3 border-b border-[#c8bfa9]">
        {/* Unboxed editorial metadata with typographic separators */}
        <div className="flex items-center flex-wrap gap-x-2.5 gap-y-1 text-xs sm:text-[13px] text-[#5c564d]">
          <span className="font-mono-tabular font-semibold text-[#171614]">
            {t.editionLabel} {currentPuzzle.issueNumber}
          </span>
          <span aria-hidden="true">·</span>
          <span className="font-medium text-[#171614]">{currentPuzzle.title[language]}</span>
          <span aria-hidden="true">·</span>
          <span>{t.difficulty[currentPuzzle.difficulty]}</span>
          <span aria-hidden="true">·</span>
          <span className="font-mono-tabular">
            {currentPuzzle.words.length} {t.wordsCount}
          </span>
        </div>

        {/* Mobile Nav Row + Language & Sound Controls */}
        <div className="flex items-center gap-3 ml-auto">
          <div
            role="group"
            aria-label={t.languageLabel}
            className="inline-flex items-center bg-[#e8e1d1] p-0.5 rounded-sm border border-[#c8bfa9]"
          >
            {LANGUAGES.map((item) => {
              const selected = language === item.code;
              return (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => onChangeLanguage(item.code)}
                  className={`px-2.5 py-1 text-[11px] font-mono-tabular font-semibold rounded-[2px] transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    selected
                      ? 'bg-[#171614] text-[#faf7f0]'
                      : 'text-[#3f3b35] hover:text-[#171614]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={onToggleSound}
            title={soundEnabled ? t.soundOn : t.soundOff}
            aria-label={soundEnabled ? t.soundOn : t.soundOff}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-[#3f3b35] hover:text-[#171614] border border-[#c8bfa9] hover:border-[#171614] rounded-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {soundEnabled ? (
              <Volume2 className="w-3.5 h-3.5" aria-hidden="true" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 text-[#655f55]" aria-hidden="true" />
            )}
            <span className="hidden sm:inline">{soundEnabled ? t.soundOn : t.soundOff}</span>
          </button>
        </div>
      </div>

      {/* Compact Mobile Navigation Bar */}
      <nav
        aria-label="Mobile Navigation"
        className="flex md:hidden items-center justify-around border-b border-[#c8bfa9] bg-[#faf7f0] px-2"
      >
        {navItems.map((item) => {
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectView(item.id)}
              className={`py-2.5 px-2 text-xs font-medium whitespace-nowrap shrink-0 border-b-2 transition-colors ${
                isActive
                  ? 'border-[#b42318] text-[#171614] font-semibold'
                  : 'border-transparent text-[#655f55]'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
