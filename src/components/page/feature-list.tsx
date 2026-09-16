import { useTranslations } from 'next-intl';

import { Container } from '@/components/ui/container';
import { CheckIcon } from '@/components/ui/icons';
import { SiteImageView } from '@/components/ui/site-image';
import type { SiteImage } from '@/data/images';

const featureKeys = ['one', 'two', 'three', 'four', 'five'] as const;

type FeatureListProps = {
  /** Klucz produktu w `offer`, np. `tombstones`. */
  productKey: string;
  body: string;
  image?: SiteImage;
};

export function FeatureList({ productKey, body, image }: FeatureListProps) {
  const t = useTranslations(`offer.${productKey}`);
  const tc = useTranslations('offer.common');

  return (
    <section className="bg-white py-20 lg:py-28">
      <Container size="wide">
        <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
          <div>
            <h2 className="reveal text-headline text-balance text-ink-900">
              {tc('featuresTitle')}
            </h2>
            <ul className="reveal mt-8 space-y-4">
              {featureKeys.map((key) => (
                <li key={key} className="flex gap-3 text-ink-700">
                  <CheckIcon
                    width={19}
                    height={19}
                    className="mt-0.5 shrink-0 text-brass-600"
                  />
                  {t(`features.${key}`)}
                </li>
              ))}
            </ul>
          </div>

          <div>
            {image ? (
              <div className="reveal overflow-hidden rounded-3xl">
                <SiteImageView
                  image={image}
                  alt={t('title')}
                  sizes="(min-width: 1024px) 46vw, 100vw"
                />
              </div>
            ) : null}
            <p className="reveal mt-7 leading-relaxed text-ink-600">{body}</p>
          </div>
        </div>
      </Container>
    </section>
  );
}
