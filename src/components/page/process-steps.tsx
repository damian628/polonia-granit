import { useTranslations } from 'next-intl';

import { Container } from '@/components/ui/container';
import { SectionHeading } from '@/components/ui/section-heading';

const steps = ['talk', 'measure', 'quote', 'production', 'install'] as const;

/** Pięć kroków współpracy - ta sama sekcja na wszystkich podstronach oferty. */
export function ProcessSteps() {
  const t = useTranslations('offer.common');

  return (
    <section className="bg-stone-100 py-20 lg:py-28">
      <Container size="wide">
        <SectionHeading
          title={t('processTitle')}
          subtitle={t('processSubtitle')}
        />

        <ol className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-5 lg:gap-6">
          {steps.map((step, index) => (
            <li key={step} className="reveal">
              <span className="font-display text-5xl leading-none text-brass-400">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-4 text-lg text-ink-900">
                {t(`steps.${step}.title`)}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-600">
                {t(`steps.${step}.description`)}
              </p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
