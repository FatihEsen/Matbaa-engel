import {
  EngravingSvgId,
  LexiconEntry,
  LocalizedText,
  PuzzleCategory,
} from '../types/puzzle';
import { isTurkishLetter, splitTurkishChars, toTurkishUpper } from '../utils/turkish';
import { LONG_LEXICON } from './lexiconLong';
import { MEDIUM_LEXICON } from './lexiconMedium';
import { SHORT_LEXICON } from './lexiconShort';
import { PUZZLES } from './puzzles';

export interface PhotoClueTheme {
  id: string;
  category: Exclude<PuzzleCategory, 'all'>;
  imageUrl?: string;
  svgId?: EngravingSvgId;
  captionTr: string;
  alt: LocalizedText;
  /**
   * Candidate words mapped by character length (4, 5, 6) so the generator can
   * pick a matching photo answer for any template slot length.
   */
  wordsByLength: Record<number, LexiconEntry>;
}

export const PHOTO_CLUE_THEMES: PhotoClueTheme[] = [
  {
    id: 'galata-tower',
    category: 'cografya',
    imageUrl: '/src/assets/images/clue_galata_kulesi_1795091804084.jpg',
    captionTr: 'Tarihi kule',
    alt: {
      tr: 'İstanbul Haliç ve Boğaz silüetinin tarihi gözetleme yapısı',
      en: 'Historic watchtower dominating the Istanbul skyline',
      de: 'Historischer Wachturm der Istanbuler Skyline',
      fr: 'Tour de guet historique dominant Istanbul',
    },
    wordsByLength: {
      4: {
        answer: 'KULE',
        category: 'cografya',
        difficulty: 'easy',
        clueTr: 'Gözetleme',
        clueFullTr: 'Görseldeki tarihi Galata yapısı türü, yüksek gözetleme binası.',
        gloss: { en: 'Tower', de: 'Turm', fr: 'Tour' },
      },
      5: {
        answer: 'HALİÇ',
        category: 'cografya',
        difficulty: 'medium',
        clueTr: 'Altın Boynuz',
        clueFullTr: 'Görseldeki Galata Kulesi’nin kıyısında yükseldiği İstanbul koyu.',
        gloss: { en: 'Golden Horn', de: 'Goldenes Horn', fr: 'Corne d’Or' },
      },
      6: {
        answer: 'GALATA',
        category: 'cografya',
        difficulty: 'easy',
        clueTr: 'Tarihi kule',
        clueFullTr: 'Görseldeki tarihi İstanbul kulesine adını veren semt.',
        gloss: { en: 'Galata Tower district', de: 'Galata-Viertel', fr: 'Quartier de Galata' },
      },
    },
  },
  {
    id: 'turkish-coffee',
    category: 'mutfak',
    svgId: 'turkish-coffee',
    captionTr: 'Kırk yıl hatır',
    alt: {
      tr: 'Bakır cezvede ağır ateşte pişirilen köpüklü geleneksel ikram',
      en: 'Traditional foamy brew cooked slowly in a copper cezve',
      de: 'Traditionelles schaumiges Getränk aus der Kupfer-Cezve',
      fr: 'Boisson traditionnelle mousseuse préparée dans un cezve en cuivre',
    },
    wordsByLength: {
      4: {
        answer: 'KUPA',
        category: 'mutfak',
        difficulty: 'easy',
        clueTr: 'İçecek kabı',
        clueFullTr: 'Görseldeki sıcak kahve ve çay ikramlarında kullanılan kulplu porselen kap.',
        gloss: { en: 'Mug / Cup', de: 'Tasse', fr: 'Tasse' },
      },
      5: {
        answer: 'KAHVE',
        category: 'mutfak',
        difficulty: 'easy',
        clueTr: 'Cezve içeceği',
        clueFullTr: 'Görseldeki bakır cezvede pişirilen geleneksel köpüklü içecek.',
        gloss: { en: 'Turkish coffee', de: 'Türkischer Kaffee', fr: 'Café turc' },
      },
      6: {
        answer: 'FİNCAN',
        category: 'mutfak',
        difficulty: 'easy',
        clueTr: 'Kahve kabı',
        clueFullTr: 'Görseldeki Türk kahvesinin ikram edildiği küçük porselen kap.',
        gloss: { en: 'Coffee cup', de: 'Kaffeetasse', fr: 'Tasse à café' },
      },
    },
  },
  {
    id: 'trojan-horse',
    category: 'tarih',
    imageUrl: '/src/assets/images/clue_truva_ati_1795091644789.jpg',
    captionTr: 'İlyada destanı',
    alt: {
      tr: 'Homeros’un İlyada destanında geçen Çanakkale antik kenti',
      en: 'Ancient Anatolian city featured in Homer’s Iliad',
      de: 'Antike anatolische Stadt aus Homers Ilias',
      fr: 'Cité antique d’Anatolie célèbre par l’Iliade d’Homère',
    },
    wordsByLength: {
      4: {
        answer: 'ANIT',
        category: 'tarih',
        difficulty: 'easy',
        clueTr: 'Tarihi eser',
        clueFullTr: 'Görseldeki gibi tarihsel bir olayı simgeleyen abide.',
        gloss: { en: 'Monument', de: 'Denkmal', fr: 'Monument' },
      },
      5: {
        answer: 'TRUVA',
        category: 'tarih',
        difficulty: 'medium',
        clueTr: 'Antik kent',
        clueFullTr: 'Görseldeki tahta at efsanesiyle ünlü Çanakkale antik kenti.',
        gloss: { en: 'Troy', de: 'Troja', fr: 'Troie' },
      },
      6: {
        answer: 'EFSANE',
        category: 'tarih',
        difficulty: 'medium',
        clueTr: 'Mitolojik öykü',
        clueFullTr: 'Görseldeki Truva Atı gibi kuşaktan kuşağa anlatılan destansı söylence.',
        gloss: { en: 'Legend', de: 'Legende', fr: 'Légende' },
      },
    },
  },
  {
    id: 'cappadocia-balloon',
    category: 'cografya',
    imageUrl: '/src/assets/images/clue_kapadokya_balon_1795091694305.jpg',
    captionTr: 'Peribacaları',
    alt: {
      tr: 'Kapadokya peribacaları ve sıcak hava balonlarıyla ünlü vadi',
      en: 'Cappadocia valley famous for fairy chimneys and hot-air balloons',
      de: 'Kappadokisches Tal, berühmt für Feenkamine und Heißluftballons',
      fr: 'Vallée de Cappadoce célèbre pour ses cheminées de fées',
    },
    wordsByLength: {
      4: {
        answer: 'VADİ',
        category: 'cografya',
        difficulty: 'easy',
        clueTr: 'Peribacası yatağı',
        clueFullTr: 'Görseldeki peribacalarının yükseldiği derin coğrafi çukur alan.',
        gloss: { en: 'Valley', de: 'Tal', fr: 'Vallée' },
      },
      5: {
        answer: 'BALON',
        category: 'cografya',
        difficulty: 'easy',
        clueTr: 'Kapadokya',
        clueFullTr: 'Görselde peribacaları üzerinde süzülen sıcak hava taşıtı.',
        gloss: { en: 'Hot-air balloon', de: 'Heißluftballon', fr: 'Montgolfière' },
      },
      6: {
        answer: 'GÖREME',
        category: 'cografya',
        difficulty: 'medium',
        clueTr: 'Kapadokya',
        clueFullTr: 'Görseldeki peribacaları ve açık hava müzesiyle ünlü Nevşehir beldesi.',
        gloss: { en: 'Göreme (Cappadocia)', de: 'Göreme (Kappadokien)', fr: 'Göreme (Cappadoce)' },
      },
    },
  },
  {
    id: 'bosphorus-ferry',
    category: 'cografya',
    svgId: 'bosphorus-ferry',
    captionTr: 'Boğaz vapuru',
    alt: {
      tr: 'İki kıtayı birbirine bağlayan Boğaziçi’nin emektar deniz taşıtı',
      en: 'Classic Bosphorus steamship connecting two continents',
      de: 'Klassisches Bosporus-Dampfschiff zwischen zwei Kontinenten',
      fr: 'Bateau traditionnel du Bosphore reliant deux continents',
    },
    wordsByLength: {
      4: {
        answer: 'GEMİ',
        category: 'cografya',
        difficulty: 'easy',
        clueTr: 'Deniz taşıtı',
        clueFullTr: 'Görseldeki gibi Boğaz sularında yolcu taşıyan büyük tekne.',
        gloss: { en: 'Ship', de: 'Schiff', fr: 'Navire' },
      },
      5: {
        answer: 'VAPUR',
        category: 'cografya',
        difficulty: 'easy',
        clueTr: 'Boğaz gemisi',
        clueFullTr: 'Görseldeki martılar eşliğinde Boğaz’da süzülen şehir hatları gemisi.',
        gloss: { en: 'Ferryboat', de: 'Fähre', fr: 'Ferry-boat' },
      },
      6: {
        answer: 'İSKELE',
        category: 'cografya',
        difficulty: 'medium',
        clueTr: 'Vapur durağı',
        clueFullTr: 'Görseldeki Boğaz vapurlarının yolcu alıp indirdiği kıyı yapısı.',
        gloss: { en: 'Pier / Quay', de: 'Anlegestelle', fr: 'Embarcadère' },
      },
    },
  },
  {
    id: 'iznik-tile',
    category: 'kultur',
    svgId: 'iznik-tile',
    captionTr: 'Klasik çini',
    alt: {
      tr: 'Klasik dönem Osmanlı mimarisini süsleyen lale ve karanfil motifli seramik',
      en: 'Ottoman glazed ceramic tile with tulip and carnation motifs',
      de: 'Osmanische Keramikfliese mit Tulpen- und Nelkenmotiven',
      fr: 'Céramique ottomane ornée de tulipes et d’œillets',
    },
    wordsByLength: {
      4: {
        answer: 'ÇİNİ',
        category: 'kultur',
        difficulty: 'easy',
        clueTr: 'Sırlı seramik',
        clueFullTr: 'Görseldeki lale motifli geleneksel Türk duvar seramiği sanatı.',
        gloss: { en: 'Ceramic tile art', de: 'Fliesenkunst', fr: 'Faïence turque' },
      },
      5: {
        answer: 'İZNİK',
        category: 'kultur',
        difficulty: 'medium',
        clueTr: 'Çini merkezi',
        clueFullTr: 'Görseldeki dünyaca ünlü Osmanlı çinilerinin üretildiği Bursa ilçesi.',
        gloss: { en: 'İznik (ceramic center)', de: 'İznik (Keramikstadt)', fr: 'İznik (ville de faïence)' },
      },
      6: {
        answer: 'TEZHİP',
        category: 'kultur',
        difficulty: 'hard',
        clueTr: 'Süsleme sanatı',
        clueFullTr: 'Görseldeki motiflerle akraba olan geleneksel altın yaldızlı bezeme sanatı.',
        gloss: { en: 'Illumination art', de: 'Buchmalerei', fr: 'Enluminure' },
      },
    },
  },
  {
    id: 'anatolian-baglama',
    category: 'kultur',
    svgId: 'anatolian-baglama',
    captionTr: 'Anadolu sazı',
    alt: {
      tr: 'Anadolu âşıklarının ve halk müziğinin telli tezeneli baş sazı',
      en: 'Traditional Anatolian long-necked folk lute (bağlama)',
      de: 'Traditionelle anatolische Langhalslaute (Bağlama)',
      fr: 'Luth traditionnel anatolien à manche long (bağlama)',
    },
    wordsByLength: {
      4: {
        answer: 'OZAN',
        category: 'kultur',
        difficulty: 'easy',
        clueTr: 'Halk şairi',
        clueFullTr: 'Görseldeki bağlamayı çalıp deyişler söyleyen Anadolu halk şairi.',
        gloss: { en: 'Bard / Poet', de: 'Barde', fr: 'Barde' },
      },
      5: {
        answer: 'TÜRKÜ',
        category: 'kultur',
        difficulty: 'easy',
        clueTr: 'Halk ezgisi',
        clueFullTr: 'Görseldeki bağlama eşliğinde söylenen geleneksel Anadolu ezgisi.',
        gloss: { en: 'Folk song', de: 'Volkslied', fr: 'Chant populaire' },
      },
      6: {
        answer: 'MIZRAP',
        category: 'kultur',
        difficulty: 'medium',
        clueTr: 'Saz tezene',
        clueFullTr: 'Görseldeki telli sazı çalmak için kullanılan küçük esnek pena, tezene.',
        gloss: { en: 'Plectrum', de: 'Plektrum', fr: 'Plectre' },
      },
    },
  },
  {
    id: 'ottoman-astrolabe',
    category: 'bilim',
    svgId: 'ottoman-astrolabe',
    captionTr: 'Gökbilim aleti',
    alt: {
      tr: 'Gök cisimlerinin yüksekliğini ve zamanı ölçen tarihi astronomi aleti',
      en: 'Historical astronomical instrument measuring celestial altitude',
      de: 'Historisches astronomisches Messinstrument (Astrolabium)',
      fr: 'Instrument astronomique historique mesurant les astres',
    },
    wordsByLength: {
      4: {
        answer: 'UZAY',
        category: 'bilim',
        difficulty: 'easy',
        clueTr: 'Gök boşluğu',
        clueFullTr: 'Görseldeki usturlap ile incelenen yıldızların ve gezegenlerin bulunduğu sonsuzluk.',
        gloss: { en: 'Space / Cosmos', de: 'Weltraum', fr: 'Espace' },
      },
      5: {
        answer: 'GÜNEŞ',
        category: 'bilim',
        difficulty: 'easy',
        clueTr: 'Isı yıldızı',
        clueFullTr: 'Görseldeki astronomi aletiyle yüksekliği ölçülen sistemimizin merkez yıldızı.',
        gloss: { en: 'Sun', de: 'Sonne', fr: 'Soleil' },
      },
      6: {
        answer: 'MERCEK',
        category: 'bilim',
        difficulty: 'medium',
        clueTr: 'Optik cam',
        clueFullTr: 'Görseldeki gökbilim araçlarında ışığı kırarak görüntüyü büyüten saydam cam.',
        gloss: { en: 'Optical lens', de: 'Linse', fr: 'Lentille optique' },
      },
    },
  },
];

