import { useTranslations } from 'next-intl';

import { Container } from '@/components/ui/container';
import { imageBySlug } from '@/data/images';
import { yearsOnMarket } from '@/lib/site';

const keys = ['years', 'markets', 'warehouses'] as const;

/**
 * Pasek z liczbami. Świadomie podajemy tylko dane, które da się sprawdzić:
 * lata na rynku, liczbę rynków i liczbę magazynów. Konkurencja chwali się
 * „setkami zadowolonych klientów rocznie” - bez danych od klienta nie
 * wpisujemy takich liczb.
 */
export function StatsBand() {
  const t = useTranslations('home.stats');
  const texture = imageBySlug(
    'hero',
    'depositphotos-90247142-stock-photo-texture-of-stone-wall-in',
  );

  return (
    <section className="relative isolate overflow-hidden bg-ink-950 py-16 lg:py-20">
      {texture ? (
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 opacity-[0.16] bg-cover bg-center"
          style={{ backgroundImage: `url(${texture.src})` }}
        />
      ) : null}

      <Container size="wide">
        <h2 className="reveal-fade text-center text-sm font-semibold tracking-[0.2em] text-brass-400 uppercase">
          {t('title')}
        </h2>

        <dl className="mt-11 grid gap-10 text-center sm:grid-cols-3">
          {keys.map((key) => (
            <div key={key} className="reveal">
              <dt className="sr-only">{t(`${key}.label`)}</dt>
              <dd>
                <span className="block font-display text-6xl leading-none text-stone-50">
                  {t(`${key}.value`, { years: yearsOnMarket })}
                </span>
                <span className="mt-3 block text-sm text-stone-400">
                  {t(`${key}.label`)}
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
