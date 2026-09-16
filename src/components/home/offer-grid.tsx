import { useTranslations } from 'next-intl';

import { Container } from '@/components/ui/container';
import { ArrowRightIcon } from '@/components/ui/icons';
import { SectionHeading } from '@/components/ui/section-heading';
import { SiteImageView } from '@/components/ui/site-image';
import { imageBySlug, pickImage } from '@/data/images';
import { offerItems } from '@/data/offer';
import { Link } from '@/i18n/navigation';

export function OfferGrid() {
  const t = useTranslations('home.offer');
  const tc = useTranslations('common');

  return (
    <section className="bg-stone-50 py-20 lg:py-28">
      <Container size="wide">
        <SectionHeading
          eyebrow={t('eyebrow')}
          title={t('title')}
          subtitle={t('subtitle')}
        />

        <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {offerItems.map((item, index) => {
            const image =
              imageBySlug(item.imageCategory, item.imageSlug) ??
              pickImage(item.imageCategory, index, item.fallbackCategory);

            const title = t(`items.${item.messageKey}.title`);

            return (
              <li
                key={item.messageKey}
                // Pierwszy kafel jest szerszy - rozbija monotonię siatki
                // i eksponuje nagrobki, czyli główny produkt firmy.
                className={
                  index === 0 ? 'reveal lg:col-span-2' : 'reveal'
                }
              >
                <Link
                  href={item.href}
                  className="group relative flex h-full min-h-[21rem] flex-col justify-end overflow-hidden rounded-3xl bg-ink-900 sm:min-h-[23rem]"
                >
                  {image ? (
                    <div className="absolute inset-0">
                      <SiteImageView
                        image={image}
                        alt={title}
                        sizes={
                          index === 0
                            ? '(min-width: 1024px) 55vw, (min-width: 640px) 50vw, 100vw'
                            : '(min-width: 1024px) 28vw, (min-width: 640px) 50vw, 100vw'
                        }
                        className="transition-transform duration-700 ease-out-soft group-hover:scale-[1.04]"
                      />
                    </div>
                  ) : null}

                  {/* Przyciemnienie tylko w dolnej części kadru - górna połowa
                      zdjęcia zostaje czysta, a tekst nadal ma kontrast. */}
                  <div
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 h-4/5 bg-gradient-to-t from-ink-950 via-ink-950/75 to-transparent"
                  />

                  <div className="relative p-7">
                    <h3 className="text-2xl text-stone-50">{title}</h3>
                    <p className="mt-3 max-w-md text-sm leading-relaxed text-stone-300">
                      {t(`items.${item.messageKey}.description`)}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-brass-300">
                      {tc('seeOffer')}
                      <ArrowRightIcon
                        width={17}
                        height={17}
                        className="transition-transform duration-300 group-hover:translate-x-1"
                      />
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
