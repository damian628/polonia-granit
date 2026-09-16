import { SiteImageView } from '@/components/ui/site-image';
import { imageBySlug } from '@/data/images';
import { type Stone, stoneImageCategory } from '@/data/stones';

type StoneCardProps = {
  stone: Stone;
  /** Nazwa wykończenia w języku strony. Pusta - nie pokazujemy plakietki. */
  finishLabel?: string;
};

/**
 * Kafel katalogu. Renderuje się wyłącznie na serwerze - atrybuty
 * `data-stone-material` i `data-stone-color` wystarczają, by CSS ukrył go
 * przy aktywnym filtrze (patrz `globals.css`).
 */
export function StoneCard({ stone, finishLabel }: StoneCardProps) {
  const image = imageBySlug(stoneImageCategory(stone.material), stone.slug);

  return (
    <li
      data-stone-material={stone.material}
      data-stone-color={stone.color}
      // Bez animacji odsłaniania. Kafle są ukrywane i pokazywane filtrem,
      // a animacja liczona z pozycji w oknie zaczynałaby się wtedy od zera -
      // po każdym kliknięciu filtra kafle mrugałyby przezroczystością.
      className="group overflow-hidden rounded-lg bg-white shadow-lift"
    >
      <div className="relative aspect-square overflow-hidden bg-stone-200">
        {image ? (
          <SiteImageView
            image={image}
            alt={stone.name}
            sizes="(min-width: 1280px) 300px, (min-width: 1024px) 24vw, (min-width: 640px) 31vw, 47vw"
            className="transition-transform duration-700 ease-out-soft group-hover:scale-[1.06]"
          />
        ) : null}
      </div>
      <div className="px-4 py-3.5">
        <p className="text-sm font-medium text-ink-900">{stone.name}</p>
        {finishLabel ? (
          <p className="mt-0.5 text-xs text-stone-500">{finishLabel}</p>
        ) : null}
      </div>
    </li>
  );
}
