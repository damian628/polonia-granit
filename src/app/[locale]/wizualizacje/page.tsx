import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { PhotoGrid } from '@/components/gallery/photo-grid';
import { CtaBanner } from '@/components/home/cta-banner';
import { PageHero } from '@/components/page/page-hero';
import { buttonStyles } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { imageBySlug, imagesIn } from '@/data/images';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { buildPageMetadata } from '@/lib/metadata';

type PageProps = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'visualisations' });

  return buildPageMetadata({
    href: '/wizualizacje',
    locale,
    title: t('metaTitle'),
    description: t('metaDescription'),
  });
}

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('visualisations');
  const tn = await getTranslations('nav');
  // Etykiety lightboxa są wspólne z galerią realizacji.
  const tl = await getTranslations('gallery.lightbox');
  const images = imagesIn('wizualizacje');
  const hero =
    imageBySlug('wizualizacje', 'astral-mist-application-image') ?? images[0];

  return (
    <>
      <PageHero
        title={t('title')}
        lead={t('lead')}
        breadcrumb={tn('visualisations')}
        image={hero}
      />

      <section className="bg-stone-50 py-14 lg:py-20">
        <Container size="wide">
          <p className="reveal max-w-3xl text-lg leading-relaxed text-ink-600">
            {t('body')}
          </p>

          <div className="mt-10">
            <PhotoGrid
              images={images}
              alt={(index) => `${t('title')} — ${index + 1}`}
              hint={tl('openHint')}
            />
          </div>

          <div className="mt-12 flex flex-wrap items-center gap-6">
            <Link
              href="/konglomeraty-kwarcowe-pacific"
              className={buttonStyles('secondary', 'md')}
            >
              {t('stonesCta')}
            </Link>
            <p className="text-sm text-stone-500">{t('note')}</p>
          </div>
        </Container>
      </section>

      <CtaBanner />
    </>
  );
}
