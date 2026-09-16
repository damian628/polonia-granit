import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { Advantages } from '@/components/home/advantages';
import { CtaBanner } from '@/components/home/cta-banner';
import { StatsBand } from '@/components/home/stats-band';
import { PageHero } from '@/components/page/page-hero';
import { ProcessSteps } from '@/components/page/process-steps';
import { Container } from '@/components/ui/container';
import { CheckIcon } from '@/components/ui/icons';
import { SectionHeading } from '@/components/ui/section-heading';
import { SiteImageView } from '@/components/ui/site-image';
import { imagesIn, pickImage } from '@/data/images';
import type { Locale } from '@/i18n/routing';
import { buildPageMetadata } from '@/lib/metadata';

const offerKeys = [
  'tombstones',
  'windowsills',
  'stairs',
  'countertops',
  'fireplaces',
  'more',
] as const;

type PageProps = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'about' });

  return buildPageMetadata({
    href: '/o-firmie',
    locale,
    title: t('metaTitle'),
    description: t('metaDescription'),
  });
}

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('about');
  const tn = await getTranslations('nav');

  const portrait = pickImage('firma', 0, 'hero');
  const workshop = imagesIn('firma').slice(1, 5);

  return (
    <>
      <PageHero
        title={t('title')}
        lead={t('lead')}
        breadcrumb={tn('about')}
        image={pickImage('firma', 2, 'hero')}
      />

      <section className="bg-white py-16 lg:py-24">
        <Container size="wide">
          <div className="grid items-start gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
            <div className="reveal space-y-5 text-lg leading-relaxed text-ink-600">
              <p>{t('body1')}</p>
              <p>{t('body2')}</p>
              <p>{t('body3')}</p>
            </div>

            <div className="reveal">
              {portrait ? (
                <div className="mb-8 overflow-hidden rounded-lg bg-stone-200">
                  <div className="aspect-4/3">
                    <SiteImageView
                      image={portrait}
                      alt={t('title')}
                      sizes="(min-width: 1024px) 460px, 92vw"
                    />
                  </div>
                </div>
              ) : null}

              <h2 className="text-xl text-ink-900">{t('offerTitle')}</h2>
              <ul className="mt-4 space-y-2.5">
                {offerKeys.map((key) => (
                  <li key={key} className="flex items-start gap-3 text-ink-700">
                    <CheckIcon
                      width={18}
                      height={18}
                      className="mt-1 shrink-0 text-brass-600"
                    />
                    {t(`offerItems.${key}`)}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {workshop.length === 4 ? (
        <section className="bg-stone-50 py-16 lg:py-24">
          <Container size="wide">
            <SectionHeading
              title={t('galleryTitle')}
              subtitle={t('gallerySubtitle')}
            />
            <ul className="mt-12 grid grid-cols-2 gap-3 lg:grid-cols-4">
              {workshop.map((image, index) => (
                <li
                  key={image.src}
                  className="reveal-zoom overflow-hidden rounded-lg bg-stone-200"
                >
                  <div className="aspect-square">
                    <SiteImageView
                      image={image}
                      alt={`${t('galleryTitle')} — ${index + 1}`}
                      sizes="(min-width: 1280px) 300px, (min-width: 640px) 24vw, 47vw"
                    />
                  </div>
                </li>
              ))}
            </ul>
          </Container>
        </section>
      ) : null}

      <StatsBand />
      <Advantages />
      <ProcessSteps />
      <CtaBanner />
    </>
  );
}
