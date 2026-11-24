import { ArrowLeftRight, Delete, Keyboard } from 'lucide-react';
import { TranslationBundle } from '../i18n/translations';
import { TURKISH_KEYBOARD_ROWS } from '../utils/turkish';

interface TurkishKeyboardProps {
  t: TranslationBundle;
  visible: boolean;
  onToggleVisible: () => void;
  onKeyInput: (char: string) => void;
  onBackspace: () => void;
  onFlipDirection: () => void;
  disabled?: boolean;
}

export function TurkishKeyboard({
  t,
  visible,
  onToggleVisible,
  onKeyInput,
  onBackspace,
  onFlipDirection,
  disabled = false,
}: TurkishKeyboardProps) {
  return (
    <section className="no-print mt-4">
      <div className="flex items-center justify-between mb-2">
        <button
          type="button"
          onClick={onToggleVisible}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#3f3b35] hover:text-[#171614] transition-colors cursor-pointer"
        >
          <Keyboard className="w-4 h-4" aria-hidden="true" />
          <span>{visible ? t.keyboardToggleHide : t.keyboardToggleShow}</span>
        </button>
        <span className="text-[11px] font-mono-tabular text-[#655f55]">
          TR-Q · Ç Ğ İ Ö Ş Ü
        </span>
      </div>

      {visible && (
        <div className="bg-[#e8e1d1] border border-[#1c1917] p-2 sm:p-3 space-y-1.5">
          {TURKISH_KEYBOARD_ROWS.map((row, rowIndex) => (
            <div key={rowIndex} className="flex items-center justify-center gap-1 sm:gap-1.5">
              {rowIndex === 2 && (
                <button
                  type="button"
                  disabled={disabled}
                  onClick={onFlipDirection}
                  title={t.flipDirection}
                  className="h-10 sm:h-11 px-2 sm:px-3 inline-flex items-center justify-center gap-1 bg-[#d8cfbc] hover:bg-[#ccc1aa] active:translate-y-[1px] text-[#171614] border border-[#1c1917]/60 rounded-[2px] text-[11px] font-semibold transition-all cursor-pointer disabled:opacity-50 whitespace-nowrap shrink-0"
                >
                  <ArrowLeftRight className="w-3.5 h-3.5" aria-hidden="true" />
                  <span className="hidden sm:inline">{t.directionShort}</span>
                </button>
              )}

              {row.map((letter) => {
                const isTurkishSpecial = 'ÇĞİÖŞÜ'.includes(letter);
                return (
                  <button
                    key={letter}
                    type="button"
                    disabled={disabled}
                    onClick={() => onKeyInput(letter)}
                    className={`flex-1 max-w-[44px] h-10 sm:h-11 inline-flex items-center justify-center font-sans-grid font-bold text-sm sm:text-base rounded-[2px] border transition-all active:translate-y-[1px] cursor-pointer disabled:opacity-50 ${
                      isTurkishSpecial
                        ? 'bg-[#faf7f0] hover:bg-[#fef3c7] text-[#b42318] border-[#1c1917]'
                        : 'bg-[#faf7f0] hover:bg-[#fef3c7] text-[#171614] border-[#1c1917]/70'
                    }`}
                  >
                    {letter}
                  </button>
                );
              })}

              {rowIndex === 2 && (
                <button
                  type="button"
                  disabled={disabled}
                  onClick={onBackspace}
                  title={t.backspace}
                  aria-label={t.backspace}
                  className="h-10 sm:h-11 px-2.5 sm:px-3.5 inline-flex items-center justify-center gap-1 bg-[#171614] hover:bg-[#3f3b35] active:translate-y-[1px] text-[#faf7f0] border border-[#171614] rounded-[2px] text-xs font-semibold transition-all cursor-pointer disabled:opacity-50 whitespace-nowrap shrink-0"
                >
                  <Delete className="w-4 h-4" aria-hidden="true" />
                  <span className="hidden sm:inline">{t.backspace}</span>
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
