import { useTranslations } from 'next-intl';

import { LanguageSwitcher } from '@/components/layout/language-switcher';
import { Logo } from '@/components/layout/logo';
import { MobileMenu } from '@/components/layout/mobile-menu';
import { buttonStyles } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import {
  ChevronDownIcon,
  ExternalIcon,
  MailIcon,
  PhoneIcon,
  PinIcon,
} from '@/components/ui/icons';
import { Link } from '@/i18n/navigation';
import { isNavGroup, mainNav } from '@/lib/navigation';
import { fullAddress, site } from '@/lib/site';

export function Header() {
  const t = useTranslations('nav');
  const tc = useTranslations('common');

  return (
    <header className="sticky top-0 z-50">
      {/* Górna belka z danymi kontaktowymi - zawsze widoczna na desktopie,
          bo w tej branży telefon jest głównym kanałem kontaktu. */}
      <div className="hidden bg-ink-950 text-stone-300 lg:block">
        <Container size="wide">
          <div className="flex items-center justify-between py-2 text-[0.8125rem]">
            <div className="flex items-center gap-6">
              <a
                href={site.phones[0].href}
                className="inline-flex items-center gap-2 transition-colors hover:text-brass-300"
              >
                <PhoneIcon width={15} height={15} />
                {site.phones[0].display}
              </a>
              <a
                href={site.phones[1].href}
                className="inline-flex items-center gap-2 transition-colors hover:text-brass-300"
              >
                {site.phones[1].display}
              </a>
              <a
                href={`mailto:${site.email}`}
                className="inline-flex items-center gap-2 transition-colors hover:text-brass-300"
              >
                <MailIcon width={15} height={15} />
                {site.email}
              </a>
            </div>

            <div className="flex items-center gap-6">
              <span className="inline-flex items-center gap-2 text-stone-400">
                <PinIcon width={15} height={15} />
                {fullAddress}
              </span>
              <span className="text-stone-400">
                {tc('weekdays')} {site.openingHours.weekdays.from}–
                {site.openingHours.weekdays.to}
              </span>
            </div>
          </div>
        </Container>
      </div>

      {/* Główny pasek nawigacji */}
      <div className="border-b border-ink-900/8 bg-stone-50/85 backdrop-blur-xl">
        <Container size="wide">
          <div className="flex min-w-0 items-center justify-between gap-3 py-2.5 lg:py-4">
            <Link href="/" aria-label={site.name} className="min-w-0 shrink">
              <Logo priority />
            </Link>

            <nav
              className="hidden items-center gap-1 lg:flex"
              aria-label={t('openMenu')}
            >
              {mainNav.map((item) =>
                isNavGroup(item) ? (
                  <div key={item.key} className="group relative">
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 rounded-full px-3.5 py-2 text-sm font-medium whitespace-nowrap text-ink-700 transition-colors hover:bg-ink-900/5 hover:text-ink-900"
                    >
                      {t(item.key)}
                      <ChevronDownIcon
                        width={15}
                        height={15}
                        className="transition-transform duration-300 group-hover:rotate-180"
                      />
                    </button>

                    {/* Rozwijanie na CSS - hover plus focus-within, żeby menu
                        działało też z klawiatury bez ani jednej linii JS. */}
                    <div className="invisible absolute top-full left-0 z-50 min-w-[15rem] translate-y-1 rounded-2xl border border-ink-900/10 bg-white p-1.5 opacity-0 shadow-lift transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                      {item.children.map((child) => (
                        <Link
                          key={child.key}
                          href={child.href}
                          className="block rounded-xl px-3 py-2.5 text-sm text-ink-600 transition-colors hover:bg-stone-100 hover:text-ink-900"
                        >
                          {t(child.key)}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    key={item.key}
                    href={item.href}
                    className="rounded-full px-3.5 py-2 text-sm font-medium whitespace-nowrap text-ink-700 transition-colors hover:bg-ink-900/5 hover:text-ink-900"
                  >
                    {t(item.key)}
                  </Link>
                ),
              )}

              {/* Hurtownia to osobny serwis - otwieramy w nowej karcie,
                  żeby nie wyprowadzać ruchu ze strony Polonii. */}
              <a
                href={site.wholesale.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium whitespace-nowrap text-ink-700 transition-colors hover:bg-ink-900/5 hover:text-ink-900"
              >
                {t('wholesale')}
                <ExternalIcon width={14} height={14} className="opacity-60" />
                <span className="sr-only">{t('externalHint')}</span>
              </a>
            </nav>

            <div className="flex shrink-0 items-center gap-1.5">
              <div className="hidden lg:block">
                <LanguageSwitcher />
              </div>
              <div className="hidden lg:block">
                <Link href="/kontakt" className={buttonStyles('primary', 'md')}>
                  {tc('askForQuote')}
                </Link>
              </div>
              <MobileMenu />
            </div>
          </div>
        </Container>
      </div>
    </header>
  );
}
