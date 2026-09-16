import type { MetadataRoute } from 'next';

import { galleryTypes } from '@/data/gallery';
import { getPathname } from '@/i18n/navigation';
import {
  locales,
  pathnames,
  type Locale,
  type StaticAppPathname,
} from '@/i18n/routing';
import { site } from '@/lib/site';

const skipped: StaticAppPathname[] = ['/polityka-prywatnosci-i-cookies'];

const staticHrefs = (Object.keys(pathnames) as Array<keyof typeof pathnames>)
  .filter((href): href is StaticAppPathname => !href.includes('['))
  .filter((href) => !skipped.includes(href));

function absoluteUrl(
  href: Parameters<typeof getPathname>[0]['href'],
  locale: Locale,
) {
  const path = getPathname({ href, locale });
  const withSlash = path.endsWith('/') ? path : `${path}/`;
  return `${site.url}${withSlash}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const href of staticHrefs) {
    const languages: Record<string, string> = {};
    for (const locale of locales) {
      languages[locale] = absoluteUrl(href, locale);
    }
    languages['x-default'] = languages.pl;

    for (const locale of locales) {
      entries.push({
        url: languages[locale],
        lastModified: new Date(),
        changeFrequency: href === '/' ? 'weekly' : 'monthly',
        priority: href === '/' ? 1 : 0.7,
        alternates: { languages },
      });
    }
  }

  for (const type of galleryTypes) {
    const languages: Record<string, string> = {};
    for (const locale of locales) {
      languages[locale] = absoluteUrl(
        { pathname: '/realizacje/[typ]', params: { typ: type.slugs[locale] } },
        locale,
      );
    }
    languages['x-default'] = languages.pl;

    for (const locale of locales) {
      entries.push({
        url: languages[locale],
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
        alternates: { languages },
      });
    }
  }

  return entries;
}
