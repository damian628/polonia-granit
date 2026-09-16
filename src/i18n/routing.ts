import { defineRouting } from 'next-intl/routing';

export const locales = ['pl', 'de', 'cs'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'pl';

/**
 * Polskie ścieżki celowo pokrywają się ze slugami starej strony na WordPressie
 * (`/o-firmie`, `/blaty`, `/kominki`, `/kontakt`...), żeby migracja nie kosztowała
 * pozycji w wyszukiwarce. Niemieckie i czeskie slugi zostały uporządkowane,
 * a stare adresy przekierowuje mapa 301 w `next.config.ts`.
 */
export const pathnames = {
  '/': '/',

  '/o-firmie': {
    pl: '/o-firmie',
    de: '/ueber-uns',
    cs: '/o-nas',
  },
  '/nagrobki-granitowe': {
    pl: '/nagrobki-granitowe',
    de: '/grabsteine',
    cs: '/nahrobky',
  },
  '/blaty': {
    pl: '/blaty',
    de: '/arbeitsplatten',
    cs: '/kuchynske-desky',
  },
  '/parapety-granitowe': {
    pl: '/parapety-granitowe',
    de: '/fensterbaenke',
    cs: '/parapety',
  },
  '/schody-granitowe': {
    pl: '/schody-granitowe',
    de: '/treppen',
    cs: '/schody',
  },
  '/kominki': {
    pl: '/kominki',
    de: '/kamine',
    cs: '/krby',
  },
  '/granity': {
    pl: '/granity',
    de: '/granite',
    cs: '/zula',
  },
  '/konglomeraty-kwarcowe-pacific': {
    pl: '/konglomeraty-kwarcowe-pacific',
    de: '/quarzkonglomerate-pacific',
    cs: '/pacificke-kremenne-konglomeraty',
  },
  '/realizacje': {
    pl: '/realizacje',
    de: '/referenzen',
    cs: '/realizace',
  },
  // Typy nagrobków jako osobne, prerenderowane podstrony galerii.
  // Wartości parametru też są przetłumaczone - patrz `src/data/gallery.ts`.
  '/realizacje/[typ]': {
    pl: '/realizacje/[typ]',
    de: '/referenzen/[typ]',
    cs: '/realizace/[typ]',
  },
  '/wizualizacje': {
    pl: '/wizualizacje',
    de: '/visualisierungen',
    cs: '/vizualizace',
  },
  '/wizualizacja-kuchni': {
    pl: '/wizualizacja-kuchni',
    de: '/kuechenvisualisierung',
    cs: '/vizualizace-kuchyne',
  },
  '/faq': {
    pl: '/faq',
    de: '/faq',
    cs: '/faq',
  },
  '/kontakt': {
    pl: '/kontakt',
    de: '/kontakt',
    cs: '/kontakt',
  },
  '/polityka-prywatnosci-i-cookies': {
    pl: '/polityka-prywatnosci-i-cookies',
    de: '/datenschutz',
    cs: '/ochrana-osobnich-udaju',
  },
} satisfies Record<string, string | Record<Locale, string>>;

export type AppPathname = keyof typeof pathnames;

/**
 * Ścieżki bez segmentów dynamicznych. Do `Link href="..."` w formie stringa
 * nadają się tylko takie - trasy z parametrem (`/kamieniarstwo/[city]`)
 * wymagają formy obiektowej z `params`.
 */
export type StaticAppPathname = Exclude<
  AppPathname,
  `${string}[${string}]${string}`
>;

export const routing = defineRouting({
  locales,
  defaultLocale,
  // Polska wersja zostaje w katalogu głównym, DE i CS dostają prefiks - tak samo
  // jak na obecnej stronie, więc stare linki i wizytówki nadal działają.
  localePrefix: 'as-needed',
  localeDetection: true,
  pathnames,
});
