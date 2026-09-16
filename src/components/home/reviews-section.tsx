import { useTranslations } from 'next-intl';

import { buttonStyles } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { ExternalIcon, StarIcon } from '@/components/ui/icons';
import { SectionHeading } from '@/components/ui/section-heading';
import { reviews } from '@/data/reviews';
import { cn } from '@/lib/cn';
import { googleBusinessUrl } from '@/lib/site';

export function ReviewsSection() {
  const t = useTranslations('home.reviews');
  const tn = useTranslations('nav');

  return (
    <section className="bg-white py-20 lg:py-28">
      <Container size="wide">
        <SectionHeading
          eyebrow={t('eyebrow')}
          title={t('title')}
          subtitle={t('subtitle')}
        />

        <ul className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review, index) => (
            <li
              key={review.author}
              className={cn(
                'reveal flex flex-col rounded-3xl border border-ink-900/8 bg-stone-50 p-7',
                // Najdłuższa opinia dostaje więcej miejsca, żeby nie ucinać jej
                // w połowie zdania - to najmocniejsza rekomendacja, jaką mamy.
                index === 0 && 'lg:col-span-2',
              )}
            >
              <div
                className="flex gap-0.5 text-brass-500"
                aria-label={`${review.rating}/5`}
              >
                {Array.from({ length: review.rating }, (_, star) => (
                  <StarIcon key={star} width={16} height={16} />
                ))}
              </div>

              <blockquote
                lang={review.lang}
                className="mt-5 flex-1 leading-relaxed text-ink-700"
              >
                {review.text}
              </blockquote>

              <footer className="mt-6 flex items-center justify-between gap-3 border-t border-ink-900/8 pt-5">
                <cite className="text-sm font-medium text-ink-900 not-italic">
                  {review.author}
                </cite>
                <a
                  href={googleBusinessUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-stone-400 underline-offset-2 transition-colors hover:text-brass-600 hover:underline"
                >
                  {t('sourceLabel')}
                  <span className="sr-only"> {tn('externalHint')}</span>
                </a>
              </footer>
            </li>
          ))}
        </ul>

        <a
          href={googleBusinessUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonStyles('secondary', 'md', 'reveal mt-10 group')}
        >
          {t('cta')}
          <ExternalIcon
            width={16}
            height={16}
            className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
          <span className="sr-only"> {tn('externalHint')}</span>
        </a>
      </Container>
    </section>
  );
}
