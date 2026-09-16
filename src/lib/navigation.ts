import type { StaticAppPathname } from '@/i18n/routing';

/**
 * Menu spłaszczone do dwóch poziomów. Stara strona miała cztery poziomy
 * zagnieżdżenia (Nagrobki > Pojedyncze > Grobowce > ...), co na telefonie było
 * nieobsługiwalne. Typy nagrobków są teraz filtrami w galerii realizacji.
 */

export type NavLink = {
  /** Klucz w pliku tłumaczeń, sekcja `nav`. */
  key: string;
  href: StaticAppPathname;
};

export type NavGroup = {
  key: string;
  href?: StaticAppPathname;
  children: NavLink[];
};

export type NavItem = NavLink | NavGroup;

export const mainNav: NavItem[] = [
  { key: 'about', href: '/o-firmie' },
  {
    key: 'offer',
    children: [
      { key: 'tombstones', href: '/nagrobki-granitowe' },
      { key: 'countertops', href: '/blaty' },
      { key: 'windowsills', href: '/parapety-granitowe' },
      { key: 'stairs', href: '/schody-granitowe' },
      { key: 'fireplaces', href: '/kominki' },
    ],
  },
  {
    key: 'materials',
    children: [
      { key: 'granites', href: '/granity' },
      { key: 'conglomerates', href: '/konglomeraty-kwarcowe-pacific' },
      { key: 'kitchenViz', href: '/wizualizacja-kuchni' },
      { key: 'visualisations', href: '/wizualizacje' },
    ],
  },
  { key: 'gallery', href: '/realizacje' },
  { key: 'faq', href: '/faq' },
  { key: 'contact', href: '/kontakt' },
];

export function isNavGroup(item: NavItem): item is NavGroup {
  return 'children' in item;
}

/** Linki w stopce, kolumna "Oferta". */
export const footerOfferLinks: NavLink[] = [
  { key: 'tombstones', href: '/nagrobki-granitowe' },
  { key: 'countertops', href: '/blaty' },
  { key: 'windowsills', href: '/parapety-granitowe' },
  { key: 'stairs', href: '/schody-granitowe' },
  { key: 'fireplaces', href: '/kominki' },
];

/** Linki w stopce, kolumna "Firma". */
export const footerCompanyLinks: NavLink[] = [
  { key: 'about', href: '/o-firmie' },
  { key: 'granites', href: '/granity' },
  { key: 'conglomerates', href: '/konglomeraty-kwarcowe-pacific' },
  { key: 'kitchenViz', href: '/wizualizacja-kuchni' },
  { key: 'gallery', href: '/realizacje' },
  { key: 'faq', href: '/faq' },
  { key: 'contact', href: '/kontakt' },
  { key: 'privacy', href: '/polityka-prywatnosci-i-cookies' },
];
