/**
 * Wylicza dominujący kolor każdej próbki kamienia i proponuje grupę kolorystyczną.
 *
 * Uruchomienie: node scripts/analyze-stone-colors.mts
 *
 * Wynik służy do wypełnienia `src/data/stones.ts`. Kolor bierzemy z samego
 * zdjęcia próbki, a nie z nazwy handlowej - nazwy bywają mylące
 * ("Baltic Green" jest raczej czarno-zielony niż zielony).
 */
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

import sharp from 'sharp';

type ColorGroup =
  | 'czarny'
  | 'grafitowy'
  | 'szary'
  | 'jasny'
  | 'bezowy'
  | 'brazowy'
  | 'czerwony'
  | 'zielony'
  | 'niebieski'
  | 'wielokolorowy';

function rgbToHsl(r: number, g: number, b: number) {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const lightness = (max + min) / 2;
  const delta = max - min;

  if (delta === 0) return { hue: 0, saturation: 0, lightness };

  const saturation =
    lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min);

  let hue: number;
  if (max === rn) hue = ((gn - bn) / delta + (gn < bn ? 6 : 0)) / 6;
  else if (max === gn) hue = ((bn - rn) / delta + 2) / 6;
  else hue = ((rn - gn) / delta + 4) / 6;

  return { hue: hue * 360, saturation, lightness };
}

function classify(
  r: number,
  g: number,
  b: number,
  spread: number,
): ColorGroup {
  const { hue, saturation, lightness } = rgbToHsl(r, g, b);

  // Duży rozrzut kolorów w próbce to kamień wielobarwny, np. Multikolor.
  if (spread > 46 && saturation > 0.14) return 'wielokolorowy';

  if (saturation < 0.1) {
    if (lightness < 0.16) return 'czarny';
    if (lightness < 0.34) return 'grafitowy';
    if (lightness < 0.62) return 'szary';
    return 'jasny';
  }

  if (hue >= 60 && hue < 170) return 'zielony';
  if (hue >= 170 && hue < 260) return 'niebieski';
  if (hue >= 340 || hue < 15) return 'czerwony';
  if (hue >= 15 && hue < 45) {
    if (lightness > 0.6) return 'bezowy';
    return 'brazowy';
  }
  if (hue >= 260 && hue < 340) return 'czerwony';

  return lightness < 0.3 ? 'grafitowy' : 'szary';
}

async function analyze(file: string) {
  const buffer = await readFile(file);
  const image = sharp(buffer);

  // Kadr ze środka próbki - brzegi zdjęć bywają przycieniowane.
  const meta = await image.metadata();
  const width = meta.width ?? 0;
  const height = meta.height ?? 0;
  const cropped = sharp(buffer).extract({
    left: Math.round(width * 0.2),
    top: Math.round(height * 0.2),
    width: Math.max(1, Math.round(width * 0.6)),
    height: Math.max(1, Math.round(height * 0.6)),
  });

  const stats = await cropped.stats();
  const [red, green, blue] = stats.channels;

  // Średnia z odchyleń standardowych mówi, jak niejednolita jest próbka.
  const spread =
    (red.stdev + green.stdev + blue.stdev) / 3;

  const r = Math.round(red.mean);
  const g = Math.round(green.mean);
  const b = Math.round(blue.mean);

  return {
    hex: `#${[r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('')}`,
    group: classify(r, g, b, spread),
    spread: Math.round(spread),
  };
}

async function main() {
  for (const category of ['kamienie/granity', 'kamienie/konglomeraty']) {
    const dir = path.join(process.cwd(), 'public', 'img', category);
    const files = (await readdir(dir)).filter((f) => f.endsWith('.jpg')).sort();

    console.log(`\n// ${category} (${files.length})`);
    for (const file of files) {
      const slug = file.replace(/\.jpg$/, '');
      const { hex, group, spread } = await analyze(path.join(dir, file));
      console.log(
        `  { slug: '${slug}', color: '${group}', swatch: '${hex}' },`.padEnd(66) +
          `// rozrzut ${spread}`,
      );
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
