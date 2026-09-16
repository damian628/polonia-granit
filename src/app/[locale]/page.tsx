import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { Advantages } from '@/components/home/advantages';
import { AreasSection } from '@/components/home/areas-section';
import { HomeContactSection } from '@/components/home/contact-section';
import { Hero } from '@/components/home/hero';
import { IntroSection } from '@/components/home/intro-section';
import { KitchenVizSection } from '@/components/home/kitchen-viz-section';
import { MaterialsSection } from '@/components/home/materials-section';
import { OfferGrid } from '@/components/home/offer-grid';
import { ReviewsSection } from '@/components/home/reviews-section';
import { StatsBand } from '@/components/home/stats-band';
import { WholesaleSection } from '@/components/home/wholesale-section';
import type { Locale } from '@/i18n/routing';
import { buildPageMetadata } from '@/lib/metadata';

type PageProps = { params: Promise<{ locale: Locale }> };

export const maxDuration = 120;

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'home' });
  const tm = await getTranslations({ locale, namespace: 'meta' });

  return buildPageMetadata({
    href: '/',
    locale,
    title: `${tm('siteName')} — ${tm('tagline')}`,
    description: t('hero.subtitle'),
  });
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <IntroSection />
      <OfferGrid />
      <MaterialsSection />
      <KitchenVizSection />
      <Advantages />
      <StatsBand />
      <ReviewsSection />
      <WholesaleSection />
      <AreasSection />
      <HomeContactSection />
    </>
  );
}
