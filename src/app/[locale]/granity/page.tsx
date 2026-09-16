import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import {
  CatalogPage,
  catalogConfig,
} from '@/components/stones/catalog-page';
import type { Locale } from '@/i18n/routing';
import { buildPageMetadata } from '@/lib/metadata';

type PageProps = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'granites' });
  const config = catalogConfig('granit');

  return buildPageMetadata({
    href: config.href,
    locale,
    title: t('metaTitle'),
    description: t('metaDescription'),
  });
}

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <CatalogPage material="granit" />;
}
