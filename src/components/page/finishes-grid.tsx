import { useTranslations } from 'next-intl';

import { buttonStyles } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { SectionHeading } from '@/components/ui/section-heading';
import { Link } from '@/i18n/navigation';

const finishes = [
  'polished',
  'honed',
  'brushed',
  'flamed',
  'leather',
] as const;

/** Wykończenia powierzchni - wspólne dla całej oferty. */
export function FinishesGrid() {
  const t = useTranslations('offer.common');

  return (
    <section className="bg-white py-20 lg:py-28">
      <Container size="wide">
        <SectionHeading
          title={t('finishesTitle')}
          subtitle={t('finishesSubtitle')}
        />

        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {finishes.map((finish) => (
            <li
              key={finish}
              className="reveal rounded-2xl border border-ink-900/8 bg-stone-50 p-6"
            >
              <h3 className="text-lg text-ink-900">
                {t(`finishes.${finish}.title`)}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-600">
                {t(`finishes.${finish}.description`)}
              </p>
            </li>
          ))}
        </ul>

        <Link
          href="/granity"
          className={buttonStyles('secondary', 'md', 'reveal mt-10')}
        >
          {t('stonesCta')}
        </Link>
      </Container>
    </section>
  );
}
