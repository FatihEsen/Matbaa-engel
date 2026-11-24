export const TURKISH_ALPHABET = new Set([
  'A', 'B', 'C', 'Ç', 'D', 'E', 'F', 'G', 'Ğ', 'H',
  'I', 'İ', 'J', 'K', 'L', 'M', 'N', 'O', 'Ö', 'P',
  'R', 'S', 'Ş', 'T', 'U', 'Ü', 'V', 'Y', 'Z',
]);

/**
 * Converts a single character or string to authentic Turkish uppercase.
 * Specifically guarantees `i -> İ` and `ı -> I` regardless of browser locale.
 */
export function toTurkishUpper(input: string): string {
  let result = '';
  for (const ch of input) {
    if (ch === 'i' || ch === 'İ') {
      result += 'İ';
    } else if (ch === 'ı' || ch === 'I') {
      result += 'I';
    } else if (ch === 'ç' || ch === 'Ç') {
      result += 'Ç';
    } else if (ch === 'ğ' || ch === 'Ğ') {
      result += 'Ğ';
    } else if (ch === 'ö' || ch === 'Ö') {
      result += 'Ö';
    } else if (ch === 'ş' || ch === 'Ş') {
      result += 'Ş';
    } else if (ch === 'ü' || ch === 'Ü') {
      result += 'Ü';
    } else {
      result += ch.toLocaleUpperCase('tr-TR');
    }
  }
  return result;
}

export function isTurkishLetter(ch: string): boolean {
  if (!ch || ch.length !== 1) return false;
  return TURKISH_ALPHABET.has(toTurkishUpper(ch));
}

export const TURKISH_KEYBOARD_ROWS: string[][] = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'Ğ', 'Ü'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ş', 'İ'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M', 'Ö', 'Ç'],
];

/**
 * Splits a Turkish uppercase word into individual characters cleanly.
 */
export function splitTurkishChars(word: string): string[] {
  return Array.from(toTurkishUpper(word));
}

export function formatDuration(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const mins = Math.floor(safe / 60);
  const secs = safe % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}
