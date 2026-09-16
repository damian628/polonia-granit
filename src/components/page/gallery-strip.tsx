import { useTranslations } from 'next-intl';

import { buttonStyles } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { SectionHeading } from '@/components/ui/section-heading';
import { SiteImageView } from '@/components/ui/site-image';
import { imagesIn } from '@/data/images';
import { Link } from '@/i18n/navigation';

type GalleryStripProps = {
  /** Kategoria w manifeście, np. `realizacje/nowoczesne`. */
  category: string;
  /** Tekst alternatywny - opisowy, taki sam dla całej serii. */
  alt: string;
  limit?: number;
};

export function GalleryStrip({ category, alt, limit = 8 }: GalleryStripProps) {
  const t = useTranslations('offer.common');
  const images = imagesIn(category).slice(0, limit);

  // Poniżej czterech zdjęć siatka wygląda jak niedokończona - lepiej wtedy
  // nie pokazywać sekcji wcale. Dotyczy parapetów, schodów i kominków, do
  // których nie ma jeszcze własnych zdjęć z realizacji.
  if (images.length < 4) return null;

  return (
    <section className="bg-stone-50 py-20 lg:py-28">
      <Container size="wide">
        <SectionHeading title={t('galleryTitle')} />

        <ul className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {images.map((image, index) => (
            <li
              key={image.src}
              className="reveal-zoom overflow-hidden rounded-2xl bg-stone-200"
            >
              <div className="aspect-square">
                <SiteImageView
                  image={image}
                  alt={`${alt} — ${index + 1}`}
                  sizes="(min-width: 1024px) 22vw, (min-width: 640px) 30vw, 45vw"
                />
              </div>
            </li>
          ))}
        </ul>

        <Link
          href="/realizacje"
          className={buttonStyles('secondary', 'md', 'reveal mt-10')}
        >
          {t('galleryCta')}
        </Link>
      </Container>
    </section>
  );
}
