import { Difficulty, GridSize, Language, PuzzleCategory } from '../types/puzzle';

export interface TranslationBundle {
  appName: string;
  navPlay: string;
  navArchive: string;
  navStats: string;
  navGuide: string;
  actionPrint: string;
  editionLabel: string;
  wordsCount: string;
  languageLabel: string;
  soundOn: string;
  soundOff: string;
  difficulty: Record<Difficulty, string>;
  across: string;
  down: string;
  photoClue: string;
  lettersUnit: string;
  prevClue: string;
  nextClue: string;
  flipDirection: string;
  showGloss: string;
  hideGloss: string;
  timerLabel: string;
  scoreLabel: string;
  streakLabel: string;
  progressLabel: string;
  pause: string;
  resume: string;
  pausedBanner: string;
  toolsHeading: string;
  revealLetter: string;
  revealWord: string;
  checkWord: string;
  checkBoard: string;
  autoCheck: string;
  resetPuzzle: string;
  confirmReset: string;
  cancel: string;
  keyboardToggleShow: string;
  keyboardToggleHide: string;
  backspace: string;
  directionShort: string;
  intersectingClue: string;
  editionsHeading: string;
  solvedBadge: string;
  inProgressBadge: string;
  notStartedBadge: string;
  openEdition: string;
  resumeEdition: string;
  reviewEdition: string;
  archiveTitle: string;
  archiveSubtitle: string;
  statsTitle: string;
  statsSubtitle: string;
  statsSolved: string;
  statsCurrentStreak: string;
  statsBestStreak: string;
  statsTotalScore: string;
  statsHintsUsed: string;
  statsEditionLedger: string;
  statsEditionCol: string;
  statsDifficultyCol: string;
  statsStatusCol: string;
  statsTimeCol: string;
  statsScoreCol: string;
  guideTitle: string;
  guideSubtitle: string;
  guideArrowsTitle: string;
  guideArrowsDesc: string;
  guideSplitTitle: string;
  guideSplitDesc: string;
  guidePhotoTitle: string;
  guidePhotoDesc: string;
  guideKeysTitle: string;
  guideKeysDesc: string;
  guideStartPlaying: string;
  victoryKicker: string;
  victoryTitle: string;
  victorySubtitle: string;
  victoryTime: string;
  victoryScore: string;
  victoryHints: string;
  victoryStreak: string;
  victoryNextEdition: string;
  victoryBackToBoard: string;
  printModalTitle: string;
  printModalDesc: string;
  printBlank: string;
  printBlankDesc: string;
  printProgress: string;
  printProgressDesc: string;
  printSolution: string;
  printSolutionDesc: string;
  printConfirm: string;
  printSheetFooter: string;
  toastBoardClean: string;
  toastErrorsFound: string;
  toastWordCorrect: string;
  toastWordHasErrors: string;
  generatorButton: string;
  dailyButton: string;
  generatorTitle: string;
  generatorSubtitle: string;
  generatorCategoryLabel: string;
  generatorSizeLabel: string;
  generatorDifficultyLabel: string;
  generatorCreateBtn: string;
  generatorDailyQuickBtn: string;
  lexiconSummaryLabel: string;
  categories: Record<PuzzleCategory, string>;
  gridSizes: Record<GridSize, string>;
  archiveDailyHeading: string;
  archiveGeneratedHeading: string;
  archiveCuratedHeading: string;
}

