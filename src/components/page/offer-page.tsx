import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { CtaBanner } from '@/components/home/cta-banner';
import { FeatureList } from '@/components/page/feature-list';
import { FinishesGrid } from '@/components/page/finishes-grid';
import { GalleryStrip } from '@/components/page/gallery-strip';
import { PageHero } from '@/components/page/page-hero';
import { ProcessSteps } from '@/components/page/process-steps';
import { imageBySlug } from '@/data/images';
import type { Locale, StaticAppPathname } from '@/i18n/routing';
import { buildPageMetadata } from '@/lib/metadata';

/**
 * Wspólny szkielet pięciu podstron oferty. Każda różni się tylko treścią
 * z pliku tłumaczeń i doborem zdjęć, więc trzymamy to w jednym miejscu -
 * pliki tras zostają jednolinijkowe.
 */
export type OfferPageConfig = {
  /** Klucz w sekcji `offer` plików tłumaczeń. */
  productKey: string;
  href: StaticAppPathname;
  hero: { category: string; slug: string };
  body: { category: string; slug: string };
  /** Kategoria zdjęć do paska galerii. Pusta - sekcja się nie pojawi. */
  galleryCategory: string;
};

export async function buildOfferMetadata(
  config: OfferPageConfig,
  locale: Locale,
): Promise<Metadata> {
  const t = await getTranslations({
    locale,
    namespace: `offer.${config.productKey}`,
  });

  return buildPageMetadata({
    href: config.href,
    locale,
    title: t('metaTitle'),
    description: t('metaDescription'),
  });
}

export async function OfferPage({ config }: { config: OfferPageConfig }) {
  const t = await getTranslations(`offer.${config.productKey}`);
  const tn = await getTranslations('nav');

  return (
    <>
      <PageHero
        title={t('title')}
        lead={t('lead')}
        breadcrumb={tn(config.productKey)}
        image={imageBySlug(config.hero.category, config.hero.slug)}
      />
      <FeatureList
        productKey={config.productKey}
        body={t('body')}
        image={imageBySlug(config.body.category, config.body.slug)}
      />
      <FinishesGrid />
      <GalleryStrip category={config.galleryCategory} alt={t('title')} />
      <ProcessSteps />
      <CtaBanner />
    </>
  );
}
