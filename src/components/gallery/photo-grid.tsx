import { GalleryLightbox } from '@/components/gallery/gallery-lightbox';
import { SiteImageView } from '@/components/ui/site-image';
import type { SiteImage } from '@/data/images';

type PhotoGridProps = {
  images: SiteImage[];
  /** Tekst alternatywny dla n-tego zdjęcia - numer bierzemy z pozycji w siatce. */
  alt: (index: number) => string;
  hint: string;
};

/**
 * Siatka zdjęć realizacji. Renderuje się na serwerze; lightbox dostaje ją
 * jako `children` i odczytuje potrzebne dane z atrybutów `data-*`.
 */
export function PhotoGrid({ images, alt, hint }: PhotoGridProps) {
  return (
    <GalleryLightbox total={images.length}>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {images.map((image, index) => {
          const label = alt(index);

          return (
            <li key={image.src}>
              <button
                type="button"
                title={hint}
                aria-label={`${hint}: ${label}`}
                data-photo-index={index}
                data-src={image.src}
                data-width={image.width}
                data-height={image.height}
                data-alt={label}
                className="group block w-full cursor-zoom-in overflow-hidden rounded-md bg-stone-200"
              >
                <div className="relative aspect-4/5 overflow-hidden">
                  <SiteImageView
                    image={image}
                    alt={label}
                    fill
                    // Siatka nie rozciąga się ponad 1280 px, więc powyżej tej
                    // szerokości kafel ma stałe ~300 px - podajemy piksele,
                    // żeby `next/image` nie serwował dwa razy większego pliku.
                    sizes="(min-width: 1280px) 300px, (min-width: 1024px) 24vw, (min-width: 640px) 31vw, 47vw"
                    className="transition-transform duration-700 ease-out-soft group-hover:scale-[1.05]"
                  />
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </GalleryLightbox>
  );
}
