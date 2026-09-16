import { useTranslations } from 'next-intl';

import { Logo } from '@/components/layout/logo';
import { Container } from '@/components/ui/container';
import {
  ClockIcon,
  ExternalIcon,
  FacebookIcon,
  InstagramIcon,
  MailIcon,
  PhoneIcon,
  PinIcon,
} from '@/components/ui/icons';
import { Link } from '@/i18n/navigation';
import { footerCompanyLinks, footerOfferLinks } from '@/lib/navigation';
import { site } from '@/lib/site';

export function Footer() {
  const t = useTranslations('footer');
  const tn = useTranslations('nav');
  const tc = useTranslations('common');

  return (
    // Dolny padding robi miejsce na przyklejoną belkę kontaktową na telefonach.
    <footer className="bg-ink-950 pb-20 text-stone-300 lg:pb-0">
      <Container size="wide">
        <div className="grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4 lg:py-20">
          <div>
            <Logo tone="light" size="md" />
            <p className="mt-6 text-sm leading-relaxed text-stone-400">
              {t('aboutBody')}
            </p>
            <div className="mt-6 flex gap-2">
              <a
                href={site.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t('socialFacebook')}
                className="inline-flex size-10 items-center justify-center rounded-full border border-white/12 text-stone-300 transition-colors hover:border-brass-500 hover:text-brass-300"
              >
                <FacebookIcon width={18} height={18} />
              </a>
              <a
                href={site.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t('socialInstagram')}
                className="inline-flex size-10 items-center justify-center rounded-full border border-white/12 text-stone-300 transition-colors hover:border-brass-500 hover:text-brass-300"
              >
                <InstagramIcon width={18} height={18} />
              </a>
            </div>
          </div>

          <div>
            <h2 className="text-sm font-semibold tracking-[0.16em] text-stone-50 uppercase">
              {t('offerTitle')}
            </h2>
            <ul className="mt-5 space-y-3 text-sm">
              {footerOfferLinks.map((link) => (
                <li key={link.key}>
                  <Link
                    href={link.href}
                    className="text-stone-400 transition-colors hover:text-brass-300"
                  >
                    {tn(link.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-semibold tracking-[0.16em] text-stone-50 uppercase">
              {t('companyTitle')}
            </h2>
            <ul className="mt-5 space-y-3 text-sm">
              {footerCompanyLinks.map((link) => (
                <li key={link.key}>
                  <Link
                    href={link.href}
                    className="text-stone-400 transition-colors hover:text-brass-300"
                  >
                    {tn(link.key)}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href={site.wholesale.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-stone-400 transition-colors hover:text-brass-300"
                >
                  {tn('wholesale')}
                  <ExternalIcon width={13} height={13} className="opacity-70" />
                  <span className="sr-only">{tn('externalHint')}</span>
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-semibold tracking-[0.16em] text-stone-50 uppercase">
              {t('contactTitle')}
            </h2>
            <ul className="mt-5 space-y-4 text-sm">
              <li className="flex gap-3">
                <PinIcon
                  width={17}
                  height={17}
                  className="mt-0.5 shrink-0 text-brass-500"
                />
                <span className="text-stone-400">
                  {site.address.street}
                  <br />
                  {site.address.postalCode} {site.address.city}
                </span>
              </li>
              <li className="flex gap-3">
                <PhoneIcon
                  width={17}
                  height={17}
                  className="mt-0.5 shrink-0 text-brass-500"
                />
                <span className="flex flex-col gap-1">
                  {site.phones.map((phone) => (
                    <a
                      key={phone.href}
                      href={phone.href}
                      className="text-stone-400 transition-colors hover:text-brass-300"
                    >
                      {phone.display}
                    </a>
                  ))}
                </span>
              </li>
              <li className="flex gap-3">
                <MailIcon
                  width={17}
                  height={17}
                  className="mt-0.5 shrink-0 text-brass-500"
                />
                <a
                  href={`mailto:${site.email}`}
                  className="text-stone-400 transition-colors hover:text-brass-300"
                >
                  {site.email}
                </a>
              </li>
              <li className="flex gap-3">
                <ClockIcon
                  width={17}
                  height={17}
                  className="mt-0.5 shrink-0 text-brass-500"
                />
                <span className="text-stone-400">
                  {tc('weekdays')}: {site.openingHours.weekdays.from} –{' '}
                  {site.openingHours.weekdays.to}
                  <br />
                  {tc('saturday')}: {site.openingHours.saturday.from} –{' '}
                  {site.openingHours.saturday.to}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-white/8 py-7 text-xs text-stone-500 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <p>
              © {new Date().getFullYear()} {site.name}. {t('rights')}
            </p>
            {/* Pełna nazwa i NIP - wymóg przy działalności gospodarczej. */}
            <p>
              {site.legalName}, NIP {site.taxId}
            </p>
          </div>
          <Link
            href="/polityka-prywatnosci-i-cookies"
            className="transition-colors hover:text-brass-300"
          >
            {tn('privacy')}
          </Link>
        </div>
      </Container>
    </footer>
  );
}
