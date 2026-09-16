import type { Locale } from '@/i18n/routing';
import { imagesIn, type SiteImage } from '@/data/images';

/**
 * Typy nagrobków. Na starej stronie każdy był osobną podstroną schowaną
 * pod czterema poziomami menu. Teraz to podstrony galerii - dzięki temu każdy
 * typ zachowuje własny adres i pozycję w wyszukiwarce, a filtrowanie nie
 * wymaga ani jednej linii JavaScriptu.
 *
 * Slugi są przetłumaczone, bo klient z Görlitz szuka „Doppelgräber”,
 * nie „podwojne”.
 */
export type GalleryType = {
  id: string;
  /** Katalog w `public/img/**` z zdjęciami tego typu. */
  category: string;
  slugs: Record<Locale, string>;
};

export const galleryTypes: GalleryType[] = [
  {
    id: 'nowoczesne',
    category: 'realizacje/nowoczesne',
    slugs: {
      pl: 'nowoczesne',
      de: 'moderne-grabsteine',
      cs: 'moderni-nahrobky',
    },
  },
  {
    id: 'grobowce',
    category: 'realizacje/grobowce',
    slugs: { pl: 'grobowce', de: 'mausoleen', cs: 'mauzolea' },
  },
  {
    id: 'ziemne',
    category: 'realizacje/ziemne',
    slugs: { pl: 'ziemne', de: 'erdgraeber', cs: 'hroby-v-zemi' },
  },
  {
    id: 'podwojne',
    category: 'realizacje/podwojne',
    slugs: { pl: 'podwojne', de: 'doppelgraeber', cs: 'dvojite-hroby' },
  },
  {
    id: 'ukosne',
    category: 'realizacje/ukosne',
    slugs: { pl: 'ukosne', de: 'schraege-grabsteine', cs: 'sikme-nahrobky' },
  },
  {
    id: 'urnowe',
    category: 'realizacje/urnowe',
    slugs: { pl: 'urnowe', de: 'urnengraeber', cs: 'urnove-hroby' },
  },
  {
    id: 'dzieciece',
    category: 'realizacje/dzieciece',
    slugs: { pl: 'dzieciece', de: 'kindergrabsteine', cs: 'detske-nahrobky' },
  },
  {
    id: 'niemieckie',
    category: 'realizacje/niemieckie',
    slugs: {
      pl: 'niemieckie',
      de: 'deutsche-grabsteine',
      cs: 'nemecke-nahrobky',
    },
  },
  {
    id: 'czeskie',
    category: 'realizacje/czeskie',
    slugs: {
      pl: 'czeskie',
      de: 'tschechische-grabsteine',
      cs: 'ceske-nahrobky',
    },
  },
  {
    id: 'blaty',
    category: 'realizacje/blaty',
    slugs: { pl: 'blaty', de: 'arbeitsplatten', cs: 'kuchyne' },
  },
  {
    id: 'schody',
    category: 'realizacje/schody',
    slugs: { pl: 'schody', de: 'treppen', cs: 'schody' },
  },
  {
    id: 'pozostale',
    category: 'realizacje/inne',
    slugs: { pl: 'pozostale', de: 'weitere-arbeiten', cs: 'dalsi-realizace' },
  },
];

export function typeBySlug(
  slug: string,
  locale: Locale,
): GalleryType | undefined {
  return galleryTypes.find((type) => type.slugs[locale] === slug);
}

export function typeById(id: string): GalleryType | undefined {
  return galleryTypes.find((type) => type.id === id);
}

export function imagesForType(type: GalleryType): SiteImage[] {
  return imagesIn(type.category);
}

/** Wszystkie zdjęcia realizacji, w kolejności typów z `galleryTypes`. */
export function allRealisations(): Array<{ type: GalleryType; image: SiteImage }> {
  return galleryTypes.flatMap((type) =>
    imagesForType(type).map((image) => ({ type, image })),
  );
}

export function galleryTypeCount(type: GalleryType): number {
  return imagesForType(type).length;
}
