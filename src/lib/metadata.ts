import type { Metadata } from 'next';

import { getPathname } from '@/i18n/navigation';
import { defaultLocale, locales, type Locale } from '@/i18n/routing';
import { site } from '@/lib/site';

type Href = Parameters<typeof getPathname>[0]['href'];

/**
 * Adres podstrony. Trasy z parametrem podajemy jako funkcję, bo wartość
 * parametru też bywa przetłumaczona (`/referenzen/doppelgraeber`) - inaczej
 * `hreflang` wskazywałby polski slug we wszystkich językach.
 */
type HrefInput = Href | ((locale: Locale) => Href);

function hrefFor(href: HrefInput, locale: Locale): Href {
  return typeof href === 'function' ? href(locale) : href;
}

/**
 * Buduje `canonical` oraz pełny zestaw `hreflang` dla podstrony.
 * Każda wersja językowa wskazuje na swój odpowiednik, a `x-default`
 * na polską - to ona stoi w katalogu głównym domeny.
 */
export function buildAlternates(
  href: HrefInput,
  locale: Locale,
): NonNullable<Metadata['alternates']> {
  const languages: Record<string, string> = {};

  for (const candidate of locales) {
    languages[candidate] =
      `${site.url}${getPathname({ href: hrefFor(href, candidate), locale: candidate })}`;
  }

  languages['x-default'] = languages[defaultLocale];

  return {
    canonical: `${site.url}${getPathname({ href: hrefFor(href, locale), locale })}`,
    languages,
  };
}

type PageMetadataInput = {
  href: HrefInput;
  locale: Locale;
  title: string;
  description: string;
  /** Ścieżka do obrazu w `public/`, np. `/og/nagrobki.jpg`. */
  image?: string;
};

export function buildPageMetadata({
  href,
  locale,
  title,
  description,
  image = '/og/default.jpg',
}: PageMetadataInput): Metadata {
  const alternates = buildAlternates(href, locale);
  const url = alternates.canonical as string;

  return {
    title,
    description,
    alternates,
    openGraph: {
      type: 'website',
      siteName: site.name,
      locale,
      title,
      description,
      url,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}
