import { ArrowType } from '../types/puzzle';

interface ClueArrowSvgProps {
  arrow: ArrowType;
  accent?: boolean;
  size?: number;
}

/**
 * Crisp directional arrow glyphs styled after classic Turkish newspaper çengel bulmacas.
 */
export function ClueArrowSvg({ arrow, accent = false, size = 14 }: ClueArrowSvgProps) {
  const stroke = accent ? '#b42318' : '#171614';

  switch (arrow) {
    case 'right':
      return (
        <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path
            d="M2.5 8H13M13 8L9.2 4.5M13 8L9.2 11.5"
            stroke={stroke}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 'down':
      return (
        <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path
            d="M8 2.5V13M8 13L4.5 9.2M8 13L11.5 9.2"
            stroke={stroke}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 'right-down':
      return (
        <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path
            d="M2.5 4.5H9.5C10.6 4.5 11.5 5.4 11.5 6.5V13M11.5 13L8.5 10M11.5 13L14.5 10"
            stroke={stroke}
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 'down-right':
      return (
        <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path
            d="M4.5 2.5V9.5C4.5 10.6 5.4 11.5 6.5 11.5H13M13 11.5L10 8.5M13 11.5L10 14.5"
            stroke={stroke}
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 'up-right':
      return (
        <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path
            d="M4.5 13.5V6.5C4.5 5.4 5.4 4.5 6.5 4.5H13M13 4.5L10 1.5M13 4.5L10 7.5"
            stroke={stroke}
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 'left-down':
      return (
        <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path
            d="M13.5 4.5H6.5C5.4 4.5 4.5 5.4 4.5 6.5V13M4.5 13L1.5 10M4.5 13L7.5 10"
            stroke={stroke}
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
  }
}