export const TRANSLATIONS: Record<Language, TranslationBundle> = {
  tr: {
    appName: 'Matbaa Çengel',
    navPlay: 'Bulmaca',
    navArchive: 'Arşiv',
    navStats: 'İstatistikler',
    navGuide: 'Nasıl Oynanır',
    actionPrint: 'Yazdır',
    editionLabel: 'Sayı',
    wordsCount: 'Kelime',
    languageLabel: 'Dil',
    soundOn: 'Ses Açık',
    soundOff: 'Sessiz',
    difficulty: {
      easy: 'Kolay',
      medium: 'Orta',
      hard: 'Zor',
      master: 'Usta',
    },
    across: 'Soldan Sağa',
    down: 'Yukarıdan Aşağıya',
    photoClue: 'Resimli İpucu',
    lettersUnit: 'harf',
    prevClue: 'Önceki',
    nextClue: 'Sonraki',
    flipDirection: 'Yön Değiştir',
    showGloss: 'Çeviri İpucu',
    hideGloss: 'Çeviriyi Gizle',
    timerLabel: 'Süre',
    scoreLabel: 'Puan',
    streakLabel: 'Seri',
    progressLabel: 'Tamamlanan',
    pause: 'Duraklat',
    resume: 'Devam Et',
    pausedBanner: 'Baskı duraklatıldı. Kaldığınız yerden devam etmek için tıklayın.',
    toolsHeading: 'İpucu ve Kontrol',
    revealLetter: 'Harf Aç',
    revealWord: 'Kelime Aç',
    checkWord: 'Kelimeyi Kontrol Et',
    checkBoard: 'Tümünü Kontrol Et',
    autoCheck: 'Anlık Hata Kontrolü',
    resetPuzzle: 'Tahtayı Temizle',
    confirmReset: 'Emin misiniz? Sıfırla',
    cancel: 'Vazgeç',
    keyboardToggleShow: 'Türkçe Klavyeyi Göster',
    keyboardToggleHide: 'Klavyeyi Gizle',
    backspace: 'Sil',
    directionShort: 'Yön',
    intersectingClue: 'Kesişen İpucu',
    editionsHeading: 'Küratörlü Baskılar',
    solvedBadge: 'Çözüldü',
    inProgressBadge: 'Devam Ediyor',
    notStartedBadge: 'Yeni Baskı',
    openEdition: 'Çözmeye Başla',
    resumeEdition: 'Devam Et',
    reviewEdition: 'İncele',
    archiveTitle: 'Matbaa Arşivi',
    archiveSubtitle: 'Her biri Türkçe imlaya uygun, kesişimleri doğrulanmış küratörlü gazete baskıları.',
    statsTitle: 'Çözüm Defteri',
    statsSubtitle: 'Tüm sayılardaki süreniz, puanınız ve çözüm seriniz tarayıcınızda güvenle saklanır.',
    statsSolved: 'Çözülen Sayı',
    statsCurrentStreak: 'Güncel Seri',
    statsBestStreak: 'En İyi Seri',
    statsTotalScore: 'Toplam Puan',
    statsHintsUsed: 'Kullanılan İpucu',
    statsEditionLedger: 'Baskı Dökümü',
    statsEditionCol: 'Baskı',
    statsDifficultyCol: 'Seviye',
    statsStatusCol: 'Durum',
    statsTimeCol: 'Süre',
    statsScoreCol: 'Puan',
    guideTitle: 'Çengel Bulmaca Rehberi',
    guideSubtitle: 'Klasik Türk gazetesi çengel bulmacasının işaretleri, kısayolları ve puanlama kuralları.',
    guideArrowsTitle: 'Yön Okları',
    guideArrowsDesc:
      'Her ipucu kutusundaki ok, cevabın hangi bitişik kareden başlayıp hangi yöne ilerlediğini gösterir (→ sağa, ↓ aşağıya, ↴ sağdan aşağıya, ↳ aşağıdan sağa).',
    guideSplitTitle: 'Bölünmüş İpucu Kutuları',
    guideSplitDesc:
      'Bazı gölgeli kutular yatay çizgiyle ikiye ayrılır ve iki ayrı kelimenin ipucunu taşır. İstediğiniz yarıma tıklayarak ilgili kelimeye doğrudan geçebilirsiniz.',
    guidePhotoTitle: 'Resimli İpucu Blokları',
    guidePhotoDesc:
      'Baskı gravürü içeren kareye tıkladığınızda kırmızı okun gösterdiği ana tema kelimesi seçilir.',
    guideKeysTitle: 'Klavye ve Türkçe İmla',
    guideKeysDesc:
      'Fiziksel klavyenizde i yazdığınızda otomatik olarak İ, ı yazdığınızda I girilir. Yön tuşlarıyla gezinebilir, Boşluk tuşuyla yatay/dikey geçiş yapabilirsiniz.',
    guideStartPlaying: 'Bulmacaya Dön',
    victoryKicker: 'Baskı Tamamlandı',
    victoryTitle: 'Tebrikler, kusursuz çözüm!',
    victorySubtitle: 'Bu sayının tüm kelimelerini eksiksiz yerleştirdiniz.',
    victoryTime: 'Süre',
    victoryScore: 'Puan',
    victoryHints: 'İpucu',
    victoryStreak: 'Seri',
    victoryNextEdition: 'Sonraki Sayıya Geç',
    victoryBackToBoard: 'Tabloyu İncele',
    printModalTitle: 'Gazete Baskısı Yazdır',
    printModalDesc: 'Yazdırmak istediğiniz kağıt düzenini seçin. Arayüz öğeleri otomatik olarak gizlenir.',
    printBlank: 'Boş Bulmaca Sayfası',
    printBlankDesc: 'Kalemle kağıt üzerinde çözmek için temiz gazete baskısı.',
    printProgress: 'Mevcut Cevaplarımla',
    printProgressDesc: 'Şu ana kadar girdiğiniz harflerle birlikte yazdırır.',
    printSolution: 'Çözüm Anahtarı',
    printSolutionDesc: 'Tüm kelimelerin dolu olduğu kontrol baskısı.',
    printConfirm: 'Yazdırmayı Başlat',
    printSheetFooter: 'Matbaa Çengel · Klasik Türkçe Çengel Bulmaca Eki',
    toastBoardClean: 'Girilen tüm harfler doğru görünüyor.',
    toastErrorsFound: 'Hatalı harfler kırmızı çapraz çizgiyle işaretlendi.',
    toastWordCorrect: 'Seçili kelime doğru!',
    toastWordHasErrors: 'Seçili kelimede hatalı harf var.',
    generatorButton: 'Yeni Baskı Üret',
    dailyButton: 'Günün Bulmacası',
    generatorTitle: 'Matbaa Baskı Atölyesi',
    generatorSubtitle:
      'Geniş Türkçe sözlük veritabanından istediğiniz tema, ızgara boyutu ve zorlukta yeni bir çengel bulmaca dizin.',
    generatorCategoryLabel: 'Tema ve Kategori',
    generatorSizeLabel: 'Izgara Boyutu',
    generatorDifficultyLabel: 'Zorluk Seviyesi',
    generatorCreateBtn: 'Yeni Baskıyı Diz ve Aç',
    generatorDailyQuickBtn: 'Bugünün Özel Baskısını Aç',
    lexiconSummaryLabel: 'Sözlük Veritabanı: {count} Türkçe kelime',
    categories: {
      all: 'Tüm Kategoriler (Karma)',
      tarih: 'Tarih & Uygarlık',
      cografya: 'Coğrafya & Doğa',
      mutfak: 'Mutfak & Sofra',
      bilim: 'Bilim & Keşif',
      kultur: 'Kültür & Sanat',
      genel: 'Genel Sözlük',
    },
    gridSizes: {
      8: '8×8 Hızlı Baskı',
      10: '10×10 Standart Gazete',
      12: '12×12 Tam Sayfa Pazar',
    },
    archiveDailyHeading: 'Günün Bulmacaları',
    archiveGeneratedHeading: 'Üretilen Özel Baskılarım',
    archiveCuratedHeading: 'Klasik Küratörlü Baskılar',
  },
  en: {
    appName: 'Matbaa Çengel',
    navPlay: 'Puzzle',
    navArchive: 'Archive',
    navStats: 'Statistics',
    navGuide: 'How to Play',
    actionPrint: 'Print',
    editionLabel: 'Issue',
    wordsCount: 'Words',
    languageLabel: 'Language',
    soundOn: 'Sound On',
    soundOff: 'Muted',
    difficulty: {
      easy: 'Easy',
      medium: 'Medium',
      hard: 'Hard',
      master: 'Master',
    },
    across: 'Across',
    down: 'Down',
    photoClue: 'Illustrated Clue',
    lettersUnit: 'letters',
    prevClue: 'Previous',
    nextClue: 'Next',
    flipDirection: 'Flip Direction',
    showGloss: 'Clue Translation',
    hideGloss: 'Hide Translation',
    timerLabel: 'Time',
    scoreLabel: 'Score',
    streakLabel: 'Streak',
    progressLabel: 'Completed',
    pause: 'Pause',
    resume: 'Resume',
    pausedBanner: 'Edition paused. Click to resume solving where you left off.',
    toolsHeading: 'Hints & Checking',
    revealLetter: 'Reveal Letter',
    revealWord: 'Reveal Word',
    checkWord: 'Check Word',
    checkBoard: 'Check All',
    autoCheck: 'Live Error Check',
    resetPuzzle: 'Clear Grid',
    confirmReset: 'Confirm Reset',
    cancel: 'Cancel',
    keyboardToggleShow: 'Show Turkish Keyboard',
    keyboardToggleHide: 'Hide Keyboard',
    backspace: 'Delete',
    directionShort: 'Dir',
    intersectingClue: 'Crossing Clue',
    editionsHeading: 'Curated Editions',
    solvedBadge: 'Solved',
    inProgressBadge: 'In Progress',
    notStartedBadge: 'New Issue',
    openEdition: 'Start Puzzle',
    resumeEdition: 'Resume',
    reviewEdition: 'Review',
    archiveTitle: 'Print Archive',
    archiveSubtitle: 'Handcrafted Turkish newspaper arrowwords with verified intersections and illustrated clues.',
    statsTitle: 'Solver Ledger',
    statsSubtitle: 'Your solve times, scores, and streaks across every issue are saved locally.',
    statsSolved: 'Issues Solved',
    statsCurrentStreak: 'Current Streak',
    statsBestStreak: 'Best Streak',
    statsTotalScore: 'Total Score',
    statsHintsUsed: 'Hints Used',
    statsEditionLedger: 'Edition Breakdown',
    statsEditionCol: 'Edition',
    statsDifficultyCol: 'Level',
    statsStatusCol: 'Status',
    statsTimeCol: 'Time',
    statsScoreCol: 'Score',
    guideTitle: 'Arrowword Guide',
    guideSubtitle: 'How to read classic Turkish newspaper çengel bulmaca arrows, split tiles, and shortcuts.',
    guideArrowsTitle: 'Directional Arrows',
    guideArrowsDesc:
      'Every shaded clue tile features an arrow showing where the Turkish answer starts and flows (→ across, ↓ down, ↴ right-then-down, ↳ down-then-right).',
    guideSplitTitle: 'Split Clue Tiles',
    guideSplitDesc:
      'Shaded tiles divided by a hairline carry two separate clues. Click either half to jump directly to its word.',
    guidePhotoTitle: 'Illustrated Photo Clues',
    guidePhotoDesc:
      'Click the woodcut engraving tile embedded in the grid to highlight the main themed word indicated by its crimson arrow.',
    guideKeysTitle: 'Turkish Keyboard & Shortcuts',
    guideKeysDesc:
      'Both physical keyboards and the docked Turkish Q-keyboard preserve dotted İ and dotless I. Use Arrow keys to move and Space to switch direction.',
    guideStartPlaying: 'Return to Puzzle',
    victoryKicker: 'Edition Complete',
    victoryTitle: 'Solved without a hitch!',
    victorySubtitle: 'You completed every Turkish word in this newspaper edition.',
    victoryTime: 'Time',
    victoryScore: 'Score',
    victoryHints: 'Hints',
    victoryStreak: 'Streak',
    victoryNextEdition: 'Next Issue',
    victoryBackToBoard: 'Inspect Grid',
    printModalTitle: 'Print Newspaper Sheet',
    printModalDesc: 'Choose a broadsheet print layout. Navigation and controls are hidden automatically.',
    printBlank: 'Blank Puzzle Sheet',
    printBlankDesc: 'Clean newsprint layout ready to solve with pen or pencil.',
    printProgress: 'With My Progress',
    printProgressDesc: 'Includes the letters you have entered so far.',
    printSolution: 'Answer Key',
    printSolutionDesc: 'Complete filled solution sheet for verification.',
    printConfirm: 'Print Now',
    printSheetFooter: 'Matbaa Çengel · Classic Turkish Arrowword Supplement',
    toastBoardClean: 'Every filled letter so far is accurate.',
    toastErrorsFound: 'Incorrect letters are marked with a crimson diagonal slash.',
    toastWordCorrect: 'Selected word is correct!',
    toastWordHasErrors: 'This word contains an incorrect letter.',
    generatorButton: 'Generate Edition',
    dailyButton: 'Daily Puzzle',
    generatorTitle: 'Press Edition Studio',
    generatorSubtitle:
      'Typeset a fresh arrowword from the comprehensive Turkish lexicon by choosing your theme, grid dimensions, and difficulty.',
    generatorCategoryLabel: 'Theme & Category',
    generatorSizeLabel: 'Grid Size',
    generatorDifficultyLabel: 'Difficulty Level',
    generatorCreateBtn: 'Typeset & Open Edition',
    generatorDailyQuickBtn: 'Open Today’s Daily Puzzle',
    lexiconSummaryLabel: 'Lexicon Database: {count} Turkish words',
    categories: {
      all: 'All Categories (Mixed)',
      tarih: 'History & Civilization',
      cografya: 'Geography & Nature',
      mutfak: 'Cuisine & Table',
      bilim: 'Science & Discovery',
      kultur: 'Culture & Arts',
      genel: 'General Lexicon',
    },
    gridSizes: {
      8: '8×8 Compact Edition',
      10: '10×10 Standard Broadsheet',
      12: '12×12 Sunday Full Page',
    },
    archiveDailyHeading: 'Daily Puzzles',
    archiveGeneratedHeading: 'My Custom Generated Editions',
    archiveCuratedHeading: 'Classic Curated Editions',
  },
  de: {
    appName: 'Matbaa Çengel',
    navPlay: 'Rätsel',
    navArchive: 'Archiv',
    navStats: 'Statistik',
    navGuide: 'Anleitung',
    actionPrint: 'Drucken',
    editionLabel: 'Ausgabe',
    wordsCount: 'Wörter',
    languageLabel: 'Sprache',
    soundOn: 'Ton An',
    soundOff: 'Stumm',
    difficulty: {
      easy: 'Leicht',
      medium: 'Mittel',
      hard: 'Schwer',
      master: 'Meister',
    },
    across: 'Waagerecht',
    down: 'Senkrecht',
    photoClue: 'Bildhinweis',
    lettersUnit: 'Buchst.',
    prevClue: 'Zurück',
    nextClue: 'Weiter',
    flipDirection: 'Richtung wechseln',
    showGloss: 'Hinweis übersetzen',
    hideGloss: 'Übersetzung aus',
    timerLabel: 'Zeit',
    scoreLabel: 'Punkte',
    streakLabel: 'Serie',
    progressLabel: 'Gelöst',
    pause: 'Pause',
    resume: 'Weiter',
    pausedBanner: 'Ausgabe pausiert. Klicken Sie, um fortzufahren.',
    toolsHeading: 'Hilfe & Prüfung',
    revealLetter: 'Buchstabe zeigen',
    revealWord: 'Wort zeigen',
    checkWord: 'Wort prüfen',
    checkBoard: 'Alles prüfen',
    autoCheck: 'Sofort-Prüfung',
    resetPuzzle: 'Feld leeren',
    confirmReset: 'Wirklich zurücksetzen',
    cancel: 'Abbrechen',
    keyboardToggleShow: 'Türkische Tastatur',
    keyboardToggleHide: 'Tastatur ausblenden',
    backspace: 'Löschen',
    directionShort: 'Richt.',
    intersectingClue: 'Kreuzender Hinweis',
    editionsHeading: 'Kuratierte Ausgaben',
    solvedBadge: 'Gelöst',
    inProgressBadge: 'In Arbeit',
    notStartedBadge: 'Neue Ausgabe',
    openEdition: 'Starten',
    resumeEdition: 'Fortsetzen',
    reviewEdition: 'Ansehen',
    archiveTitle: 'Zeitungsarchiv',
    archiveSubtitle: 'Handgefertigte türkische Schwedenrätsel mit geprüften Kreuzungen und Bildhinweisen.',
    statsTitle: 'Lösungsbuch',
    statsSubtitle: 'Zeiten, Punkte und Serien aller Ausgaben werden lokal im Browser gespeichert.',
    statsSolved: 'Gelöste Ausgaben',
    statsCurrentStreak: 'Aktuelle Serie',
    statsBestStreak: 'Beste Serie',
    statsTotalScore: 'Gesamtpunkte',
    statsHintsUsed: 'Hilfen genutzt',
    statsEditionLedger: 'Ausgabenübersicht',
    statsEditionCol: 'Ausgabe',
    statsDifficultyCol: 'Stufe',
    statsStatusCol: 'Status',
    statsTimeCol: 'Zeit',
    statsScoreCol: 'Punkte',
    guideTitle: 'Rätsel-Anleitung',
    guideSubtitle: 'So funktionieren Pfeile, geteilte Felder und Tastenkürzel im türkischen Çengel Bulmaca.',
    guideArrowsTitle: 'Richtungspfeile',
    guideArrowsDesc:
      'Jedes schattierte Hinweisfeld zeigt mit einem Pfeil genau an, wo das türkische Lösungswort beginnt und verläuft (→, ↓, ↴, ↳).',
    guideSplitTitle: 'Geteilte Hinweisfelder',
    guideSplitDesc:
      'Geteilte Felder enthalten zwei Hinweise. Klicken Sie auf die obere oder untere Hälfte, um direkt zum Wort zu springen.',
    guidePhotoTitle: 'Illustrierte Bildfelder',
    guidePhotoDesc:
      'Klicken Sie auf die Zeitungs-Illustration im Raster, um das Hauptwort am roten Pfeil zu markieren.',
    guideKeysTitle: 'Türkische Tastatur & Kürzel',
    guideKeysDesc:
      'Sowohl physische Tastaturen als auch die türkische Q-Tastatur unterscheiden sauber zwischen İ und I. Leertaste wechselt die Richtung.',
    guideStartPlaying: 'Zurück zum Rätsel',
    victoryKicker: 'Ausgabe abgeschlossen',
    victoryTitle: 'Hervorragend gelöst!',
    victorySubtitle: 'Sie haben alle türkischen Wörter dieser Ausgabe korrekt eingetragen.',
    victoryTime: 'Zeit',
    victoryScore: 'Punkte',
    victoryHints: 'Hilfen',
    victoryStreak: 'Serie',
    victoryNextEdition: 'Nächste Ausgabe',
    victoryBackToBoard: 'Raster ansehen',
    printModalTitle: 'Zeitungsseite drucken',
    printModalDesc: 'Wählen Sie das gewünschte Druckformat. Bedienelemente werden automatisch ausgeblendet.',
    printBlank: 'Leeres Rätselblatt',
    printBlankDesc: 'Klares Druckbild zum Lösen mit Stift auf Papier.',
    printProgress: 'Mit meinem Stand',
    printProgressDesc: 'Druckt Ihre bisher eingetragenen Buchstaben mit aus.',
    printSolution: 'Lösungsblatt',
    printSolutionDesc: 'Vollständig ausgefüllte Lösung zur Kontrolle.',
    printConfirm: 'Jetzt drucken',
    printSheetFooter: 'Matbaa Çengel · Klassische türkische Rätselbeilage',
    toastBoardClean: 'Alle bisher eingetragenen Buchstaben sind korrekt.',
    toastErrorsFound: 'Fehlerhafte Buchstaben wurden rot schräg markiert.',
    toastWordCorrect: 'Ausgewähltes Wort ist richtig!',
    toastWordHasErrors: 'Dieses Wort enthält einen Fehler.',
    generatorButton: 'Ausgabe erstellen',
    dailyButton: 'Tagesrätsel',
    generatorTitle: 'Zeitungsdruck-Atelier',
    generatorSubtitle:
      'Erstellen Sie aus der großen türkischen Wortdatenbank ein neues Rätsel nach Thema, Rastergröße und Schwierigkeit.',
    generatorCategoryLabel: 'Thema & Kategorie',
    generatorSizeLabel: 'Rastergröße',
    generatorDifficultyLabel: 'Schwierigkeitsgrad',
    generatorCreateBtn: 'Ausgabe setzen & öffnen',
    generatorDailyQuickBtn: 'Heutiges Tagesrätsel öffnen',
    lexiconSummaryLabel: 'Wortdatenbank: {count} türkische Wörter',
    categories: {
      all: 'Alle Kategorien (Gemischt)',
      tarih: 'Geschichte & Kultur',
      cografya: 'Geographie & Natur',
      mutfak: 'Küche & Tafel',
      bilim: 'Wissenschaft & Technik',
      kultur: 'Kunst & Literatur',
      genel: 'Allgemeinwortschatz',
    },
    gridSizes: {
      8: '8×8 Kompakt-Ausgabe',
      10: '10×10 Standard-Zeitung',
      12: '12×12 Sonntags-Großformat',
    },
    archiveDailyHeading: 'Tagesrätsel',
    archiveGeneratedHeading: 'Meine erstellten Ausgaben',
    archiveCuratedHeading: 'Klassische kuratierte Ausgaben',
  },
  fr: {
    appName: 'Matbaa Çengel',
    navPlay: 'Grille',
    navArchive: 'Archives',
    navStats: 'Statistiques',
    navGuide: 'Mode d’emploi',
    actionPrint: 'Imprimer',
    editionLabel: 'Numéro',
    wordsCount: 'Mots',
    languageLabel: 'Langue',
    soundOn: 'Son activé',
    soundOff: 'Muet',
    difficulty: {
      easy: 'Facile',
      medium: 'Moyen',
      hard: 'Difficile',
      master: 'Maître',
    },
    across: 'Horizontal',
    down: 'Vertical',
    photoClue: 'Indice illustré',
    lettersUnit: 'lettres',
    prevClue: 'Précédent',
    nextClue: 'Suivant',
    flipDirection: 'Changer de sens',
    showGloss: 'Traduire l’indice',
    hideGloss: 'Masquer traduction',
    timerLabel: 'Chrono',
    scoreLabel: 'Score',
    streakLabel: 'Série',
    progressLabel: 'Progression',
    pause: 'Pause',
    resume: 'Reprendre',
    pausedBanner: 'Édition en pause. Cliquez pour reprendre votre partie.',
    toolsHeading: 'Indices et contrôle',
    revealLetter: 'Révéler lettre',
    revealWord: 'Révéler mot',
    checkWord: 'Vérifier le mot',
    checkBoard: 'Tout vérifier',
    autoCheck: 'Vérification directe',
    resetPuzzle: 'Effacer la grille',
    confirmReset: 'Confirmer l’effacement',
    cancel: 'Annuler',
    keyboardToggleShow: 'Clavier turc',
    keyboardToggleHide: 'Masquer clavier',
    backspace: 'Effacer',
    directionShort: 'Sens',
    intersectingClue: 'Indice croisé',
    editionsHeading: 'Éditions sélectionnées',
    solvedBadge: 'Résolu',
    inProgressBadge: 'En cours',
    notStartedBadge: 'Nouveau',
    openEdition: 'Commencer',
    resumeEdition: 'Continuer',
    reviewEdition: 'Revoir',
    archiveTitle: 'Archives de presse',
    archiveSubtitle: 'Mots fléchés turcs artisanaux avec croisements vérifiés et gravures éditoriales.',
    statsTitle: 'Carnet du joueur',
    statsSubtitle: 'Vos temps, scores et séries sont enregistrés localement dans votre navigateur.',
    statsSolved: 'Numéros résolus',
    statsCurrentStreak: 'Série actuelle',
    statsBestStreak: 'Meilleure série',
    statsTotalScore: 'Score total',
    statsHintsUsed: 'Indices utilisés',
    statsEditionLedger: 'Détail par numéro',
    statsEditionCol: 'Numéro',
    statsDifficultyCol: 'Niveau',
    statsStatusCol: 'État',
    statsTimeCol: 'Temps',
    statsScoreCol: 'Score',
    guideTitle: 'Guide des mots fléchés',
    guideSubtitle: 'Comprendre les flèches, les cases doubles et les raccourcis du çengel bulmaca turc.',
    guideArrowsTitle: 'Flèches directionnelles',
    guideArrowsDesc:
      'Chaque case ombrée porte une flèche indiquant le départ et le sens du mot turc (→, ↓, ↴, ↳).',
    guideSplitTitle: 'Cases à double indice',
    guideSplitDesc:
      'Certaines cases divisées contiennent deux définitions. Cliquez sur la moitié souhaitée pour sélectionner le mot.',
    guidePhotoTitle: 'Vignettes illustrées',
    guidePhotoDesc:
      'Cliquez sur la gravure de presse intégrée à la grille pour activer le mot thématique désigné par la flèche rouge.',
    guideKeysTitle: 'Clavier turc et raccourcis',
    guideKeysDesc:
      'Le clavier physique et le clavier turc Q respectent la distinction İ / I. Utilisez les flèches pour naviguer et Espace pour pivoter.',
    guideStartPlaying: 'Retour à la grille',
    victoryKicker: 'Édition terminée',
    victoryTitle: 'Bravo, grille complète !',
    victorySubtitle: 'Vous avez trouvé tous les mots turcs de cette édition.',
    victoryTime: 'Temps',
    victoryScore: 'Score',
    victoryHints: 'Indices',
    victoryStreak: 'Série',
    victoryNextEdition: 'Numéro suivant',
    victoryBackToBoard: 'Voir la grille',
    printModalTitle: 'Imprimer la page journal',
    printModalDesc: 'Choisissez le format d’impression. Les menus et outils sont masqués automatiquement.',
    printBlank: 'Grille vierge',
    printBlankDesc: 'Mise en page journal prête à être remplie au crayon.',
    printProgress: 'Avec mes réponses',
    printProgressDesc: 'Inclut les lettres que vous avez déjà saisies.',
    printSolution: 'Corrigé complet',
    printSolutionDesc: 'Grille entièrement remplie pour vérification.',
    printConfirm: 'Lancer l’impression',
    printSheetFooter: 'Matbaa Çengel · Supplément classique de mots fléchés turcs',
    toastBoardClean: 'Toutes les lettres saisies sont correctes.',
    toastErrorsFound: 'Les lettres erronées sont marquées d’une barre rouge.',
    toastWordCorrect: 'Le mot sélectionné est correct !',
    toastWordHasErrors: 'Ce mot contient une erreur.',
    generatorButton: 'Générer une grille',
    dailyButton: 'Grille du Jour',
    generatorTitle: 'Atelier d’édition de presse',
    generatorSubtitle:
      'Composez une nouvelle grille dynamique à partir de la base lexicale turque selon votre thème, taille et difficulté.',
    generatorCategoryLabel: 'Thème et catégorie',
    generatorSizeLabel: 'Taille de la grille',
    generatorDifficultyLabel: 'Niveau de difficulté',
    generatorCreateBtn: 'Composer et ouvrir la grille',
    generatorDailyQuickBtn: 'Ouvrir la Grille du Jour',
    lexiconSummaryLabel: 'Base lexicale : {count} mots turcs',
    categories: {
      all: 'Toutes catégories (Mixte)',
      tarih: 'Histoire & Civilisation',
      cografya: 'Géographie & Nature',
      mutfak: 'Cuisine & Table',
      bilim: 'Sciences & Découvertes',
      kultur: 'Culture & Arts',
      genel: 'Lexique général',
    },
    gridSizes: {
      8: '8×8 Édition compacte',
      10: '10×10 Format journal',
      12: '12×12 Grand format dimanche',
    },
    archiveDailyHeading: 'Grilles du Jour',
    archiveGeneratedHeading: 'Mes éditions personnalisées',
    archiveCuratedHeading: 'Éditions classiques sélectionnées',
  },
};
