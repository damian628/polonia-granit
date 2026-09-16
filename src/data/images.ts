import manifest from '@/data/generated/image-manifest.json';

export type SiteImage = {
  src: string;
  width: number;
  height: number;
  blurDataURL: string;
  category: string;
  slug: string;
};

/**
 * Manifest generuje `npm run images:optimize`. Waży kilkaset kilobajtów
 * (głównie miniatury blur), dlatego korzystamy z niego wyłącznie po stronie
 * serwera - do komponentów klienckich nigdy nie przekazujemy całych wpisów.
 */
const images = manifest as SiteImage[];

const byCategory = new Map<string, SiteImage[]>();
for (const image of images) {
  const bucket = byCategory.get(image.category);
  if (bucket) bucket.push(image);
  else byCategory.set(image.category, [image]);
}

export function imagesIn(category: string): SiteImage[] {
  return byCategory.get(category) ?? [];
}

export function imageBySlug(
  category: string,
  slug: string,
): SiteImage | undefined {
  return imagesIn(category).find((image) => image.slug === slug);
}

/**
 * Zdjęcie z podanej kategorii albo - gdy tamta jest pusta - z awaryjnej.
 * Kategorie oferty na starej stronie miały po jednym, dwóch zdjęciach,
 * więc część kafli podpieramy materiałem z galerii realizacji.
 */
export function pickImage(
  category: string,
  index = 0,
  fallbackCategory?: string,
): SiteImage | undefined {
  const primary = imagesIn(category);
  if (primary.length > 0) return primary[index % primary.length];
  if (!fallbackCategory) return undefined;
  const fallback = imagesIn(fallbackCategory);
  return fallback[index % fallback.length];
}

export function requireImage(category: string, slug: string): SiteImage {
  const image = imageBySlug(category, slug);
  if (!image) {
    throw new Error(
      `Brak zdjęcia ${category}/${slug} w manifeście. Uruchom: npm run images:optimize`,
    );
  }
  return image;
}
