import { useTranslations } from 'next-intl';

import { Container } from '@/components/ui/container';
import { ArrowRightIcon } from '@/components/ui/icons';
import { SectionHeading } from '@/components/ui/section-heading';
import { SiteImageView } from '@/components/ui/site-image';
import { imageBySlug, pickImage } from '@/data/images';
import { Link } from '@/i18n/navigation';
import type { StaticAppPathname } from '@/i18n/routing';

const catalogs: Array<{
  key: 'granites' | 'conglomerates';
  href: StaticAppPathname;
  category: string;
  slug: string;
}> = [
  {
    key: 'granites',
    href: '/granity',
    category: 'kamienie/granity',
    slug: 'star-galaxy',
  },
  {
    key: 'conglomerates',
    href: '/konglomeraty-kwarcowe-pacific',
    category: 'kamienie/konglomeraty',
    slug: 'bellagio-closeup-polished',
  },
];

export function MaterialsSection() {
  const t = useTranslations('home.materials');
  const tc = useTranslations('common');

  return (
    <section className="bg-white py-20 lg:py-28">
      <Container size="wide">
        <SectionHeading
          eyebrow={t('eyebrow')}
          title={t('title')}
          subtitle={t('subtitle')}
        />

        <ul className="mt-14 grid gap-5 lg:grid-cols-2">
          {catalogs.map((item) => {
            const image =
              imageBySlug(item.category, item.slug) ??
              pickImage(item.category, 0);
            const title = t(`${item.key}.title`);

            return (
              <li key={item.key} className="reveal">
                <Link
                  href={item.href}
                  className="group relative flex h-full min-h-[22rem] flex-col justify-end overflow-hidden rounded-3xl bg-ink-900 sm:min-h-[24rem]"
                >
                  {image ? (
                    <div className="absolute inset-0">
                      <SiteImageView
                        image={image}
                        alt={title}
                        fill
                        sizes="(min-width: 1024px) 45vw, 100vw"
                        className="transition-transform duration-700 ease-out-soft group-hover:scale-[1.04]"
                      />
                    </div>
                  ) : null}

                  <div
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 h-4/5 bg-gradient-to-t from-ink-950 via-ink-950/75 to-transparent"
                  />

                  <div className="relative p-7 lg:p-9">
                    <h3 className="text-2xl text-stone-50">{title}</h3>
                    <p className="mt-3 max-w-md text-sm leading-relaxed text-stone-300">
                      {t(`${item.key}.description`)}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-brass-300">
                      {tc('seeMore')}
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
