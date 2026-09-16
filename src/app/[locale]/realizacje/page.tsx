import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { CtaBanner } from '@/components/home/cta-banner';
import { PageHero } from '@/components/page/page-hero';
import { Container } from '@/components/ui/container';
import { SectionHeading } from '@/components/ui/section-heading';
import { SiteImageView } from '@/components/ui/site-image';
import {
  galleryTypeCount,
  galleryTypes,
  imagesForType,
} from '@/data/gallery';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { buildPageMetadata } from '@/lib/metadata';

type PageProps = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'gallery' });

  return buildPageMetadata({
    href: '/realizacje',
    locale,
    title: t('metaTitle'),
    description: t('metaDescription'),
  });
}

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('gallery');
  const tn = await getTranslations('nav');

  // Typy bez zdjęć nie mają czego pokazać - nie wypisujemy pustych kafli.
  const types = galleryTypes.filter((type) => galleryTypeCount(type) > 0);

  return (
    <>
      <PageHero
        title={t('title')}
        lead={t('lead')}
        breadcrumb={tn('gallery')}
        image={imagesForType(types[0])[0]}
      />

      <section className="bg-stone-50 py-16 lg:py-24">
        <Container size="wide">
          <SectionHeading title={t('typesTitle')} />

          <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {types.map((type) => {
              const cover = imagesForType(type)[0];

              return (
                <li key={type.id}>
                  <Link
                    href={{
                      pathname: '/realizacje/[typ]',
                      params: { typ: type.slugs[locale] },
                    }}
                    className="reveal group flex h-full flex-col overflow-hidden rounded-lg bg-white shadow-lift transition-shadow hover:shadow-lg"
                  >
                    <div className="relative aspect-3/2 overflow-hidden bg-stone-200">
                      {cover ? (
                        <SiteImageView
                          image={cover}
                          alt={t(`types.${type.id}.name`)}
                          sizes="(min-width: 1280px) 400px, (min-width: 1024px) 31vw, (min-width: 640px) 47vw, 92vw"
                          className="transition-transform duration-700 ease-out-soft group-hover:scale-[1.05]"
                        />
                      ) : null}
                      <span className="absolute top-3 right-3 rounded-full bg-ink-950/75 px-3 py-1 text-xs text-stone-200">
                        {t('countLabel', { count: galleryTypeCount(type) })}
                      </span>
                    </div>

                    <div className="flex flex-1 flex-col p-6">
                      <h3 className="text-xl text-ink-900 transition-colors group-hover:text-brass-600">
                        {t(`types.${type.id}.name`)}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-ink-600">
                        {t(`types.${type.id}.description`)}
                      </p>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>

          <p className="mt-12 max-w-3xl text-sm leading-relaxed text-stone-500">
            {t('note')}
          </p>
        </Container>
      </section>

      <CtaBanner />
    </>
  );
}
