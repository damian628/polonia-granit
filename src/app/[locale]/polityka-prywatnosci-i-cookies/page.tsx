import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { PageHero } from '@/components/page/page-hero';
import { Container } from '@/components/ui/container';
import type { Locale } from '@/i18n/routing';
import { buildPageMetadata } from '@/lib/metadata';
import { fullAddress, site } from '@/lib/site';

const sectionKeys = [
  'controller',
  'data',
  'purpose',
  'retention',
  'recipients',
  'visualization',
  'cookies',
  'rights',
  'changes',
  'contact',
] as const;

type PageProps = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'privacy' });

  return {
    ...buildPageMetadata({
      href: '/polityka-prywatnosci-i-cookies',
      locale,
      title: t('metaTitle'),
      description: t('metaDescription'),
    }),
    // Dokument prawny nie ma po co konkurować w wynikach z podstronami oferty.
    // Zostaje dostępny i podlinkowany w stopce, ale poza indeksem.
    robots: { index: false, follow: true },
  };
}

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('privacy');
  const tn = await getTranslations('nav');

  // Nazwa, adres, NIP i e-mail wchodzą do treści z `site.ts`, żeby dokument
  // nie rozjechał się z danymi w stopce po zmianie któregokolwiek z nich.
  const values = {
    legalName: site.legalName,
    address: fullAddress,
    taxId: site.taxId,
    email: site.email,
  };

  return (
    <>
      <PageHero title={t('title')} lead={t('lead')} breadcrumb={tn('privacy')} />

      <section className="bg-white py-16 lg:py-24">
        <Container size="narrow">
          <div className="space-y-10">
            {sectionKeys.map((key, index) => (
              <article key={key} className="reveal">
                <h2 className="text-xl text-ink-900">
                  <span className="mr-2 text-brass-600">{index + 1}.</span>
                  {t(`sections.${key}.title`)}
                </h2>
                <p className="mt-3 leading-relaxed text-ink-600">
                  {t(`sections.${key}.body`, values)}
                </p>
              </article>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
