import { useTranslations } from 'next-intl';

import { buttonStyles } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { SiteImageView } from '@/components/ui/site-image';
import { imageBySlug, pickImage } from '@/data/images';
import { Link } from '@/i18n/navigation';

export function IntroSection() {
  const t = useTranslations('home.intro');

  const primary = imageBySlug('firma', '01a') ?? pickImage('firma', 0);
  const secondary = imageBySlug('hero', 'polonia') ?? pickImage('firma', 1);

  return (
    <section className="bg-white py-20 lg:py-28">
      <Container size="wide">
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          {/* Dwa zdjęcia w lekkim przesunięciu - warsztat i gotowa realizacja. */}
          <div className="reveal relative">
            {primary ? (
              <div className="overflow-hidden rounded-3xl">
                <SiteImageView
                  image={primary}
                  alt={t('title')}
                  sizes="(min-width: 1024px) 46vw, 100vw"
                />
              </div>
            ) : null}

            {secondary ? (
              <div className="absolute -bottom-8 -right-4 hidden w-2/5 overflow-hidden rounded-2xl border-4 border-white shadow-lift lg:block">
                <SiteImageView
                  image={secondary}
                  alt={t('title')}
                  sizes="20vw"
                />
              </div>
            ) : null}
          </div>

          <div>
            <p className="reveal-fade text-xs font-semibold tracking-[0.2em] text-brass-600 uppercase">
              {t('eyebrow')}
            </p>
            <h2 className="reveal mt-4 text-headline text-balance text-ink-900">
              {t('title')}
            </h2>
            <p className="reveal mt-6 text-lg leading-relaxed text-ink-700">
              {t('lead')}
            </p>
            <p className="reveal mt-5 leading-relaxed text-ink-600">
              {t('body')}
            </p>
            <Link
              href="/o-firmie"
              className={buttonStyles('secondary', 'lg', 'reveal mt-9')}
            >
              {t('cta')}
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
