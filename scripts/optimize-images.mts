/**
 * Przerabia surowe zdjęcia z `scripts/.cache/raw` na wersje produkcyjne
 * w `public/img/**` i generuje manifest z wymiarami oraz miniaturami blur.
 *
 * Uruchomienie: npm run images:optimize
 *
 * Do repozytorium wrzucamy tylko źródłowy JPEG w rozsądnej rozdzielczości -
 * warianty AVIF i WebP dla konkretnych szerokości generuje w locie
 * `next/image`, więc nie ma sensu trzymać ich w plikach.
 */
import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

import sharp from 'sharp';

type ScrapeEntry = {
  url: string;
  file: string;
  category: string;
  pages: string[];
};

export type OptimizedImage = {
  /** Ścieżka publiczna, gotowa do wstawienia w `next/image`. */
  src: string;
  width: number;
  height: number;
  /** Rozmyta miniatura 20px w base64 - `placeholder="blur"` bez migania. */
  blurDataURL: string;
  category: string;
  /** Nazwa pliku bez rozszerzenia - używana jako klucz i do nazw wyświetlanych. */
  slug: string;
};

const RAW_DIR = path.join(process.cwd(), 'scripts', '.cache', 'raw');
const OUT_DIR = path.join(process.cwd(), 'public', 'img');
const MANIFEST_IN = path.join(
  process.cwd(),
  'scripts',
  '.cache',
  'scrape-manifest.json',
);
const MANIFEST_OUT = path.join(
  process.cwd(),
  'src',
  'data',
  'generated',
  'image-manifest.json',
);

/**
 * Maksymalna szerokość per kategoria. Hero musi być ostre na dużych ekranach,
 * próbki kamienia pokazujemy w małych kaflach, a galeria realizacji trafia
 * do lightboxa, więc potrzebuje czegoś pośredniego.
 */
const maxWidths: Array<[prefix: string, width: number]> = [
  ['hero', 2200],
  ['firma', 1800],
  ['oferta', 1800],
  ['wizualizacje', 1600],
  ['realizacje', 1400],
  ['kamienie', 1100],
];

/**
 * Zdjęcia aranżacyjne PACIFIC mają u góry wypalony pas z logotypami
 * (Pacific / Polonia Granit / Hurtownia Kamienia). Pas jest proporcjonalny do
 * szerokości kadru, więc odcinamy go ułamkiem szerokości, nie wysokości.
 */
const topCropRatio: Record<string, number> = {
  wizualizacje: 0.125,
};

/** Ile zdjęć maksymalnie zostawiamy w jednej kategorii galerii. */
const CATEGORY_CAP: Record<string, number> = {
  'realizacje/grobowce': 90,
  'realizacje/ziemne': 70,
  'realizacje/podwojne': 70,
  'realizacje/urnowe': 60,
  'realizacje/nowoczesne': 60,
  'realizacje/ukosne': 40,
  'realizacje/niemieckie': 40,
  'realizacje/czeskie': 30,
};

function maxWidthFor(category: string): number {
  const match = maxWidths.find(([prefix]) => category.startsWith(prefix));
  return match ? match[1] : 1600;
}

const DIACRITICS: Record<string, string> = {
  ą: 'a',
  ć: 'c',
  ę: 'e',
  ł: 'l',
  ń: 'n',
  ó: 'o',
  ś: 's',
  ź: 'z',
  ż: 'z',
};

