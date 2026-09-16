import { getTranslations } from 'next-intl/server';

import { KitchenVizTool } from '@/components/viz/kitchen-viz-tool';
import { Container } from '@/components/ui/container';
import { SiteImageView } from '@/components/ui/site-image';
import { imageBySlug, pickImage } from '@/data/images';
import { vizStoneOptions } from '@/lib/viz-stones';

const steps = ['photo', 'stone', 'result'] as const;

export async function KitchenVizSection() {
  const t = await getTranslations('home.kitchenViz');
  const stones = vizStoneOptions();
  const image =
    imageBySlug('wizualizacje', 'astral-mist-application-image') ??
    pickImage('wizualizacje', 0, 'blaty');

  return (
    <section className="bg-ink-900 py-20 lg:py-28">
      <Container size="wide">
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:gap-14">
          <div>
            <p className="reveal-fade text-xs font-semibold tracking-[0.2em] text-brass-400 uppercase">
              {t('eyebrow')}
            </p>
            <h2 className="reveal mt-4 text-headline text-balance text-stone-50">
              {t('title')}
            </h2>
            <p className="reveal mt-5 max-w-xl text-lg leading-relaxed text-stone-300">
              {t('body')}
            </p>

            <ol className="reveal mt-8 space-y-4">
              {steps.map((step, index) => (
                <li key={step} className="flex gap-4 text-stone-200">
                  <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full bg-brass-500 text-sm font-medium text-ink-950">
                    {index + 1}
                  </span>
                  <span className="pt-1 leading-relaxed">{t(`steps.${step}`)}</span>
                </li>
              ))}
            </ol>

            {image ? (
              <div className="relative mt-10 hidden overflow-hidden rounded-2xl lg:block">
                <div className="relative aspect-[5/3]">
                  <SiteImageView
                    image={image}
                    alt={t('title')}
                    sizes="(min-width: 1024px) 36vw, 100vw"
                    fill
                    quality={90}
                  />
                </div>
              </div>
            ) : null}
          </div>

          <div className="reveal rounded-2xl bg-stone-50 p-5 shadow-lift sm:p-8">
            <KitchenVizTool stones={stones} variant="home" />
          </div>
        </div>
      </Container>
    </section>
  );
}
