import { cn } from '@/lib/cn';

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  tone?: 'light' | 'dark';
  className?: string;
  as?: 'h1' | 'h2' | 'h3';
};

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'left',
  tone = 'light',
  className,
  as: Heading = 'h2',
}: SectionHeadingProps) {
  const isDark = tone === 'dark';

  return (
    <div
      className={cn(
        'reveal max-w-3xl',
        align === 'center' && 'mx-auto text-center',
        className,
      )}
    >
      {eyebrow ? (
        <p
          className={cn(
            'mb-4 text-xs font-semibold tracking-[0.2em] uppercase',
            isDark ? 'text-brass-400' : 'text-brass-600',
          )}
        >
          {eyebrow}
        </p>
      ) : null}

      <Heading
        className={cn(
          'text-headline text-balance',
          isDark ? 'text-stone-50' : 'text-ink-900',
        )}
      >
        {title}
      </Heading>

      {subtitle ? (
        <p
          className={cn(
            'mt-5 text-lg leading-relaxed',
            isDark ? 'text-stone-300' : 'text-ink-600',
          )}
        >
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
