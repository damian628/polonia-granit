import Image from 'next/image';

import wordmarkDark from '@/assets/logo/wordmark-dark.png';
import wordmarkLight from '@/assets/logo/wordmark-light.png';
import { cn } from '@/lib/cn';
import { site } from '@/lib/site';

/**
 * Znak firmowy w dwóch wariantach. Klient przysłał logo tylko w JPEG-ach
 * z wypalonym tłem, więc przezroczyste PNG-i powstają ze skryptu
 * `npm run logo:prepare` - patrz `scripts/prepare-logo.mts`.
 *
 * Wariant `light` (biały napis) idzie na ciemne tła, `dark` na jasne.
 * Wysokość ustawiamy klasą na `<Image>`, szerokość dolicza się z proporcji
 * pliku - dlatego logo nigdy się nie rozjeżdża ani nie skacze przy ładowaniu.
 *
 * TODO: gdy klient znajdzie wersję wektorową, podmieniamy pliki w
 * `src/assets/logo` i ten komponent zostaje bez zmian.
 */
const sizes = {
  xs: { className: 'h-10 w-auto max-w-[10rem]', sizes: '160px' },
  sm: {
    className:
      'h-9 w-auto max-w-[11rem] object-contain object-left sm:h-12 sm:max-w-[14rem] lg:h-[4.5rem] lg:max-w-none',
    sizes: '360px',
  },
  md: { className: 'h-16 sm:h-20', sizes: '360px' },
  lg: { className: 'h-32 sm:h-40 lg:h-52', sizes: '760px' },
} as const;

export function Logo({
  className,
  tone = 'dark',
  size = 'sm',
  priority = false,
}: {
  className?: string;
  tone?: 'dark' | 'light';
  /** `sm` nagłówek, `md` stopka, `lg` hero. */
  size?: keyof typeof sizes;
  /** Ustawiamy w nagłówku i hero - logo jest widoczne od pierwszej klatki. */
  priority?: boolean;
}) {
  const source = tone === 'light' ? wordmarkLight : wordmarkDark;
  const preset = sizes[size];

  return (
    <Image
      src={source}
      alt={site.name}
      priority={priority}
      // Logo ma stałą wysokość w layoucie, więc podpowiadamy przeglądarce
      // konkretny rozmiar zamiast ułamka szerokości okna.
      sizes={preset.sizes}
      className={cn(
        'w-auto',
        preset.className,
        tone === 'light'
          ? 'drop-shadow-[0_8px_24px_rgba(0,0,0,0.7)]'
          : 'contrast-[1.18]',
        className,
      )}
    />
  );
}