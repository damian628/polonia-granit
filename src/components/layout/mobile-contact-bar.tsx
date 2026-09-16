import { useTranslations } from 'next-intl';

import { MailIcon, PhoneIcon, WhatsAppIcon } from '@/components/ui/icons';
import { Link } from '@/i18n/navigation';
import { site } from '@/lib/site';

/**
 * Przyklejona belka na dole ekranu na telefonach. Rozwiązanie podpatrzone
 * u konkurencji - w tej branży klient najczęściej po prostu dzwoni, więc
 * numer musi być na wyciągnięcie palca na każdej podstronie.
 * Cały komponent jest statyczny, bez ani jednej linii JavaScriptu.
 */
export function MobileContactBar() {
  const t = useTranslations('common');

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-ink-900/10 bg-white/95 backdrop-blur-xl lg:hidden">
      <div
        className="grid grid-cols-3 divide-x divide-ink-900/8"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <a
          href={site.phones[0].href}
          className="flex flex-col items-center gap-1 py-3 text-xs font-medium text-ink-800 active:bg-stone-100"
        >
          <PhoneIcon width={19} height={19} className="text-brass-600" />
          {t('call')}
        </a>

        <a
          href={site.whatsapp.href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-1 py-3 text-xs font-medium text-ink-800 active:bg-stone-100"
        >
          <WhatsAppIcon width={19} height={19} className="text-[#25D366]" />
          WhatsApp
        </a>

        <Link
          href="/kontakt"
          className="flex flex-col items-center gap-1 py-3 text-xs font-medium text-ink-800 active:bg-stone-100"
        >
          <MailIcon width={19} height={19} className="text-brass-600" />
          {t('quoteShort')}
        </Link>
      </div>
    </div>
  );
}
