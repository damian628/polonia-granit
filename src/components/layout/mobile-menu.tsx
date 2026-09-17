'use client';

import { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';

import { LanguageSwitcher } from '@/components/layout/language-switcher';
import { Logo } from '@/components/layout/logo';
import { buttonStyles } from '@/components/ui/button';
import {
  CloseIcon,
  ExternalIcon,
  MailIcon,
  MenuIcon,
  PhoneIcon,
  PinIcon,
} from '@/components/ui/icons';
import { Link, usePathname } from '@/i18n/navigation';
import { isNavGroup, mainNav } from '@/lib/navigation';
import { fullAddress, site } from '@/lib/site';

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations('nav');
  const tc = useTranslations('common');

  // Zamykamy panel po przejściu na inną podstronę albo zmianie języka.
  // `usePathname` z next-intl zwraca wzorzec bez prefiksu locale, więc sam
  // pathname nie zmienia się przy `/kontakt` → `/de/kontakt`.
  const locationKey = `${locale}:${pathname}`;
  const [lastLocation, setLastLocation] = useState(locationKey);
  if (locationKey !== lastLocation) {
    setLastLocation(locationKey);
    setIsOpen(false);
  }

  // Blokada przewijania tła, gdy panel jest otwarty.
  useEffect(() => {
    if (!isOpen) return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen]);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label={t('openMenu')}
        aria-expanded={isOpen}
        className="inline-flex size-11 shrink-0 items-center justify-center rounded-full text-ink-800 transition-colors hover:bg-ink-900/5 lg:hidden"
      >
        <MenuIcon width={22} height={22} />
      </button>

      {isOpen ? (
        <div
          className="fixed inset-0 z-[60] flex flex-col bg-stone-50 lg:hidden"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-center justify-between gap-3 border-b border-ink-900/8 px-5 py-4">
            <Link href="/" aria-label={site.name} onClick={() => setIsOpen(false)}>
              <Logo size="xs" />
            </Link>
            <LanguageSwitcher />
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label={t('closeMenu')}
              className="inline-flex size-11 items-center justify-center rounded-full text-ink-800 transition-colors hover:bg-ink-900/5"
            >
              <CloseIcon width={22} height={22} />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-5 py-6">
            <ul className="space-y-1">
              {mainNav.map((item) =>
                isNavGroup(item) ? (
                  <li key={item.key} className="pt-4 first:pt-0">
                    <p className="px-3 pb-1 text-xs font-semibold tracking-[0.18em] text-brass-600 uppercase">
                      {t(item.key)}
                    </p>
                    <ul>
                      {item.children.map((child) => (
                        <li key={child.key}>
                          <Link
                            href={child.href}
                            className="block rounded-xl px-3 py-3 text-lg text-ink-700 transition-colors hover:bg-ink-900/5"
                          >
                            {t(child.key)}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                ) : (
                  <li key={item.key}>
                    <Link
                      href={item.href}
                      className="block rounded-xl px-3 py-3 text-lg font-medium text-ink-900 transition-colors hover:bg-ink-900/5"
                    >
                      {t(item.key)}
                    </Link>
                  </li>
                ),
              )}
              <li>
                <a
                  href={site.wholesale.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-xl px-3 py-3 text-lg font-medium text-ink-900 transition-colors hover:bg-ink-900/5"
                >
                  {t('wholesale')}
                  <ExternalIcon width={16} height={16} className="opacity-60" />
                  <span className="sr-only">{t('externalHint')}</span>
                </a>
              </li>
            </ul>

            <div className="mt-8 space-y-3 border-t border-ink-900/8 pt-6 text-sm text-ink-600">
              {site.phones.map((phone) => (
                <a
                  key={phone.href}
                  href={phone.href}
                  className="flex items-center gap-3"
                >
                  <PhoneIcon width={16} height={16} className="text-brass-600" />
                  {phone.display}
                </a>
              ))}
              <a
                href={`mailto:${site.email}`}
                className="flex items-center gap-3"
              >
                <MailIcon width={16} height={16} className="text-brass-600" />
                {site.email}
              </a>
              <p className="flex items-center gap-3">
                <PinIcon width={16} height={16} className="text-brass-600" />
                {fullAddress}
              </p>
            </div>
          </nav>

          <div className="border-t border-ink-900/8 px-5 py-4">
            <Link
              href="/kontakt"
              className={buttonStyles('primary', 'lg', 'w-full')}
            >
              {tc('askForQuote')}
            </Link>
          </div>
        </div>
      ) : null}
    </>
  );
}
