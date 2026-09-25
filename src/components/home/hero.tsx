import Image from 'next/image';
import { useTranslations } from 'next-intl';

import { HeroVideo } from '@/components/home/hero-video';
import { Logo } from '@/components/layout/logo';
import { buttonStyles } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { ArrowRightIcon, CheckIcon } from '@/components/ui/icons';
import { Link } from '@/i18n/navigation';
import { yearsOnMarket } from '@/lib/site';

export function Hero() {
  const t = useTranslations('home.hero');

  const badges = [
    t('badgeExperience', { years: yearsOnMarket }),
    t('badgeOwnProduction'),
    t('badgeMarkets'),
  ];

  return (
    <section className="relative isolate overflow-hidden bg-ink-950">
      {/* Klatka z filmu jest LCP. Wideo odtwarzamy tylko na desktopie i tylko
          gdy użytkownik nie prosi o mniej ruchu — 14 MB pętli nie ciągnie
          telefon przy słabym LTE. */}
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <Image
          src="/video/hero-drone.jpg"
          alt=""
          fill
          sizes="100vw"
          quality={90}
          priority
          className="object-cover"
        />
        <HeroVideo />
      </div>

      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-br from-ink-950/92 via-ink-950/80 to-ink-900/60"
      />

      <Container size="wide">
        <div className="flex min-h-[clamp(34rem,82vh,48rem)] flex-col justify-center py-24 lg:py-32">
          <div className="reveal-fade">
            <Logo
              tone="light"
              size="lg"
              priority
              className="drop-shadow-[0_12px_28px_rgba(0,0,0,0.65)]"
            />
          </div>

          <p className="reveal-fade mt-8 text-xs font-semibold tracking-[0.24em] text-brass-400 uppercase">
            {t('eyebrow')}
          </p>

          <h1 className="reveal mt-6 max-w-4xl text-display text-balance text-stone-50">
            {t('title')}
          </h1>

          <p className="reveal mt-7 max-w-2xl text-lg leading-relaxed text-stone-300 sm:text-xl">
            {t('subtitle')}
          </p>

          <div className="reveal mt-10 flex flex-wrap items-center gap-3">
            <Link
              href="/kontakt"
              className={buttonStyles('onDark', 'lg', 'group')}
            >
              {t('ctaPrimary')}
              <ArrowRightIcon
                width={18}
                height={18}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
            <Link
              href="/realizacje"
              className={buttonStyles(
                'secondary',
                'lg',
                'border-white/20 bg-white/8 text-stone-50 backdrop-blur-md hover:border-white/40 hover:bg-white/12',
              )}
            >
              {t('ctaSecondary')}
            </Link>
          </div>

          <ul className="reveal mt-14 flex flex-wrap gap-x-8 gap-y-3">
            {badges.map((badge) => (
              <li
                key={badge}
                className="inline-flex items-center gap-2 text-sm text-stone-300"
              >
                <CheckIcon
                  width={16}
                  height={16}
                  className="shrink-0 text-brass-400"
                />
                {badge}
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