function buildSanitizedLexicon(): LexiconEntry[] {
  const map = new Map<string, LexiconEntry>();

  const register = (raw: LexiconEntry) => {
    const normalizedAnswer = toTurkishUpper(raw.answer.trim());
    const chars = splitTurkishChars(normalizedAnswer);
    if (chars.length < 2 || chars.length > 7) return;
    if (!chars.every((ch) => isTurkishLetter(ch))) return;

    const existing = map.get(normalizedAnswer);
    if (existing && existing.category !== 'genel' && raw.category === 'genel') {
      return;
    }

    map.set(normalizedAnswer, {
      answer: normalizedAnswer,
      category: raw.category,
      difficulty: raw.difficulty,
      clueTr: raw.clueTr.trim(),
      clueFullTr: raw.clueFullTr.trim(),
      gloss: raw.gloss,
    });
  };

  for (const item of SHORT_LEXICON) register(item);
  for (const item of MEDIUM_LEXICON) register(item);
  for (const item of LONG_LEXICON) register(item);

  for (const puzzle of PUZZLES) {
    const cat = puzzle.category && puzzle.category !== 'all' ? puzzle.category : 'genel';
    for (const w of puzzle.words) {
      register({
        answer: w.answer,
        category: cat,
        difficulty: puzzle.difficulty,
        clueTr: w.clueTr,
        clueFullTr: w.clueFullTr,
        gloss: w.gloss,
      });
    }
  }

  for (const theme of PHOTO_CLUE_THEMES) {
    for (const entry of Object.values(theme.wordsByLength)) {
      register(entry);
    }
  }

  return Array.from(map.values());
}

