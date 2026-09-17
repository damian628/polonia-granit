import { useTranslations } from 'next-intl';

import { buttonStyles } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { CheckIcon, ExternalIcon } from '@/components/ui/icons';
import { SiteImageView } from '@/components/ui/site-image';
import { imageBySlug, pickImage } from '@/data/images';
import { site } from '@/lib/site';

const bullets = ['direct', 'stock', 'delivery'] as const;

/**
 * Sekcja prowadząca do hurtowniakamienia.eu. To osobny serwis tego samego
 * właściciela, więc otwieramy go w nowej karcie - klient detaliczny ma zostać
 * na stronie Polonii, a kamieniarz ma trafić do hurtowni jednym kliknięciem.
 */
export function WholesaleSection() {
  const t = useTranslations('home.wholesale');
  const tn = useTranslations('nav');

  const image =
    imageBySlug('hero', '2') ?? pickImage('kamienie/granity', 0);

  return (
    <section className="bg-stone-100 py-20 lg:py-28">
      <Container size="wide">
        <div className="overflow-hidden rounded-3xl bg-ink-900">
          <div className="grid lg:grid-cols-2">
            <div className="order-2 p-9 lg:order-1 lg:p-14">
              <p className="reveal-fade text-xs font-semibold tracking-[0.2em] text-brass-400 uppercase">
                {t('eyebrow')}
              </p>
              <h2 className="reveal mt-4 text-headline text-balance text-stone-50">
                {t('title')}
              </h2>
              <p className="reveal mt-6 leading-relaxed text-stone-300">
                {t('body')}
              </p>

              <ul className="reveal mt-8 space-y-3">
                {bullets.map((bullet) => (
                  <li
                    key={bullet}
                    className="flex items-start gap-3 text-stone-200"
                  >
                    <CheckIcon
                      width={18}
                      height={18}
                      className="mt-1 shrink-0 text-brass-400"
                    />
                    {t(`bullets.${bullet}`)}
                  </li>
                ))}
              </ul>

              <a
                href={site.wholesale.url}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonStyles('onDark', 'lg', 'reveal mt-9 group')}
              >
                {t('cta')}
                <ExternalIcon
                  width={17}
                  height={17}
                  className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
                <span className="sr-only">{tn('externalHint')}</span>
              </a>

              <p className="mt-5 text-xs text-stone-500">{t('note')}</p>
            </div>

            <div className="relative order-1 min-h-64 lg:order-2 lg:min-h-full">
              {image ? (
                <SiteImageView
                  image={image}
                  alt={t('title')}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                />
              ) : null}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
