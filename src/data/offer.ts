import type { StaticAppPathname } from '@/i18n/routing';

/**
 * Pięć grup wyrobów. `messageKey` wskazuje wpis w `home.offer.items`
 * oraz w `nav`, a `image` konkretne zdjęcie z manifestu.
 *
 * Blaty nadal biorą kadr z aranżacji PACIFIC. Parapety mają własne zdjęcie
 * parapetu granitowego (`oferta/parapety`).
 */
export type OfferItem = {
  messageKey: string;
  href: StaticAppPathname;
  imageCategory: string;
  imageSlug: string;
  /** Kategoria awaryjna, jeśli zdjęcia zabraknie w manifeście. */
  fallbackCategory: string;
};

export const offerItems: OfferItem[] = [
  {
    messageKey: 'tombstones',
    href: '/nagrobki-granitowe',
    imageCategory: 'realizacje/nowoczesne',
    imageSlug: 'n1-1',
    fallbackCategory: 'realizacje/grobowce',
  },
  {
    messageKey: 'countertops',
    href: '/blaty',
    imageCategory: 'wizualizacje',
    imageSlug: 'bellagio-application-image',
    fallbackCategory: 'oferta/blaty',
  },
  {
    messageKey: 'windowsills',
    href: '/parapety-granitowe',
    imageCategory: 'oferta/parapety',
    imageSlug: 'parapet-granitowy',
    fallbackCategory: 'kamienie/granity',
  },
  {
    messageKey: 'stairs',
    href: '/schody-granitowe',
    imageCategory: 'oferta/schody',
    imageSlug: 'depositphotos-321089732-s',
    fallbackCategory: 'wizualizacje',
  },
  {
    messageKey: 'fireplaces',
    href: '/kominki',
    imageCategory: 'oferta/kominki',
    imageSlug: '12',
    fallbackCategory: 'wizualizacje',
  },
];
