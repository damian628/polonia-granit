import { getLocale, getTranslations } from 'next-intl/server';

import { ExternalIcon } from '@/components/ui/icons';
import { mapsDirectionsUrl, mapsEmbedUrl } from '@/lib/site';
import { cn } from '@/lib/cn';

type LocationMapProps = {
  className?: string;
  /** `split` — wysokość kolumny obok formularza na stronie głównej. */
  size?: 'default' | 'wide' | 'split';
};

export async function LocationMap({
  className,
  size = 'default',
}: LocationMapProps) {
  const locale = await getLocale();
  const t = await getTranslations('contact');

  return (
    <div
      className={cn(size === 'split' && 'flex h-full min-h-[22rem] flex-col', className)}
    >
      <div
        className={cn(
          'relative overflow-hidden bg-stone-200',
          size === 'split' && 'min-h-[22rem] flex-1',
        )}
      >
        <iframe
          title={t('mapTitle')}
          src={mapsEmbedUrl(locale)}
          className={cn(
            'block w-full border-0',
            size === 'wide' && 'h-[min(26rem,58vh)] sm:h-[32rem] lg:h-[38rem]',
            size === 'default' && 'h-[min(22rem,50vh)] sm:h-[28rem]',
            size === 'split' && 'absolute inset-0 h-full w-full',
          )}
          loading="eager"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
        <a
          href={mapsDirectionsUrl}
          target="_blank"
          rel="noopener"
          className="absolute top-4 left-4 inline-flex items-center gap-2 rounded-md bg-white px-3 py-2 text-sm font-medium text-ink-900 shadow-lift transition-colors hover:bg-stone-50"
        >
          {t('mapCta')}
          <ExternalIcon width={14} height={14} />
        </a>
      </div>
    </div>
  );
}
