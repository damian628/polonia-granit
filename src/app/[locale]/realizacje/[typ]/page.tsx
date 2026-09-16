import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { CtaBanner } from '@/components/home/cta-banner';
import { PhotoGrid } from '@/components/gallery/photo-grid';
import { PageHero } from '@/components/page/page-hero';
import { Container } from '@/components/ui/container';
import { ArrowRightIcon } from '@/components/ui/icons';
import {
  galleryTypes,
  imagesForType,
  typeBySlug,
  type GalleryType,
} from '@/data/gallery';
import { Link } from '@/i18n/navigation';
import { locales, type Locale } from '@/i18n/routing';
import { buildPageMetadata } from '@/lib/metadata';

type PageProps = { params: Promise<{ locale: Locale; typ: string }> };

/**
 * Prerenderujemy każdy typ w każdym języku - razem 30 statycznych stron.
 * Slug jest przetłumaczony, więc parametr też różni się między językami.
 */
export function generateStaticParams() {
  return locales.flatMap((locale) =>
    galleryTypes.map((type) => ({ locale, typ: type.slugs[locale] })),
  );
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale, typ } = await params;
  const type = typeBySlug(typ, locale);
  if (!type) return {};

  const t = await getTranslations({ locale, namespace: 'gallery' });
  const name = t(`types.${type.id}.name`);

  return buildPageMetadata({
    // Każdy język dostaje swój slug, inaczej `hreflang` wskazywałby polski.
    href: (candidate) => ({
      pathname: '/realizacje/[typ]',
      params: { typ: type.slugs[candidate] },
    }),
    locale,
    title: t('typeMetaTitle', { type: name }),
    description: t(`types.${type.id}.description`),
  });
}

export default async function Page({ params }: PageProps) {
  const { locale, typ } = await params;
  setRequestLocale(locale);

  const type = typeBySlug(typ, locale);
  if (!type) notFound();

  const images = imagesForType(type);
  const t = await getTranslations('gallery');
  const name = t(`types.${type.id}.name`);

  return (
    <>
      <PageHero
        title={name}
        lead={t(`types.${type.id}.description`)}
        breadcrumb={name}
        image={images[0]}
      />

      <section className="bg-stone-50 py-14 lg:py-20">
        <Container size="wide">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm text-stone-500">
              {t('countLabel', { count: images.length })}
            </p>
            <Link
              href="/realizacje"
              className="group inline-flex items-center gap-2 text-sm text-brass-600 transition-colors hover:text-brass-500"
            >
              {t('backToAll')}
              <ArrowRightIcon
                width={16}
                height={16}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </div>

          <div className="mt-8">
            <PhotoGrid
              images={images}
              alt={(index) => t('photoAlt', { type: name, index: index + 1 })}
              hint={t('lightbox.openHint')}
            />
          </div>

          <p className="mt-12 max-w-3xl text-sm leading-relaxed text-stone-500">
            {t('note')}
          </p>

          <SiblingTypes current={type} locale={locale} />
        </Container>
      </section>

      <CtaBanner />
    </>
  );
}

/** Linki do pozostałych typów - trzymają użytkownika w galerii i pomagają SEO. */
async function SiblingTypes({
  current,
  locale,
}: {
  current: GalleryType;
  locale: Locale;
}) {
  const t = await getTranslations('gallery');
  const others = galleryTypes.filter(
    (type) => type.id !== current.id && imagesForType(type).length > 0,
  );

  return (
    <nav aria-label={t('typesTitle')} className="mt-14 border-t border-ink-900/10 pt-8">
      <ul className="flex flex-wrap gap-2">
        {others.map((type) => (
          <li key={type.id}>
            <Link
              href={{
                pathname: '/realizacje/[typ]',
                params: { typ: type.slugs[locale] },
              }}
              className="inline-flex items-center gap-2 rounded-full border border-ink-900/12 bg-white px-4 py-2 text-sm text-ink-700 transition-colors hover:border-ink-900/30"
            >
              {t(`types.${type.id}.name`)}
              <span className="text-xs text-stone-400">
                {imagesForType(type).length}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