function slugify(name: string): string {
  return name
    .toLowerCase()
    // Prefiks z datą uploadu w WordPressie: `2019-10-`, `2026-02-`.
    .replace(/^\d{4}-\d{2}-/, '')
    .replace(/\.(jpe?g|png)$/i, '')
    // WordPress dokleja `-scaled` do plików przeskalowanych przy uploadzie.
    .replace(/-scaled$/, '')
    .replace(/[ąćęłńóśźż]/g, (char) => DIACRITICS[char] ?? char)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function main() {
  const entries: ScrapeEntry[] = JSON.parse(await readFile(MANIFEST_IN, 'utf8'));

  // Ten sam plik potrafi występować pod kilkoma nazwami (`-scaled`, `-1`),
  // dlatego odsiewamy duplikaty po skrócie zawartości, a nie po nazwie.
  const seenHashes = new Set<string>();
  // Osobno pilnujemy nazw wyjściowych: `Alchemy-Closeup-Polished.jpg` i
  // `Alchemy-Closeup-Polished-scaled.jpg` mają różną zawartość, więc skrót ich
  // nie złapie, a po slugifikacji trafiłyby do tego samego pliku.
  const seenSlugs = new Set<string>();
  const perCategory = new Map<string, number>();
  const results: OptimizedImage[] = [];

  let skippedDuplicate = 0;
  let skippedCap = 0;
  let failed = 0;

  // Bez `-scaled` na początku - jeśli oryginał istnieje, wygra w deduplikacji.
  const ordered = [...entries].sort((a, b) => {
    const aScaled = a.file.includes('-scaled') ? 1 : 0;
    const bScaled = b.file.includes('-scaled') ? 1 : 0;
    if (aScaled !== bScaled) return aScaled - bScaled;
    return a.file.localeCompare(b.file, 'pl');
  });

  for (const entry of ordered) {
    const cap = CATEGORY_CAP[entry.category];
    const used = perCategory.get(entry.category) ?? 0;
    if (cap !== undefined && used >= cap) {
      skippedCap++;
      continue;
    }

    const slugKey = `${entry.category}/${slugify(entry.file)}`;
    if (seenSlugs.has(slugKey)) {
      skippedDuplicate++;
      continue;
    }

    let buffer: Buffer;
    try {
      buffer = await readFile(path.join(RAW_DIR, entry.file));
    } catch {
      failed++;
      continue;
    }

    const hash = createHash('sha1').update(buffer).digest('hex');
    if (seenHashes.has(hash)) {
      skippedDuplicate++;
      continue;
    }
    seenHashes.add(hash);
    seenSlugs.add(slugKey);

    const slug = slugify(entry.file);
    const targetDir = path.join(OUT_DIR, entry.category);
    await mkdir(targetDir, { recursive: true });

    try {
      // Kadrowanie i obrót muszą się wydarzyć przed skalowaniem, żeby wyciąć
      // pas z logotypami w oryginalnej rozdzielczości.
      const prepared = await sharp(buffer)
        .rotate()
        .toBuffer({ resolveWithObject: true });

      const cropRatio = topCropRatio[entry.category.split('/')[0]];
      let source = prepared.data;

      if (cropRatio) {
        const top = Math.round(prepared.info.width * cropRatio);
        source = await sharp(prepared.data)
          .extract({
            left: 0,
            top,
            width: prepared.info.width,
            height: prepared.info.height - top,
          })
          .toBuffer();
      }

      const output = await sharp(source)
        .resize({
          width: maxWidthFor(entry.category),
          withoutEnlargement: true,
        })
        .jpeg({ quality: 78, progressive: true, mozjpeg: true })
        .toBuffer({ resolveWithObject: true });

      await writeFile(path.join(targetDir, `${slug}.jpg`), output.data);

      // Miniatura 20px wystarcza na placeholder i waży ok. 500 bajtów.
      const blur = await sharp(source)
        .resize({ width: 20 })
        .jpeg({ quality: 40 })
        .toBuffer();

      results.push({
        src: `/img/${entry.category}/${slug}.jpg`,
        width: output.info.width,
        height: output.info.height,
        blurDataURL: `data:image/jpeg;base64,${blur.toString('base64')}`,
        category: entry.category,
        slug,
      });

      perCategory.set(entry.category, used + 1);
    } catch (error) {
      console.warn(`  ! ${entry.file}: ${String(error)}`);
      failed++;
    }

    if (results.length % 50 === 0) {
      console.log(`  przetworzono ${results.length}...`);
    }
  }

  await mkdir(path.dirname(MANIFEST_OUT), { recursive: true });
  results.sort((a, b) => a.src.localeCompare(b.src, 'pl'));
  await writeFile(MANIFEST_OUT, JSON.stringify(results, null, 2), 'utf8');

  console.log('\n--- Podsumowanie ---');
  console.log(`Zapisanych zdjęć:        ${results.length}`);
  console.log(`Pominiętych duplikatów:  ${skippedDuplicate}`);
  console.log(`Pominiętych przez limit: ${skippedCap}`);
  console.log(`Błędów:                  ${failed}`);

  const byCategory = new Map<string, number>();
  for (const image of results) {
    byCategory.set(image.category, (byCategory.get(image.category) ?? 0) + 1);
  }
  console.log('\nPo kategoriach:');
  for (const [category, count] of [...byCategory].sort()) {
    console.log(`  ${String(count).padStart(4)}  ${category}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
