import { useTranslations } from 'next-intl';

import { Container } from '@/components/ui/container';
import { SiteImageView } from '@/components/ui/site-image';
import type { SiteImage } from '@/data/images';
import { Link } from '@/i18n/navigation';

type PageHeroProps = {
  title: string;
  lead: string;
  /** Zdjęcie tła. Ustawiamy `priority` - to element decydujący o LCP. */
  image?: SiteImage;
  /** Etykieta bieżącej strony w okruszkach. */
  breadcrumb?: string;
};

export function PageHero({ title, lead, image, breadcrumb }: PageHeroProps) {
  const t = useTranslations('offer.common');

  return (
    <section className="relative isolate overflow-hidden bg-ink-950">
      {image ? (
        <div aria-hidden="true" className="absolute inset-0 -z-10">
          <SiteImageView
            image={image}
            alt=""
            sizes="100vw"
            fill
            quality={90}
            priority
          />
        </div>
      ) : null}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-r from-ink-950/94 via-ink-950/82 to-ink-950/55"
      />

      <Container size="wide">
        <div className="max-w-3xl py-20 lg:py-28">
          {breadcrumb ? (
            <nav
              aria-label={breadcrumb}
              className="reveal-fade mb-7 flex items-center gap-2 text-xs text-stone-400"
            >
              <Link
                href="/"
                className="transition-colors hover:text-brass-300"
              >
                {t('breadcrumbHome')}
              </Link>
              <span aria-hidden="true">/</span>
              <span className="text-stone-300">{breadcrumb}</span>
            </nav>
          ) : null}

          <h1 className="reveal text-headline text-balance text-stone-50">
            {title}
          </h1>
          <p className="reveal mt-6 text-lg leading-relaxed text-stone-300">
            {lead}
          </p>
        </div>
      </Container>
    </section>
  );
}
