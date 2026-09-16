/**
 * Katalog kamieni. Nazwy handlowe i próbki przeniesione ze starej strony,
 * grupy kolorystyczne przypisane na podstawie samych zdjęć próbek
 * (`node scripts/analyze-stone-colors.mts` liczy dominujący kolor), a nie na
 * podstawie nazw - te bywają mylące.
 *
 * Świadomie nie podajemy kraju pochodzenia. Na starej stronie tej informacji
 * nie było, a wpisywanie jej „z głowy” przy kamieniu, który klient sprowadza
 * z konkretnego kamieniołomu, to proszenie się o pomyłkę w ofercie.
 *
 * UWAGA do weryfikacji z klientem: przy kilku pozycjach nazwa nie zgadza się
 * z wyglądem próbki na starej stronie - patrz `needsReview`.
 */

export type StoneMaterial = 'granit' | 'konglomerat';

export type StoneColor =
  | 'czarny'
  | 'grafitowy'
  | 'szary'
  | 'jasny'
  | 'bezowy'
  | 'brazowy'
  | 'czerwony'
  | 'zielony'
  | 'niebieski'
  | 'wielokolorowy';

export type StoneFinish = 'polerowany' | 'satynowy';

export type Stone = {
  /** Slug pliku w `public/img/kamienie/**`. */
  slug: string;
  name: string;
  material: StoneMaterial;
  color: StoneColor;
  /** Dominujący kolor próbki - używany jako kropka przy filtrach. */
  swatch: string;
  finish?: StoneFinish;
  /** Nazwa nie zgadza się z próbką na starej stronie - do potwierdzenia. */
  needsReview?: true;
};

export const granites: Stone[] = [
  { slug: 'aurora-indyjska', name: 'Aurora Indyjska', material: 'granit', color: 'brazowy', swatch: '#3e342d' },
  { slug: 'azul-noche', name: 'Azul Noche', material: 'granit', color: 'szary', swatch: '#545f65' },
  { slug: 'balmoral', name: 'Balmoral', material: 'granit', color: 'czerwony', swatch: '#7b6051' },
  { slug: 'baltic-green', name: 'Baltic Green', material: 'granit', color: 'zielony', swatch: '#444a38' },
  { slug: 'bengal-black', name: 'Bengal Black', material: 'granit', color: 'czarny', swatch: '#1a201d' },
  { slug: 'bianco-pearl', name: 'Bianco Pearl', material: 'granit', color: 'jasny', swatch: '#707a7d' },
  { slug: 'blue-night', name: 'Blue Night', material: 'granit', color: 'grafitowy', swatch: '#353e38' },
  { slug: 'bohus-lite', name: 'Bohus Lite', material: 'granit', color: 'szary', swatch: '#5f6359' },
  { slug: 'bohus-red', name: 'Bohus Red', material: 'granit', color: 'brazowy', swatch: '#5f5646' },
  { slug: 'braz-krolewski', name: 'Brąz Królewski', material: 'granit', color: 'szary', swatch: '#82827d', needsReview: true },
  { slug: 'brazylian-gold', name: 'Brazylian Gold', material: 'granit', color: 'brazowy', swatch: '#68584c' },
  { slug: 'emerald', name: 'Emerald', material: 'granit', color: 'zielony', swatch: '#2b342f' },
  { slug: 'hallandia', name: 'Hallandia', material: 'granit', color: 'wielokolorowy', swatch: '#595a54' },
  { slug: 'himalaja-blue', name: 'Himalaja Blue', material: 'granit', color: 'brazowy', swatch: '#6e5b4f', needsReview: true },
  { slug: 'himalaja-ghandi', name: 'Himalaja Ghandi', material: 'granit', color: 'brazowy', swatch: '#514f4c' },
  { slug: 'impala-dark', name: 'Impala Dark', material: 'granit', color: 'grafitowy', swatch: '#272f2f' },
  { slug: 'impala-rustenburg', name: 'Impala Rustenburg', material: 'granit', color: 'szary', swatch: '#4b514f' },
  { slug: 'jet-black', name: 'Jet Black', material: 'granit', color: 'czarny', swatch: '#131718' },
  { slug: 'juparana', name: 'Juparana', material: 'granit', color: 'bezowy', swatch: '#b5ab92' },
  { slug: 'kuru-grey', name: 'Kuru Grey', material: 'granit', color: 'szary', swatch: '#5b6460' },
  { slug: 'lablador-dark', name: 'Labrador Dark', material: 'granit', color: 'niebieski', swatch: '#3e4b53' },
  { slug: 'lablador-light', name: 'Labrador Light', material: 'granit', color: 'niebieski', swatch: '#728187' },
  { slug: 'madura-gold', name: 'Madura Gold', material: 'granit', color: 'bezowy', swatch: '#cdb57d' },
  { slug: 'marina', name: 'Marina', material: 'granit', color: 'szary', swatch: '#535e5f' },
  { slug: 'multikolor', name: 'Multikolor', material: 'granit', color: 'wielokolorowy', swatch: '#84614b' },
  { slug: 'nero-angola', name: 'Nero Angola', material: 'granit', color: 'czarny', swatch: '#1b2122' },
  { slug: 'oliv-green', name: 'Oliv Green', material: 'granit', color: 'zielony', swatch: '#596966' },
  { slug: 'orion-medium', name: 'Orion Medium', material: 'granit', color: 'grafitowy', swatch: '#383c41' },
  { slug: 'orion-rv-dark', name: 'Orion RV Dark', material: 'granit', color: 'grafitowy', swatch: '#404449' },
  { slug: 'paradiso', name: 'Paradiso', material: 'granit', color: 'brazowy', swatch: '#544f4d' },
  { slug: 'ruby-star', name: 'Ruby Star', material: 'granit', color: 'czerwony', swatch: '#2d2017' },
  { slug: 'siva-kasi', name: 'Siva Kasi', material: 'granit', color: 'bezowy', swatch: '#9c8b70' },
  { slug: 'star-galaxy', name: 'Star Galaxy', material: 'granit', color: 'czarny', swatch: '#161a1b' },
  { slug: 'steel-grey', name: 'Steel Grey', material: 'granit', color: 'grafitowy', swatch: '#2c3234' },
  { slug: 'strzegom', name: 'Strzegom', material: 'granit', color: 'szary', swatch: '#7c827c' },
  { slug: 'szwed-drobny', name: 'Szwed drobny', material: 'granit', color: 'czarny', swatch: '#14181b' },
  { slug: 'tan-brown', name: 'Tan Brown', material: 'granit', color: 'brazowy', swatch: '#272420' },
  { slug: 'tharn', name: 'Tharn', material: 'granit', color: 'jasny', swatch: '#7a8588' },
  { slug: 'tolkowski', name: 'Tołkowski', material: 'granit', color: 'czerwony', swatch: '#63493d' },
  { slug: 'vanga', name: 'Vanga', material: 'granit', color: 'czerwony', swatch: '#694633' },
  { slug: 'verde-bahia', name: 'Verde Bahia', material: 'granit', color: 'zielony', swatch: '#3d4431' },
  { slug: 'viscont-white', name: 'Viscont White', material: 'granit', color: 'jasny', swatch: '#778080' },
];

