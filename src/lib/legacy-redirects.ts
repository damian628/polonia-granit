/**
 * Mapa przekierowań ze starej strony na WordPressie.
 *
 * Adresy polskie w większości zostały zachowane 1:1 (`/o-firmie`, `/blaty`,
 * `/kominki`, `/schody-granitowe`, `/kontakt`), więc nie ma ich na tej liście.
 * Tutaj są tylko te, które zmieniły miejsce: kilkanaście osobnych podstron
 * galerii nagrobków oraz niemieckie i czeskie slugi wygenerowane przez wtyczkę
 * tłumaczeniową (`/de/doppelgraber-2`, `/cs/krbyi`, `/cs/parapety-2-2`).
 *
 * Cele przekierowań muszą się zgadzać ze slugami z `src/data/gallery.ts`.
 */

type LegacyRedirect = {
  source: string;
  destination: string;
  permanent: true;
};

const pairs: Array<[from: string, to: string]> = [
  // --- Polski: osobne galerie nagrobków -> podstrony jednej galerii ---
  ['/nagrobki-galeria', '/realizacje'],
  ['/nagrobki-nowoczesne', '/realizacje/nowoczesne'],
  ['/podwojne', '/realizacje/podwojne'],
  ['/urnowe', '/realizacje/urnowe'],
  ['/dzieciece', '/realizacje/dzieciece'],
  ['/ziemne', '/realizacje/ziemne'],
  ['/ziemne-podwojne', '/realizacje/podwojne'],
  ['/grobowce', '/realizacje/grobowce'],
  ['/grobowce-podwojne', '/realizacje/podwojne'],
  ['/grobowcowe', '/realizacje/grobowce'],
  ['/ukosne', '/realizacje/ukosne'],
  ['/czeskie', '/realizacje/czeskie'],
  ['/niemieckie', '/realizacje/niemieckie'],

  // Stary niemiecki slug konglomeratów. Polski i czeski adres zostają
  // prawdziwymi podstronami (`/konglomeraty-kwarcowe-pacific`,
  // `/cs/pacificke-kremenne-konglomeraty`).
  ['/de/pazifikische-quarzkonglomerate', '/de/quarzkonglomerate-pacific'],

  // --- Niemiecki: uporządkowanie slugów ---
  ['/de/hauptseite', '/de'],
  ['/de/start', '/de'],
  ['/de/ueber-die-firma', '/de/ueber-uns'],
  ['/de/platten', '/de/arbeitsplatten'],
  ['/de/galerie-2', '/de/referenzen'],
  ['/de/kontakt-3', '/de/kontakt'],

  // --- Niemiecki: galerie nagrobków ---
  ['/de/moderne-grabsteine', '/de/referenzen/moderne-grabsteine'],
  // „Einzelne” i „jednotlive” były na starej stronie kategoriami zbiorczymi
  // dla nagrobków pojedynczych, bez odpowiednika 1:1 w nowej strukturze -
  // kierujemy je na przegląd galerii, nie na zgadywany typ.
  ['/de/einzelne', '/de/referenzen'],
  ['/de/doppelte', '/de/referenzen/doppelgraeber'],
  ['/de/doppelgraber', '/de/referenzen/doppelgraeber'],
  ['/de/doppelgraber-2', '/de/referenzen/doppelgraeber'],
  ['/de/urnenartige', '/de/referenzen/urnengraeber'],
  ['/de/urnengrabmaler', '/de/referenzen/urnengraeber'],
  ['/de/kindische', '/de/referenzen/kindergrabsteine'],
  ['/de/erdgraber', '/de/referenzen/erdgraeber'],
  ['/de/mausoleen', '/de/referenzen/mausoleen'],
  ['/de/schrage-graber', '/de/referenzen/schraege-grabsteine'],
  ['/de/tschechische', '/de/referenzen/tschechische-grabsteine'],

  // --- Czeski: uporządkowanie slugów ---
  ['/cs/uvodni-stranka', '/cs'],
  ['/cs/o-spolecnosti', '/cs/o-nas'],
  ['/cs/desky', '/cs/kuchynske-desky'],
  ['/cs/parapety-2-2', '/cs/parapety'],
  ['/cs/schody-2', '/cs/schody'],
  // Literówka w oryginalnym slugu na starej stronie - "krbyi" zamiast "krby".
  ['/cs/krbyi', '/cs/krby'],
  ['/cs/galerie', '/cs/realizace'],
  ['/cs/kontakt-2', '/cs/kontakt'],

  // --- Czeski: galerie nagrobków ---
  ['/cs/moderni-nahrobky', '/cs/realizace/moderni-nahrobky'],
  ['/cs/jednotlive', '/cs/realizace'],
  ['/cs/dvojite', '/cs/realizace/dvojite-hroby'],
  ['/cs/dvojite-hroby', '/cs/realizace/dvojite-hroby'],
  ['/cs/dvojite-hroby-2', '/cs/realizace/dvojite-hroby'],
  ['/cs/urnove', '/cs/realizace/urnove-hroby'],
  ['/cs/detske', '/cs/realizace/detske-nahrobky'],
  ['/cs/hroby-v-zemi', '/cs/realizace/hroby-v-zemi'],
  ['/cs/mauzolea', '/cs/realizace/mauzolea'],
  ['/cs/sikme-nahrobky', '/cs/realizace/sikme-nahrobky'],
  ['/cs/ceske', '/cs/realizace/ceske-nahrobky'],
];

/**
 * Przy `trailingSlash: true` stare linki przychodzą ze slashem na końcu,
 * ale część katalogów i backlinków go nie ma. Rejestrujemy oba warianty,
 * żeby żadne wejście nie skończyło się na 404.
 *
 * Cel zawsze ze slashem - inaczej Next dokłada drugie przekierowanie tylko po
 * to, żeby go dopisać, a łańcuch dwóch skoków rozmywa sygnał dla wyszukiwarki.
 */
export const legacyRedirects: LegacyRedirect[] = pairs.flatMap(([from, to]) => {
  const destination = to.endsWith('/') ? to : `${to}/`;

  return [
    { source: from, destination, permanent: true as const },
    { source: `${from}/`, destination, permanent: true as const },
  ];
});
