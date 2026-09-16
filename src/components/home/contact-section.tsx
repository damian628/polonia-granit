import { getTranslations } from 'next-intl/server';

import { InquiryForm } from '@/components/contact/inquiry-form';
import { LocationMap } from '@/components/contact/location-map';
import { Container } from '@/components/ui/container';
import { ClockIcon, PhoneIcon, PinIcon } from '@/components/ui/icons';
import { fullAddress, site } from '@/lib/site';

export async function HomeContactSection() {
  const t = await getTranslations('home.contact');
  const tc = await getTranslations('common');

  return (
    <section id="wycena" className="bg-stone-50 py-20 lg:py-28">
      <Container size="wide">
        <div className="max-w-3xl">
          <p className="reveal text-xs font-semibold tracking-[0.2em] text-brass-600 uppercase">
            {t('eyebrow')}
          </p>
          <h2 className="reveal mt-4 text-headline text-balance text-ink-900">
            {t('title')}
          </h2>
          <p className="reveal mt-5 max-w-xl text-lg leading-relaxed text-ink-600">
            {t('body')}
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2 lg:items-stretch lg:gap-8">
          <div className="reveal rounded-lg border border-ink-900/10 bg-white p-6 sm:p-8">
            <InquiryForm />
          </div>

          <div className="flex min-h-[24rem] flex-col overflow-hidden rounded-lg border border-ink-900/10 bg-white lg:min-h-0">
            <LocationMap size="split" className="min-h-[22rem] flex-1" />
            <div className="space-y-3 border-t border-ink-900/8 px-5 py-4">
              <p className="inline-flex items-center gap-2 text-sm font-medium text-ink-800">
                <PinIcon width={16} height={16} className="text-brass-600" />
                {fullAddress}
              </p>
              <a
                href={site.phones[0].href}
                className="flex items-center gap-2 text-lg text-ink-900 transition-colors hover:text-brass-600"
              >
                <PhoneIcon width={18} height={18} className="text-brass-600" />
                {site.phones[0].display}
              </a>
              <p className="flex items-center gap-2 text-sm text-ink-600">
                <ClockIcon width={16} height={16} className="text-brass-600" />
                {tc('weekdays')} {site.openingHours.weekdays.from}–
                {site.openingHours.weekdays.to}
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
