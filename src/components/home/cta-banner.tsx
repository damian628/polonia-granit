import { useTranslations } from 'next-intl';

import { buttonStyles } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { ArrowRightIcon, PhoneIcon } from '@/components/ui/icons';
import { Link } from '@/i18n/navigation';
import { site } from '@/lib/site';

type CtaBannerProps = {
  /** Nagłówek dopasowany do podstrony. Bez niego lecimy tekstem ogólnym. */
  title?: string;
  body?: string;
};

export function CtaBanner({ title, body }: CtaBannerProps = {}) {
  const t = useTranslations('home.cta');

  return (
    <section className="bg-white pb-20 lg:pb-28">
      <Container size="wide">
        <div className="reveal rounded-3xl border border-brass-500/25 bg-gradient-to-br from-stone-100 to-stone-50 p-9 text-center lg:p-16">
          <h2 className="mx-auto max-w-2xl text-headline text-balance text-ink-900">
            {title ?? t('title')}
          </h2>
          <p className="mx-auto mt-5 max-w-xl leading-relaxed text-ink-600">
            {body ?? t('body')}
          </p>

          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Link
              href="/kontakt"
              className={buttonStyles('primary', 'lg', 'group')}
            >
              {t('primary')}
              <ArrowRightIcon
                width={18}
                height={18}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
            <a
              href={site.phones[0].href}
              className={buttonStyles('secondary', 'lg')}
            >
              <PhoneIcon width={17} height={17} />
              {t('secondary', { phone: site.phones[0].display })}
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}
