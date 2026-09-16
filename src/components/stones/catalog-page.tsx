import { getTranslations } from 'next-intl/server';

import { CtaBanner } from '@/components/home/cta-banner';
import { PageHero } from '@/components/page/page-hero';
import { ProcessSteps } from '@/components/page/process-steps';
import { StoneCard } from '@/components/stones/stone-card';
import {
  StoneFilters,
  type StoneColorCounts,
} from '@/components/stones/stone-filters';
import { buttonStyles } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { imageBySlug } from '@/data/images';
import {
  colorOrder,
  conglomerates,
  granites,
  type Stone,
  type StoneColor,
  type StoneMaterial,
} from '@/data/stones';
import { Link } from '@/i18n/navigation';
import type { StaticAppPathname } from '@/i18n/routing';

const catalogs = {
  granit: {
    stones: granites,
    namespace: 'granites',
    navKey: 'granites',
    href: '/granity',
    siblingHref: '/konglomeraty-kwarcowe-pacific',
    siblingNavKey: 'conglomerates',
    hero: { category: 'kamienie/granity', slug: 'star-galaxy' },
  },
  konglomerat: {
    stones: conglomerates,
    namespace: 'conglomerates',
    navKey: 'conglomerates',
    href: '/konglomeraty-kwarcowe-pacific',
    siblingHref: '/granity',
    siblingNavKey: 'granites',
    hero: { category: 'kamienie/konglomeraty', slug: 'bellagio-closeup-polished' },
  },
} as const satisfies Record<
  StoneMaterial,
  {
    stones: Stone[];
    namespace: 'granites' | 'conglomerates';
    navKey: 'granites' | 'conglomerates';
    href: StaticAppPathname;
    siblingHref: StaticAppPathname;
    siblingNavKey: 'granites' | 'conglomerates';
    hero: { category: string; slug: string };
  }
>;

export function catalogConfig(material: StoneMaterial) {
  return catalogs[material];
}

export async function CatalogPage({ material }: { material: StoneMaterial }) {
  const config = catalogs[material];
  const t = await getTranslations(config.namespace);
  const ts = await getTranslations('stones');
  const tn = await getTranslations('nav');

  return (
    <>
      <PageHero
        title={t('title')}
        lead={t('lead')}
        breadcrumb={tn(config.navKey)}
        image={imageBySlug(config.hero.category, config.hero.slug)}
      />

      <section className="bg-white py-16 lg:py-20">
        <Container size="narrow">
          <p className="reveal text-lg leading-relaxed text-ink-600">
            {t('body')}
          </p>
          <Link
            href={config.siblingHref}
            className={buttonStyles('secondary', 'md', 'reveal mt-8')}
          >
            {t('siblingCta')}
          </Link>
        </Container>
      </section>

      <StoneFilters
        counts={buildCounts(config.stones)}
        swatches={buildSwatches(config.stones)}
      >
        {config.stones.map((stone) => (
          <StoneCard
            key={stone.slug}
            stone={stone}
            finishLabel={
              stone.finish ? ts(`finishes.${stone.finish}`) : undefined
            }
          />
        ))}
      </StoneFilters>

      <ProcessSteps />
      <CtaBanner title={t('ctaTitle')} body={t('ctaBody')} />
    </>
  );
}

function buildCounts(stones: Stone[]): StoneColorCounts {
  const counts: StoneColorCounts = {};
  for (const stone of stones) {
    counts[stone.color] = (counts[stone.color] ?? 0) + 1;
  }
  return counts;
}

function buildSwatches(stones: Stone[]): Partial<Record<StoneColor, string>> {
  const swatches: Partial<Record<StoneColor, string>> = {};
  for (const color of colorOrder) {
    const stone = stones.find((entry) => entry.color === color);
    if (stone) swatches[color] = stone.swatch;
  }
  return swatches;
}
