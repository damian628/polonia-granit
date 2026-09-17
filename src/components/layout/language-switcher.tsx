'use client';

import { useParams } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';

import { ChevronDownIcon, GlobeIcon } from '@/components/ui/icons';
import { typeBySlug } from '@/data/gallery';
import { Link, usePathname } from '@/i18n/navigation';
import { locales, type Locale } from '@/i18n/routing';
import { cn } from '@/lib/cn';

const labels: Record<Locale, { short: string; full: string }> = {
  pl: { short: 'PL', full: 'Polski' },
  de: { short: 'DE', full: 'Deutsch' },
  cs: { short: 'CS', full: 'Čeština' },
};

/**
 * Przełącznik prowadzi na odpowiednik bieżącej podstrony w innym języku,
 * a nie na stronę główną - `usePathname` z next-intl zwraca wewnętrzny wzorzec
 * ścieżki, więc `/de/arbeitsplatten` po przełączeniu na czeski trafia
 * na `/cs/kuchynske-desky`.
 */
export function LanguageSwitcher({ tone = 'dark' }: { tone?: 'dark' | 'light' }) {
  const pathname = usePathname();
  const params = useParams();
  const activeLocale = useLocale() as Locale;
  const t = useTranslations('nav');
  const isLight = tone === 'light';

  return (
    <div className="group relative">
      <button
        type="button"
        aria-label={t('changeLanguage')}
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium transition-colors',
          isLight
            ? 'text-stone-200 hover:bg-white/10 hover:text-white'
            : 'text-ink-700 hover:bg-ink-900/5 hover:text-ink-900',
        )}
      >
        <GlobeIcon width={17} height={17} />
        {labels[activeLocale].short}
        <ChevronDownIcon
          width={15}
          height={15}
          className="transition-transform duration-300 group-hover:rotate-180"
        />
      </button>

      <div
        className={cn(
          'invisible absolute top-full right-0 z-50 min-w-[10rem] translate-y-1 rounded-2xl border border-ink-900/10 bg-white p-1.5 opacity-0 shadow-lift transition-all duration-200',
          'group-hover:visible group-hover:translate-y-0 group-hover:opacity-100',
          'group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100',
        )}
      >
        {locales.map((locale) => (
          <Link
            key={locale}
            // `pathname` to wewnętrzny wzorzec (np. `/realizacje/[typ]`).
            // Wartość `[typ]` też jest przetłumaczona, więc przy zmianie języka
            // podstawiamy slug docelowy — inaczej DE `doppelgraeber` ląduje
            // na polskim `/realizacje/doppelgraeber` i kończy się 404.
            href={hrefForLocale(pathname, params, activeLocale, locale)}
            locale={locale}
            hrefLang={locale}
            className={cn(
              'flex items-center justify-between rounded-xl px-3 py-2 text-sm transition-colors',
              locale === activeLocale
                ? 'bg-stone-100 font-medium text-ink-900'
                : 'text-ink-600 hover:bg-stone-100 hover:text-ink-900',
            )}
          >
            {labels[locale].full}
            <span className="text-xs tracking-wider text-stone-400">
              {labels[locale].short}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

function hrefForLocale(
  pathname: ReturnType<typeof usePathname>,
  params: ReturnType<typeof useParams>,
  fromLocale: Locale,
  toLocale: Locale,
): Parameters<typeof Link>[0]['href'] {
  if (pathname === '/realizacje/[typ]') {
    const typ = typeof params.typ === 'string' ? params.typ : undefined;
    const type = typ ? typeBySlug(typ, fromLocale) : undefined;
    if (type) {
      return {
        pathname: '/realizacje/[typ]',
        params: { typ: type.slugs[toLocale] },
      };
    }
  }

  const rest = { ...params };
  delete rest.locale;

  return { pathname, params: rest } as Parameters<typeof Link>[0]['href'];
}
