import Image from 'next/image';

import type { SiteImage } from '@/data/images';
import { cn } from '@/lib/cn';

type SiteImageViewProps = {
  image: SiteImage;
  alt: string;
  /** Atrybut `sizes` - bez niego next/image serwuje niepotrzebnie duże pliki. */
  sizes: string;
  className?: string;
  /** Ustawiamy tylko dla zdjęcia, które jest największym elementem nad zgięciem. */
  priority?: boolean;
  /**
   * Tło na całą ramkę (hero, kafel z `aspect-*`). Bez tego `next/image`
   * liczy srcset od atrybutów width/height i przy rozciągnięciu CSS-em
   * serwuje za mały plik — zdjęcie wychodzi miękkie.
   */
  fill?: boolean;
  /** Domyślnie 75. Hero i inne LCP podnosimy, żeby żyłki kamienia nie znikały. */
  quality?: number;
};

/**
 * Cienka nakładka na `next/image`, która bierze wymiary i miniaturę blur
 * z manifestu. Wymiary z manifestu są tu kluczowe: przeglądarka rezerwuje
 * miejsce przed pobraniem pliku, więc strona nie skacze przy ładowaniu.
 */
export function SiteImageView({
  image,
  alt,
  sizes,
  className,
  priority = false,
  fill = false,
  quality,
}: SiteImageViewProps) {
  const classNames = cn(
    fill ? 'object-cover' : 'h-full w-full object-cover',
    className,
  );

  if (fill) {
    return (
      <Image
        src={image.src}
        alt={alt}
        fill
        sizes={sizes}
        placeholder="blur"
        blurDataURL={image.blurDataURL}
        priority={priority}
        quality={quality}
        className={classNames}
      />
    );
  }

  return (
    <Image
      src={image.src}
      alt={alt}
      width={image.width}
      height={image.height}
      sizes={sizes}
      placeholder="blur"
      blurDataURL={image.blurDataURL}
      priority={priority}
      quality={quality}
      className={classNames}
    />
  );
}
