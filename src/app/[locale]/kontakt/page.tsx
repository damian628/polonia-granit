import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { InquiryForm } from '@/components/contact/inquiry-form';
import { LocationMap } from '@/components/contact/location-map';
import { PageHero } from '@/components/page/page-hero';
import { buttonStyles } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import {
  ArrowRightIcon,
  ClockIcon,
  MailIcon,
  PhoneIcon,
  PinIcon,
  WhatsAppIcon,
} from '@/components/ui/icons';
import { pickImage } from '@/data/images';
import type { Locale } from '@/i18n/routing';
import { buildPageMetadata } from '@/lib/metadata';
import { fullAddress, site } from '@/lib/site';

type PageProps = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'contact' });

  return buildPageMetadata({
    href: '/kontakt',
    locale,
    title: t('metaTitle'),
    description: t('metaDescription'),
  });
}

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('contact');
  const tc = await getTranslations('common');
  const tn = await getTranslations('nav');

  return (
    <>
      <PageHero
        title={t('title')}
        lead={t('lead')}
        breadcrumb={tn('contact')}
        image={pickImage('firma', 1, 'hero')}
      />

      <section className="bg-white py-16 lg:py-24">
        <Container size="wide">
          <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-16">
            <div>
              <h2 className="text-headline text-ink-900">{t('formTitle')}</h2>
              <p className="mt-3 max-w-xl leading-relaxed text-ink-600">
                {t('formLead')}
              </p>
              <div className="mt-8">
                <InquiryForm />
              </div>
            </div>

            <div className="space-y-6">
              <Card
                icon={<PhoneIcon width={20} height={20} />}
                title={t('callTitle')}
                body={t('callBody')}
              >
                <ul className="space-y-1.5">
                  {site.phones.map((phone) => (
                    <li key={phone.href}>
                      <a
                        href={phone.href}
                        className="text-lg text-ink-900 transition-colors hover:text-brass-600"
                      >
                        {phone.display}
                      </a>
                    </li>
                  ))}
                </ul>
                <a
                  href={site.whatsapp.href}
                  target="_blank"
                  rel="noopener"
                  className={buttonStyles('secondary', 'md', 'mt-5')}
                >
                  <WhatsAppIcon width={17} height={17} />
                  {tc('whatsappCta')}
                </a>
              </Card>

              <Card
                icon={<MailIcon width={20} height={20} />}
                title={t('writeTitle')}
                body={t('writeBody')}
              >
                <a
                  href={`mailto:${site.email}`}
                  className="text-lg break-all text-ink-900 transition-colors hover:text-brass-600"
                >
                  {site.email}
                </a>
              </Card>

              <Card
                icon={<PinIcon width={20} height={20} />}
                title={t('visitTitle')}
                body={t('visitBody')}
              >
                <address className="text-lg leading-relaxed text-ink-900 not-italic">
                  {site.address.street}
                  <br />
                  {site.address.postalCode} {site.address.city}
                </address>
              </Card>

              <Card
                icon={<ClockIcon width={20} height={20} />}
                title={t('hoursTitle')}
              >
                <dl className="space-y-2">
                  <Row
                    label={tc('weekdays')}
                    value={`${site.openingHours.weekdays.from} – ${site.openingHours.weekdays.to}`}
                  />
                  <Row
                    label={tc('saturday')}
                    value={`${site.openingHours.saturday.from} – ${site.openingHours.saturday.to}`}
                  />
                  <Row label={tc('sunday')} value={tc('closed')} />
                </dl>
              </Card>

              <Card title={t('legalTitle')}>
                <p className="text-sm leading-relaxed text-ink-600">
                  {site.legalName}
                  <br />
                  {fullAddress}
                  <br />
                  NIP {site.taxId}
                </p>
              </Card>

              <div className="reveal rounded-lg border border-brass-500/25 bg-stone-50 p-7">
                <h2 className="text-xl text-ink-900">{t('wholesaleTitle')}</h2>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">
                  {t('wholesaleBody')}
                </p>
                <a
                  href={site.wholesale.url}
                  target="_blank"
                  rel="noopener"
                  className={buttonStyles('primary', 'md', 'group mt-5')}
                >
                  {site.wholesale.name}
                  <ArrowRightIcon
                    width={17}
                    height={17}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </a>
                <a
                  href={site.wholesale.phone.href}
                  className="mt-3 block text-sm text-ink-700 transition-colors hover:text-brass-600"
                >
                  {site.wholesale.phone.display}
                </a>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-stone-50 py-16 lg:py-24">
        <Container size="wide">
          <h2 className="text-headline text-ink-900">{t('mapTitle')}</h2>
          <p className="mt-3 max-w-xl leading-relaxed text-ink-600">
            {t('visitBody')}
          </p>
        </Container>
        <div className="mt-8">
          <LocationMap size="wide" />
        </div>
      </section>
    </>
  );
}

function Card({
  icon,
  title,
  body,
  children,
  className,
}: {
  icon?: React.ReactNode;
  title: string;
  body?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`reveal rounded-lg border border-ink-900/10 bg-stone-50 p-7 ${className ?? ''}`}
    >
      {icon ? (
        <span className="mb-4 grid size-11 place-items-center rounded-full bg-white text-brass-600 shadow-lift">
          {icon}
        </span>
      ) : null}
      <h2 className="text-xl text-ink-900">{title}</h2>
      {body ? (
        <p className="mt-2 text-sm leading-relaxed text-ink-600">{body}</p>
      ) : null}
      {children ? <div className="mt-5">{children}</div> : null}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-ink-900/8 pb-2">
      <dt className="text-ink-600">{label}</dt>
      <dd className="font-medium text-ink-900">{value}</dd>
    </div>
  );
}