export const TURKISH_LEXICON: LexiconEntry[] = buildSanitizedLexicon();

export const LEXICON_BY_LENGTH: Record<number, LexiconEntry[]> = (() => {
  const byLen: Record<number, LexiconEntry[]> = { 2: [], 3: [], 4: [], 5: [], 6: [], 7: [] };
  for (const entry of TURKISH_LEXICON) {
    const len = splitTurkishChars(entry.answer).length;
    if (!byLen[len]) {
      byLen[len] = [];
    }
    byLen[len].push(entry);
  }
  return byLen;
})();

export interface LexiconStats {
  total: number;
  byCategory: Record<Exclude<PuzzleCategory, 'all'>, number>;
  byLength: Record<number, number>;
}

export function getLexiconStats(): LexiconStats {
  const byCategory: Record<Exclude<PuzzleCategory, 'all'>, number> = {
    tarih: 0,
    cografya: 0,
    mutfak: 0,
    bilim: 0,
    kultur: 0,
    genel: 0,
  };
  const byLength: Record<number, number> = {};

  for (const entry of TURKISH_LEXICON) {
    const len = splitTurkishChars(entry.answer).length;
    byCategory[entry.category] = (byCategory[entry.category] ?? 0) + 1;
    byLength[len] = (byLength[len] ?? 0) + 1;
  }

  return {
    total: TURKISH_LEXICON.length,
    byCategory,
    byLength,
  };
}
