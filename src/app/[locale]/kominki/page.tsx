import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';

import {
  buildOfferMetadata,
  OfferPage,
  type OfferPageConfig,
} from '@/components/page/offer-page';
import type { Locale } from '@/i18n/routing';

const config: OfferPageConfig = {
  productKey: 'fireplaces',
  href: '/kominki',
  hero: { category: 'hero', slug: 'kominki' },
  body: { category: 'oferta/kominki', slug: '12' },
  galleryCategory: '',
};

type PageProps = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return buildOfferMetadata(config, locale);
}

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <OfferPage config={config} />;
}
