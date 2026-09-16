import { imageBySlug } from '@/data/images';
import {
  conglomerates,
  granites,
  stoneImageCategory,
  type Stone,
} from '@/data/stones';

export type VizStoneOption = {
  slug: string;
  name: string;
  material: Stone['material'];
  swatch: string;
  src: string;
};

function toOption(stone: Stone): VizStoneOption | null {
  const image = imageBySlug(stoneImageCategory(stone.material), stone.slug);
  if (!image) return null;
  return {
    slug: stone.slug,
    name: stone.name,
    material: stone.material,
    swatch: stone.swatch,
    src: image.src,
  };
}

/** Pacific najpierw — powtarzalny wzór wychodzi wiarygodniej niż unikalny granit. */
export function vizStoneOptions(): VizStoneOption[] {
  return [...conglomerates, ...granites]
    .map(toOption)
    .filter((stone): stone is VizStoneOption => stone !== null);
}

export function findVizStone(slug: string): VizStoneOption | undefined {
  return vizStoneOptions().find((stone) => stone.slug === slug);
}
