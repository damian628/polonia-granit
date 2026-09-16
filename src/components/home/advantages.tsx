import { useTranslations } from 'next-intl';

import { Container } from '@/components/ui/container';
import {
  CheckIcon,
  ClockIcon,
  GlobeIcon,
  PinIcon,
  StarIcon,
} from '@/components/ui/icons';
import { SectionHeading } from '@/components/ui/section-heading';
import { yearsOnMarket } from '@/lib/site';

const items = [
  { key: 'quality', Icon: StarIcon },
  { key: 'range', Icon: GlobeIcon },
  { key: 'experience', Icon: ClockIcon },
  { key: 'wholesale', Icon: PinIcon },
  { key: 'measurement', Icon: CheckIcon },
  { key: 'installation', Icon: CheckIcon },
] as const;

export function Advantages() {
  const t = useTranslations('home.advantages');

  return (
    <section className="bg-stone-100 py-20 lg:py-28">
      <Container size="wide">
        <SectionHeading eyebrow={t('eyebrow')} title={t('title')} />

        <ul className="mt-14 grid gap-x-10 gap-y-11 sm:grid-cols-2 lg:grid-cols-3">
          {items.map(({ key, Icon }) => (
            <li key={key} className="reveal">
              <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-white text-brass-600 shadow-sm">
                <Icon width={22} height={22} />
              </span>
              <h3 className="mt-5 text-xl text-ink-900">
                {t(`items.${key}.title`, { years: yearsOnMarket })}
              </h3>
              <p className="mt-3 leading-relaxed text-ink-600">
                {t(`items.${key}.description`)}
              </p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
