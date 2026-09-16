'use client';

import { useState, type ReactNode } from 'react';
import { useTranslations } from 'next-intl';

import { Container } from '@/components/ui/container';
import { colorOrder, type StoneColor } from '@/data/stones';
import { cn } from '@/lib/cn';

/** Liczba kamieni per kolor - jedyne dane katalogu, jakie trafiają do JS-u. */
export type StoneColorCounts = Partial<Record<StoneColor, number>>;

type StoneFiltersProps = {
  /** Kafle kamieni, wyrenderowane po stronie serwera. */
  children: ReactNode;
  counts: StoneColorCounts;
  swatches: Partial<Record<StoneColor, string>>;
};

/**
 * Filtrowanie po kolorze bez przesyłania danych kamieni do przeglądarki.
 *
 * Kafle przychodzą tu jako `children` wyrenderowane na serwerze. Ten komponent
 * przestawia tylko atrybut na opakowaniu, a ukrywaniem kafli zajmuje się CSS
 * (reguły `[data-stone-filter-color]` w `globals.css`).
 */
export function StoneFilters({ children, counts, swatches }: StoneFiltersProps) {
  const [color, setColor] = useState<StoneColor | 'all'>('all');
  const t = useTranslations('stones');

  const availableColors = colorOrder.filter((entry) => counts[entry]);
  const visibleCount =
    color === 'all'
      ? Object.values(counts).reduce((sum, n) => sum + (n ?? 0), 0)
      : (counts[color] ?? 0);

  return (
    <section className="bg-stone-50 py-16 lg:py-20">
      <Container size="wide">
        <fieldset>
          <legend className="mb-3 text-xs font-semibold tracking-[0.18em] text-stone-500 uppercase">
            {t('filterColor')}
          </legend>
          <div className="flex flex-wrap gap-2">
            <FilterChip active={color === 'all'} onClick={() => setColor('all')}>
              {t('all')}
            </FilterChip>
            {availableColors.map((entry) => (
              <FilterChip
                key={entry}
                active={color === entry}
                onClick={() => setColor(entry)}
              >
                <span
                  aria-hidden="true"
                  className="size-3 rounded-full ring-1 ring-ink-900/15"
                  style={{ backgroundColor: swatches[entry] }}
                />
                {t(`colors.${entry}`)}
                <span className="text-xs text-stone-400">{counts[entry]}</span>
              </FilterChip>
            ))}
          </div>
        </fieldset>

        {color !== 'all' ? (
          <button
            type="button"
            onClick={() => setColor('all')}
            className="mt-5 text-sm text-brass-600 underline underline-offset-4 transition-colors hover:text-brass-500"
          >
            {t('reset')}
          </button>
        ) : null}

        <div data-stone-filter-color={color} className="mt-12">
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {children}
          </ul>
        </div>

        {visibleCount === 0 ? (
          <p className="mt-8 text-ink-600">{t('empty')}</p>
        ) : null}

        <p className="mt-10 max-w-2xl text-sm text-stone-500">
          {t('sampleNote')}
        </p>
      </Container>
    </section>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors',
        active
          ? 'border-ink-900 bg-ink-900 text-stone-50'
          : 'border-ink-900/12 bg-white text-ink-700 hover:border-ink-900/30',
      )}
    >
      {children}
    </button>
  );
}
