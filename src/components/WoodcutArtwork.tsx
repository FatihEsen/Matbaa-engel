import { useState } from 'react';
import { Language, PhotoBlock } from '../types/puzzle';

interface WoodcutArtworkProps {
  photo: PhotoBlock;
  language: Language;
  className?: string;
}

function EngravingDefs({ idPrefix }: { idPrefix: string }) {
  return (
    <defs>
      <pattern
        id={`${idPrefix}-halftone`}
        width="6"
        height="6"
        patternUnits="userSpaceOnUse"
      >
        <circle cx="2" cy="2" r="0.8" fill="#1c1917" fillOpacity="0.14" />
      </pattern>
      <pattern
        id={`${idPrefix}-hatch`}
        width="5"
        height="5"
        patternUnits="userSpaceOnUse"
        patternTransform="rotate(35)"
      >
        <line
          x1="0"
          y1="0"
          x2="0"
          y2="5"
          stroke="#1c1917"
          strokeWidth="0.9"
          strokeOpacity="0.22"
        />
      </pattern>
    </defs>
  );
}

function TurkishCoffeeEngraving({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      role="img"
      aria-label="Türk kahvesi ve bakır cezve gravürü"
      className={`w-full h-full object-cover bg-[#f4efe4] ${className}`}
    >
      <EngravingDefs idPrefix="coffee" />
      <rect x="0" y="0" width="200" height="200" fill="#f3ede0" />
      <rect
        x="8"
        y="8"
        width="184"
        height="184"
        fill="url(#coffee-halftone)"
        stroke="#1c1917"
        strokeWidth="2.2"
      />
      <rect
        x="13"
        y="13"
        width="174"
        height="174"
        fill="none"
        stroke="#1c1917"
        strokeWidth="0.8"
      />

      <ellipse
        cx="100"
        cy="154"
        rx="74"
        ry="20"
        fill="#e6d8be"
        stroke="#1c1917"
        strokeWidth="2.2"
      />
      <ellipse
        cx="100"
        cy="154"
        rx="64"
        ry="14"
        fill="url(#coffee-hatch)"
        stroke="#1c1917"
        strokeWidth="1"
      />

      <path
        d="M114 78 C108 66, 122 58, 114 44 C109 36, 116 30, 119 25"
        fill="none"
        stroke="#1c1917"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M126 82 C121 71, 134 62, 128 50 C124 42, 130 35, 133 31"
        fill="none"
        stroke="#b42318"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M62 66 C56 54, 69 47, 63 36"
        fill="none"
        stroke="#1c1917"
        strokeWidth="1.6"
        strokeLinecap="round"
      />

      <path
        d="M44 146 L52 84 C54 78, 78 78, 80 84 L88 146 C86 154, 46 154, 44 146 Z"
        fill="#c97b4b"
        stroke="#1c1917"
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      <path
        d="M44 146 L52 84 C54 78, 78 78, 80 84 L88 146 C86 154, 46 154, 44 146 Z"
        fill="url(#coffee-hatch)"
      />
      <ellipse
        cx="66"
        cy="83"
        rx="14"
        ry="4.2"
        fill="#3a2318"
        stroke="#1c1917"
        strokeWidth="2"
      />
      <path d="M51 86 L24 68 L27 63 L54 81" fill="#1c1917" />
      <path
        d="M49 112 Q66 118 83 112"
        fill="none"
        stroke="#1c1917"
        strokeWidth="1.3"
      />
      <path
        d="M47 132 Q66 138 85 132"
        fill="none"
        stroke="#1c1917"
        strokeWidth="1.3"
      />

      <ellipse
        cx="126"
        cy="147"
        rx="30"
        ry="8"
        fill="#faf7f0"
        stroke="#1c1917"
        strokeWidth="2"
      />
      <path
        d="M104 104 L109 139 C112 146, 140 146, 143 139 L148 104 Z"
        fill="#faf7f0"
        stroke="#1c1917"
        strokeWidth="2.3"
        strokeLinejoin="round"
      />
      <path
        d="M126 116 C121 121, 121 131, 126 135 C131 131, 131 121, 126 116 Z"
        fill="#b42318"
        stroke="#1c1917"
        strokeWidth="1.2"
      />
      <path d="M108 111 L144 111" stroke="#1c1917" strokeWidth="1.2" />
      <path
        d="M147 112 C161 112, 161 132, 144 132"
        fill="none"
        stroke="#1c1917"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <ellipse
        cx="126"
        cy="104"
        rx="22"
        ry="5.5"
        fill="#432818"
        stroke="#1c1917"
        strokeWidth="2"
      />
      <ellipse
        cx="122"
        cy="104"
        rx="9"
        ry="2.2"
        fill="#d9b99b"
        fillOpacity="0.6"
      />

      <rect
        x="86"
        y="148"
        width="14"
        height="12"
        rx="1.5"
        fill="#d97757"
        stroke="#1c1917"
        strokeWidth="1.8"
      />
      <rect
        x="97"
        y="152"
        width="13"
        height="11"
        rx="1.5"
        fill="#e9c46a"
        stroke="#1c1917"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function BosphorusFerryEngraving({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      role="img"
      aria-label="Boğaziçi şehir hatları vapuru gravürü"
      className={`w-full h-full object-cover bg-[#f4efe4] ${className}`}
    >
      <EngravingDefs idPrefix="ferry" />
      <rect x="0" y="0" width="200" height="200" fill="#f3ede0" />
      <rect
        x="8"
        y="8"
        width="184"
        height="184"
        fill="url(#ferry-halftone)"
        stroke="#1c1917"
        strokeWidth="2.2"
      />
      <rect
        x="13"
        y="13"
        width="174"
        height="174"
        fill="none"
        stroke="#1c1917"
        strokeWidth="0.8"
      />

      {/* Sun & Seagulls */}
      <circle
        cx="46"
        cy="46"
        r="16"
        fill="#e9c46a"
        fillOpacity="0.65"
        stroke="#1c1917"
        strokeWidth="1.5"
      />
      <path
        d="M132 38 Q138 31 144 38 Q150 31 156 38"
        fill="none"
        stroke="#1c1917"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M154 52 Q159 46 164 52 Q169 46 174 52"
        fill="none"
        stroke="#1c1917"
        strokeWidth="1.6"
        strokeLinecap="round"
      />

      {/* Funnel smoke */}
      <path
        d="M100 58 C108 44, 124 44, 134 34"
        fill="none"
        stroke="#1c1917"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeDasharray="3 3"
      />

      {/* Ferry smokestack (chimney) */}
      <rect
        x="91"
        y="58"
        width="16"
        height="30"
        fill="#d97757"
        stroke="#1c1917"
        strokeWidth="2.2"
      />
      <rect x="91" y="64" width="16" height="6" fill="#1c1917" />
      <circle cx="99" cy="76" r="3" fill="#faf7f0" stroke="#1c1917" strokeWidth="1.2" />

      {/* Upper passenger deck */}
      <path
        d="M46 106 L54 86 L146 86 L154 106 Z"
        fill="#faf7f0"
        stroke="#1c1917"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      {/* Cabin windows */}
      {[60, 74, 88, 102, 116, 130].map((x) => (
        <rect
          key={x}
          x={x}
          y="91"
          width="9"
          height="9"
          fill="#1c1917"
          rx="1"
        />
      ))}

      {/* Main hull */}
      <path
        d="M26 106 L174 106 L158 136 L42 136 Z"
        fill="#1c1917"
        stroke="#1c1917"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <path
        d="M34 114 L166 114"
        stroke="#faf7f0"
        strokeWidth="2.2"
      />
      <path
        d="M39 126 L161 126"
        stroke="#b42318"
        strokeWidth="3"
      />

      {/* Engraved Bosphorus waves */}
      <path
        d="M16 140 Q32 133 48 140 T80 140 T112 140 T144 140 T184 140"
        fill="none"
        stroke="#1c1917"
        strokeWidth="2.2"
      />
      <path
        d="M22 153 Q38 146 54 153 T86 153 T118 153 T150 153 T178 153"
        fill="none"
        stroke="#1c1917"
        strokeWidth="1.8"
      />
      <path
        d="M30 165 Q46 159 62 165 T94 165 T126 165 T158 165"
        fill="none"
        stroke="#1c1917"
        strokeWidth="1.4"
      />
    </svg>
  );
}

function IznikTileEngraving({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      role="img"
      aria-label="Klasik İznik çinisi lale motifi gravürü"
      className={`w-full h-full object-cover bg-[#f4efe4] ${className}`}
    >
      <EngravingDefs idPrefix="iznik" />
      <rect x="0" y="0" width="200" height="200" fill="#f3ede0" />
      <rect
        x="8"
        y="8"
        width="184"
        height="184"
        fill="url(#iznik-halftone)"
        stroke="#1c1917"
        strokeWidth="2.2"
      />
      <rect
        x="16"
        y="16"
        width="168"
        height="168"
        fill="none"
        stroke="#1c1917"
        strokeWidth="1.2"
      />

      {/* Corner ceramic arabesques */}
      <path d="M16 38 A22 22 0 0 0 38 16" fill="none" stroke="#1e3a8a" strokeWidth="2.2" />
      <path d="M162 16 A22 22 0 0 0 184 38" fill="none" stroke="#1e3a8a" strokeWidth="2.2" />
      <path d="M16 162 A22 22 0 0 1 38 184" fill="none" stroke="#1e3a8a" strokeWidth="2.2" />
      <path d="M162 184 A22 22 0 0 1 184 162" fill="none" stroke="#1e3a8a" strokeWidth="2.2" />

      {/* Outer Cobalt Medallion */}
      <circle
        cx="100"
        cy="100"
        r="58"
        fill="#faf7f0"
        stroke="#1e3a8a"
        strokeWidth="3"
      />
      <circle
        cx="100"
        cy="100"
        r="52"
        fill="url(#iznik-hatch)"
        stroke="#1c1917"
        strokeWidth="1"
      />

      {/* Stem & Saz style leaves */}
      <path
        d="M100 152 L100 88"
        stroke="#1c1917"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M100 144 C72 138, 58 112, 68 84 C74 104, 86 122, 100 132"
        fill="#2a6f62"
        stroke="#1c1917"
        strokeWidth="1.8"
      />
      <path
        d="M100 144 C128 138, 142 112, 132 84 C126 104, 114 122, 100 132"
        fill="#2a6f62"
        stroke="#1c1917"
        strokeWidth="1.8"
      />

      {/* Central Ottoman Crimson Tulip */}
      <path
        d="M100 44 C91 62, 86 78, 100 96 C114 78, 109 62, 100 44 Z"
        fill="#b42318"
        stroke="#1c1917"
        strokeWidth="2"
      />
      <path
        d="M100 96 C80 90, 74 68, 84 50 C83 68, 90 80, 100 88"
        fill="#d97757"
        stroke="#1c1917"
        strokeWidth="1.8"
      />
      <path
        d="M100 96 C120 90, 126 68, 116 50 C117 68, 110 80, 100 88"
        fill="#d97757"
        stroke="#1c1917"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function AnatolianBaglamaEngraving({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      role="img"
      aria-label="Anadolu bağlaması (saz) gravürü"
      className={`w-full h-full object-cover bg-[#f4efe4] ${className}`}
    >
      <EngravingDefs idPrefix="baglama" />
      <rect x="0" y="0" width="200" height="200" fill="#f3ede0" />
      <rect
        x="8"
        y="8"
        width="184"
        height="184"
        fill="url(#baglama-halftone)"
        stroke="#1c1917"
        strokeWidth="2.2"
      />
      <rect
        x="13"
        y="13"
        width="174"
        height="174"
        fill="none"
        stroke="#1c1917"
        strokeWidth="0.8"
      />

      {/* Decorative Anatolian kilim star motifs */}
      <polygon
        points="46,42 52,36 58,42 52,48"
        fill="#b42318"
        stroke="#1c1917"
        strokeWidth="1.4"
      />
      <polygon
        points="146,136 152,130 158,136 152,142"
        fill="#b42318"
        stroke="#1c1917"
        strokeWidth="1.4"
      />

      {/* Long neck (sap) running diagonally */}
      <path
        d="M84 106 L156 34 L164 42 L92 114 Z"
        fill="#e6d8be"
        stroke="#1c1917"
        strokeWidth="2.2"
      />
      {/* Tuning pegs (burgular) */}
      <line x1="148" y1="38" x2="140" y2="28" stroke="#1c1917" strokeWidth="2.2" strokeLinecap="round" />
      <line x1="155" y1="31" x2="147" y2="21" stroke="#1c1917" strokeWidth="2.2" strokeLinecap="round" />
      <line x1="162" y1="45" x2="172" y2="53" stroke="#1c1917" strokeWidth="2.2" strokeLinecap="round" />

      {/* Pear-shaped resonant bowl (tekne) */}
      <path
        d="M94 102 C114 118, 108 152, 82 164 C56 174, 32 154, 42 126 C50 104, 76 92, 94 102 Z"
        fill="#c97b4b"
        stroke="#1c1917"
        strokeWidth="2.5"
      />
      <path
        d="M94 102 C114 118, 108 152, 82 164 C56 174, 32 154, 42 126 C50 104, 76 92, 94 102 Z"
        fill="url(#baglama-hatch)"
      />
      {/* Soundboard rosette & bridge */}
      <circle
        cx="72"
        cy="132"
        r="11"
        fill="#3a2318"
        stroke="#1c1917"
        strokeWidth="1.8"
      />
      <line x1="52" y1="142" x2="66" y2="156" stroke="#1c1917" strokeWidth="2.5" />
      {/* Strings */}
      <line x1="59" y1="149" x2="158" y2="39" stroke="#1c1917" strokeWidth="1.1" />
    </svg>
  );
}

function OttomanAstrolabeEngraving({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      role="img"
      aria-label="Tarihi astronomi usturlabı gravürü"
      className={`w-full h-full object-cover bg-[#f4efe4] ${className}`}
    >
      <EngravingDefs idPrefix="astro" />
      <rect x="0" y="0" width="200" height="200" fill="#f3ede0" />
      <rect
        x="8"
        y="8"
        width="184"
        height="184"
        fill="url(#astro-halftone)"
        stroke="#1c1917"
        strokeWidth="2.2"
      />
      <rect
        x="13"
        y="13"
        width="174"
        height="174"
        fill="none"
        stroke="#1c1917"
        strokeWidth="0.8"
      />

      {/* Suspension ring (kürsü) */}
      <circle
        cx="100"
        cy="30"
        r="9"
        fill="none"
        stroke="#1c1917"
        strokeWidth="2.4"
      />
      <path
        d="M88 46 L100 36 L112 46 Z"
        fill="#d4a359"
        stroke="#1c1917"
        strokeWidth="2"
      />

      {/* Brass Astrolabe Body */}
      <circle
        cx="100"
        cy="106"
        r="58"
        fill="#e9c46a"
        stroke="#1c1917"
        strokeWidth="2.6"
      />
      <circle
        cx="100"
        cy="106"
        r="49"
        fill="#faf7f0"
        stroke="#1c1917"
        strokeWidth="1.8"
      />
      <circle
        cx="100"
        cy="106"
        r="34"
        fill="url(#astro-hatch)"
        stroke="#1c1917"
        strokeWidth="1.3"
      />
      <circle
        cx="100"
        cy="94"
        r="22"
        fill="none"
        stroke="#1c1917"
        strokeWidth="1.4"
      />

      {/* Celestial meridian crosshairs */}
      <line x1="51" y1="106" x2="149" y2="106" stroke="#1c1917" strokeWidth="1.2" />
      <line x1="100" y1="57" x2="100" y2="155" stroke="#1c1917" strokeWidth="1.2" />

      {/* Rotating Alidade Pointer */}
      <line
        x1="58"
        y1="136"
        x2="142"
        y2="76"
        stroke="#b42318"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <circle
        cx="100"
        cy="106"
        r="5"
        fill="#b42318"
        stroke="#1c1917"
        strokeWidth="1.8"
      />
    </svg>
  );
}

export function WoodcutArtwork({ photo, language, className = '' }: WoodcutArtworkProps) {
  const [imgFailed, setImgFailed] = useState(false);

  switch (photo.svgId) {
    case 'turkish-coffee':
      return <TurkishCoffeeEngraving className={className} />;
    case 'bosphorus-ferry':
      return <BosphorusFerryEngraving className={className} />;
    case 'iznik-tile':
      return <IznikTileEngraving className={className} />;
    case 'anatolian-baglama':
      return <AnatolianBaglamaEngraving className={className} />;
    case 'ottoman-astrolabe':
      return <OttomanAstrolabeEngraving className={className} />;
  }

  if (!photo.imageUrl || imgFailed) {
    return (
      <div
        className={`w-full h-full flex flex-col items-center justify-center bg-[#ece5d5] text-[#1c1917] p-2 text-center border border-[#1c1917]/20 ${className}`}
      >
        <svg viewBox="0 0 48 48" className="w-10 h-10 mb-1 opacity-75" aria-hidden="true">
          <rect x="4" y="4" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="2" />
          <path
            d="M12 34 L20 22 L27 29 L33 19 L38 34 Z"
            fill="currentColor"
            fillOpacity="0.2"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <circle cx="17" cy="15" r="3" fill="currentColor" />
        </svg>
        <span className="font-editorial text-[11px] font-semibold leading-tight">
          {photo.captionTr}
        </span>
      </div>
    );
  }

  return (
    <img
      src={photo.imageUrl}
      alt={photo.alt?.[language] || photo.captionTr}
      referrerPolicy="no-referrer"
      onError={() => setImgFailed(true)}
      className={`w-full h-full object-cover select-none ${className}`}
    />
  );
}
