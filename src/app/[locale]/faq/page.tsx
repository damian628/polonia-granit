import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { CtaBanner } from '@/components/home/cta-banner';
import { PageHero } from '@/components/page/page-hero';
import { Container } from '@/components/ui/container';
import { ChevronDownIcon } from '@/components/ui/icons';
import { pickImage } from '@/data/images';
import type { Locale } from '@/i18n/routing';
import { buildPageMetadata } from '@/lib/metadata';

/**
 * Pytania dobrane do tego, co firma faktycznie deklaruje na starej stronie
 * (pomiar, montaż w trzech krajach, własna hurtownia, wykończenia).
 *
 * TODO: po rozmowie z klientem warto dopisać terminy realizacji, zakres
 * gwarancji i zasady zaliczki - tych danych nie ma skąd wziąć bez potwierdzenia.
 */
const questionKeys = [
  'measure',
  'abroad',
  'granite',
  'finishes',
  'warehouse',
  'quote',
  'care',
  'wholesale',
] as const;

type PageProps = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'faq' });

  return buildPageMetadata({
    href: '/faq',
    locale,
    title: t('metaTitle'),
    description: t('metaDescription'),
  });
}

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('faq');
  const tn = await getTranslations('nav');

  const questions = questionKeys.map((key) => ({
    key,
    q: t(`items.${key}.q`),
    a: t(`items.${key}.a`),
  }));

  return (
    <>
      <PageHero
        title={t('title')}
        lead={t('lead')}
        breadcrumb={tn('faq')}
        image={pickImage('hero', 3)}
      />

      <FaqSchema questions={questions} />

      <section className="bg-white py-16 lg:py-24">
        <Container size="narrow">
          <ul className="space-y-3">
            {questions.map(({ key, q, a }) => (
              <li key={key} className="reveal">
                {/* Rozwijanie oparte o `<details>` - działa bez JavaScriptu
                    i zostaje otwarte przy wyszukiwaniu w treści strony (Ctrl+F). */}
                <details className="group rounded-lg border border-ink-900/10 bg-stone-50 px-6 open:bg-white">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-lg text-ink-900 marker:content-none">
                    {q}
                    <ChevronDownIcon
                      width={20}
                      height={20}
                      className="shrink-0 text-brass-600 transition-transform duration-300 group-open:rotate-180"
                    />
                  </summary>
                  <p className="pb-6 leading-relaxed text-ink-600">{a}</p>
                </details>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <CtaBanner title={t('ctaTitle')} body={t('ctaBody')} />
    </>
  );
}

/**
 * Dane strukturalne FAQPage. Google potrafi z nich zbudować rozwijane pytania
 * w wynikach - przy zapytaniach typu „nagrobek Niemcy przepisy” to darmowe
 * miejsce na stronie wyników.
 */
function FaqSchema({
  questions,
}: {
  questions: Array<{ q: string; a: string }>;
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };

  return (
    <script
      type="application/ld+json"
      // Treść pochodzi z plików tłumaczeń, nie od użytkownika.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
