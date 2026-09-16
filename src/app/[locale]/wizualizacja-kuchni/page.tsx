import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { KitchenVizTool } from '@/components/viz/kitchen-viz-tool';
import { CtaBanner } from '@/components/home/cta-banner';
import { PageHero } from '@/components/page/page-hero';
import { Container } from '@/components/ui/container';
import { imageBySlug, pickImage } from '@/data/images';
import type { Locale } from '@/i18n/routing';
import { buildPageMetadata } from '@/lib/metadata';
import { vizStoneOptions } from '@/lib/viz-stones';

type PageProps = { params: Promise<{ locale: Locale }> };

export const maxDuration = 120;

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'kitchenViz' });

  return buildPageMetadata({
    href: '/wizualizacja-kuchni',
    locale,
    title: t('metaTitle'),
    description: t('metaDescription'),
  });
}

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('kitchenViz');
  const tn = await getTranslations('nav');
  const stones = vizStoneOptions();

  return (
    <>
      <PageHero
        title={t('title')}
        lead={t('lead')}
        breadcrumb={tn('kitchenViz')}
        image={
          imageBySlug('wizualizacje', 'ig-andromeda-kuchnia') ??
          pickImage('wizualizacje', 0, 'blaty')
        }
      />

      <section className="bg-stone-50 py-14 lg:py-20">
        <Container size="wide">
          <p className="reveal max-w-3xl text-lg leading-relaxed text-ink-600">
            {t('body')}
          </p>
          <ol className="reveal mt-8 grid gap-4 sm:grid-cols-3">
            {(['photo', 'stone', 'result'] as const).map((step, index) => (
              <li
                key={step}
                className="rounded-lg border border-ink-900/10 bg-white px-5 py-5"
              >
                <span className="text-xs font-semibold tracking-[0.16em] text-brass-600 uppercase">
                  {index + 1}
                </span>
                <p className="mt-2 leading-relaxed text-ink-800">
                  {t(`steps.${step}`)}
                </p>
              </li>
            ))}
          </ol>

          <div className="reveal mt-10 rounded-2xl border border-ink-900/10 bg-white p-5 sm:p-8">
            <KitchenVizTool stones={stones} />
          </div>

          <p className="mt-6 max-w-3xl text-sm leading-relaxed text-stone-500">
            {t('disclaimer')}
          </p>
        </Container>
      </section>

      <CtaBanner title={t('ctaTitle')} body={t('ctaBody')} />
    </>
  );
}