/**
 * Konglomeraty kwarcowe PACIFIC. Nazwy i wykończenie odczytane z nazw plików
 * producenta (`...-Closeup-Polished`, `...-Closeup-Leather`).
 */
export const conglomerates: Stone[] = [
  { slug: 'alchemy-closeup-polished', name: 'Alchemy', material: 'konglomerat', color: 'jasny', swatch: '#bdc0c9', finish: 'polerowany' },
  { slug: 'artemis-closeup-polished', name: 'Artemis', material: 'konglomerat', color: 'jasny', swatch: '#d7d8d6', finish: 'polerowany' },
  { slug: 'aspen-aura-closeup-polished', name: 'Aspen Aura', material: 'konglomerat', color: 'jasny', swatch: '#cfd1d6', finish: 'polerowany' },
  { slug: 'astral-mist-closeup-polished', name: 'Astral Mist', material: 'konglomerat', color: 'jasny', swatch: '#c2c2c5', finish: 'polerowany' },
  { slug: 'bellagio-closeup-polished', name: 'Bellagio', material: 'konglomerat', color: 'jasny', swatch: '#e7e5e6', finish: 'polerowany' },
  { slug: 'cappuccino-closeup-leather', name: 'Cappuccino', material: 'konglomerat', color: 'bezowy', swatch: '#beb6ae', finish: 'satynowy' },
  { slug: 'french-vanilla-closeup-polished', name: 'French Vanilla', material: 'konglomerat', color: 'bezowy', swatch: '#d8d2cf', finish: 'polerowany' },
  { slug: 'galactic-halo-closeup-polished', name: 'Galactic Halo', material: 'konglomerat', color: 'jasny', swatch: '#dbd9dd', finish: 'polerowany' },
  { slug: 'hermes-closeup-polished', name: 'Hermes', material: 'konglomerat', color: 'jasny', swatch: '#b6b5b5', finish: 'polerowany' },
  { slug: 'medusa-closeup-polished', name: 'Medusa', material: 'konglomerat', color: 'bezowy', swatch: '#e0dcd7', finish: 'polerowany' },
  { slug: 'oakville-closeup-polished', name: 'Oakville', material: 'konglomerat', color: 'szary', swatch: '#acacac', finish: 'polerowany' },
  { slug: 'poseidon-closeup-polished', name: 'Poseidon', material: 'konglomerat', color: 'niebieski', swatch: '#394456', finish: 'polerowany' },
  { slug: 'ruskin-closeup-polished', name: 'Ruskin', material: 'konglomerat', color: 'szary', swatch: '#626568', finish: 'polerowany' },
  { slug: 'san-marino-closeup-polished', name: 'San Marino', material: 'konglomerat', color: 'jasny', swatch: '#d4d5d4', finish: 'polerowany' },
  { slug: 'suzuka-closeup-polished', name: 'Suzuka', material: 'konglomerat', color: 'czarny', swatch: '#161617', finish: 'polerowany' },
  { slug: 'tokyo-closeup-polished', name: 'Tokyo', material: 'konglomerat', color: 'jasny', swatch: '#c9c8c6', finish: 'polerowany' },
];

export const allStones: Stone[] = [...granites, ...conglomerates];

/** Kolejność filtrów - od najciemniejszych do najjaśniejszych, potem barwne. */
export const colorOrder: StoneColor[] = [
  'czarny',
  'grafitowy',
  'szary',
  'jasny',
  'bezowy',
  'brazowy',
  'czerwony',
  'zielony',
  'niebieski',
  'wielokolorowy',
];

export const materialOrder: StoneMaterial[] = ['granit', 'konglomerat'];

export function stoneImageCategory(material: StoneMaterial): string {
  return material === 'granit'
    ? 'kamienie/granity'
    : 'kamienie/konglomeraty';
}

export function countByColor(stones: Stone[]): Map<StoneColor, number> {
  const counts = new Map<StoneColor, number>();
  for (const stone of stones) {
    counts.set(stone.color, (counts.get(stone.color) ?? 0) + 1);
  }
  return counts;
}
