/**
 * Mapa: podstrona starej strony -> katalog, do którego trafiają jej zdjęcia.
 *
 * Bierzemy wyłącznie polskie adresy, bo wersje DE i CS na starej stronie
 * korzystają z dokładnie tych samych plików graficznych.
 */
export const sourcePages: Array<{ path: string; category: string }> = [
  { path: '/', category: 'hero' },
  { path: '/o-firmie/', category: 'firma' },

  // Oferta
  { path: '/nagrobki-granitowe/', category: 'oferta/nagrobki' },
  { path: '/blaty/', category: 'oferta/blaty' },
  { path: '/parapety-granitowe/', category: 'oferta/parapety' },
  { path: '/schody-granitowe/', category: 'oferta/schody' },
  { path: '/kominki/', category: 'oferta/kominki' },

  // Katalog kamieni
  { path: '/granity/', category: 'kamienie/granity' },
  { path: '/konglomeraty-kwarcowe-pacific/', category: 'kamienie/konglomeraty' },
  { path: '/wizualizacje/', category: 'wizualizacje' },

  // Galeria nagrobków - każda podstrona to dziś jeden filtr galerii
  { path: '/nagrobki-nowoczesne/', category: 'realizacje/nowoczesne' },
  { path: '/nagrobki-galeria/', category: 'realizacje/inne' },
  { path: '/grobowce/', category: 'realizacje/grobowce' },
  { path: '/grobowcowe/', category: 'realizacje/grobowce' },
  { path: '/grobowce-podwojne/', category: 'realizacje/podwojne' },
  { path: '/ziemne/', category: 'realizacje/ziemne' },
  { path: '/ziemne-podwojne/', category: 'realizacje/podwojne' },
  { path: '/podwojne/', category: 'realizacje/podwojne' },
  { path: '/ukosne/', category: 'realizacje/ukosne' },
  { path: '/urnowe/', category: 'realizacje/urnowe' },
  { path: '/dzieciece/', category: 'realizacje/dzieciece' },
  { path: '/czeskie/', category: 'realizacje/czeskie' },
  { path: '/niemieckie/', category: 'realizacje/niemieckie' },
];

export const OLD_SITE_ORIGIN = 'https://poloniagranit.pl';
