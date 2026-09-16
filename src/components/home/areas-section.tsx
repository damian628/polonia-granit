import { useTranslations } from 'next-intl';

import { Container } from '@/components/ui/container';
import { PinIcon } from '@/components/ui/icons';
import { SectionHeading } from '@/components/ui/section-heading';
import { countryLabels, servedCities } from '@/data/cities';

export function AreasSection() {
  const t = useTranslations('home.areas');

  return (
    <section className="bg-white pt-20 pb-4 lg:pt-28">
      <Container size="wide">
        <SectionHeading
          eyebrow={t('eyebrow')}
          title={t('title')}
          subtitle={t('subtitle')}
        />

        <ul className="reveal mt-10 flex flex-wrap gap-2">
          {servedCities.map((city) => (
            <li
              key={city.name}
              className="inline-flex items-center gap-2 rounded-full border border-ink-900/10 bg-stone-50 px-4 py-2 text-sm text-ink-700"
            >
              <PinIcon width={14} height={14} className="text-brass-600" />
              {city.name}
              <span className="text-xs tracking-wider text-stone-400">
                {countryLabels[city.country]}
              </span>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
