/**
 * Kompresuje wybrane zdjęcia z dysku TOSHIBA i dopisuje je do
 * `public/img` oraz `src/data/generated/image-manifest.json`.
 *
 * npm run images:import-client
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

import sharp from 'sharp';

type OptimizedImage = {
  src: string;
  width: number;
  height: number;
  blurDataURL: string;
  category: string;
  slug: string;
};

const SOURCE_ROOT =
  '/Volumes/TOSHIBA EXT/Polonia Granit/Materiał na posty ( Zdjęcia )';
const AI_ROOT = '/Volumes/TOSHIBA EXT/Polonia Granit/Animacje AI';
const OUT_DIR = path.join(process.cwd(), 'public', 'img');
const MANIFEST_OUT = path.join(
  process.cwd(),
  'src',
  'data',
  'generated',
  'image-manifest.json',
);

type Job = {
  from: string;
  category: string;
  slug: string;
  maxWidth: number;
  cropBottom?: number;
};

const wa = (name: string) => path.join(SOURCE_ROOT, name);

const blaty = [
  'WhatsApp Image 2026-06-30 at 13.53.47 (1).jpeg',
  'WhatsApp Image 2026-06-30 at 13.53.47 (3).jpeg',
  'WhatsApp Image 2026-06-30 at 13.53.48 (1).jpeg',
  'WhatsApp Image 2026-06-30 at 13.53.48 (4).jpeg',
  'WhatsApp Image 2026-06-30 at 13.53.49 (1).jpeg',
  'WhatsApp Image 2026-06-30 at 13.53.50 (1).jpeg',
  'WhatsApp Image 2026-06-30 at 13.53.50 (3).jpeg',
  'WhatsApp Image 2026-06-30 at 13.53.51 (1).jpeg',
  'WhatsApp Image 2026-06-30 at 13.53.51.jpeg',
  'WhatsApp Image 2026-06-30 at 13.53.52 (1).jpeg',
  'WhatsApp Image 2026-06-30 at 13.53.52.jpeg',
  'WhatsApp Image 2026-06-30 at 13.53.56.jpeg',
  'WhatsApp Image 2026-06-30 at 13.53.57.jpeg',
  'WhatsApp Image 2026-06-30 at 13.53.59 (1).jpeg',
  'WhatsApp Image 2026-07-17 at 06.31.32.jpeg',
  'WhatsApp Image 2026-07-17 at 06.31.34.jpeg',
  'WhatsApp Image 2026-07-17 at 06.31.35.jpeg',
  'WhatsApp Image 2026-07-17 at 06.32.03 (1).jpeg',
  'WhatsApp Image 2026-07-17 at 06.32.03.jpeg',
  'WhatsApp Image 2026-07-17 at 06.32.04 (1).jpeg',
  'WhatsApp Image 2026-07-17 at 06.32.04.jpeg',
  'WhatsApp Image 2026-07-17 at 06.32.49 (1).jpeg',
  'WhatsApp Image 2026-07-17 at 06.32.49.jpeg',
  'WhatsApp Image 2026-07-17 at 06.32.50 (1).jpeg',
  'WhatsApp Image 2026-07-17 at 06.32.50.jpeg',
  'WhatsApp Image 2026-07-17 at 06.32.51.jpeg',
];

const schody = [
  'WhatsApp Image 2026-06-30 at 13.53.48 (3).jpeg',
  'WhatsApp Image 2026-06-30 at 13.53.49 (2).jpeg',
  'WhatsApp Image 2026-06-30 at 13.53.50 (2).jpeg',
  'WhatsApp Image 2026-06-30 at 13.53.54.jpeg',
  'WhatsApp Image 2026-07-17 at 06.34.02.jpeg',
  'WhatsApp Image 2026-07-17 at 06.34.28 (1).jpeg',
  'WhatsApp Image 2026-07-17 at 06.34.28 (2).jpeg',
  'WhatsApp Image 2026-07-17 at 06.34.28.jpeg',
  'WhatsApp Image 2026-07-17 at 06.36.27.jpeg',
  'WhatsApp Image 2026-07-17 at 06.36.29 (1).jpeg',
  'WhatsApp Image 2026-07-17 at 06.36.29.jpeg',
  'WhatsApp Image 2026-07-17 at 06.36.55 (1).jpeg',
  'WhatsApp Image 2026-07-17 at 06.36.55.jpeg',
];

const igKitchen = [
  'IG-ANDROMEDA-kuchnia.jpg',
  'IG-ASTORIA-lazienka.jpg',
  'IG-BRAZ-KROLEWSKI-kuchnia.jpg',
  'IG-COLONIAL-GOLD-lazienka.jpg',
  'IG-COSMOPOLITAN-kuchnia.jpg',
  'IG-CRISTALLO-ORO-lazienka.jpg',
  'IG-IMPERIAL-WHITE-kuchnia.jpg',
  'IG-IMPERIAL-WHITE-lazienka.jpg',
  'IG-KASHMIR-GOLD-kuchnia.jpg',
  'IG-MAHARAJA-QUARTZ-lazienka.jpg',
  'IG-MILLENIUM-CREAM-kuchnia.jpg',
  'IG-NEW-STAR-RUBY-lazienka.jpg',
  'IG-PRADA-GOLD-kuchnia.jpg',
  'IG-PRETORIA-lazienka.jpg',
  'IG-SILK-BLUE-lazienka.jpg',
  'IG-SPRING-FALLS-kuchnia.jpg',
  'IG-VISCOUNT-WHITE-kuchnia.jpg',
  'IG-VISCOUNT-WHITE-lazienka.jpg',
];

const aiTombs = [
  'C1.jpg_2K_202609101434.jpeg',
  'C7.jpg_2K_202609101434.jpeg',
  'C8.jpg_2K_202609101434.jpeg',
  'C10.jpg_2K_202609101434.jpeg',
  'C11.jpg_2K_202609101434.jpeg',
  'C13.jpg_2K_202609101434.jpeg',
  'C14.jpg_2K_202609101434.jpeg',
  'C17.jpg_2K_202609101434.jpeg',
  'C18.jpg_2K_202609101434.jpeg',
];

function jobs(): Job[] {
  const list: Job[] = [];

  blaty.forEach((file, index) => {
    list.push({
      from: wa(file),
      category: 'realizacje/blaty',
      slug: `blat-${String(index + 1).padStart(2, '0')}`,
      maxWidth: 1400,
    });
  });

  schody.forEach((file, index) => {
    list.push({
      from: wa(file),
      category: 'realizacje/schody',
      slug: `schody-${String(index + 1).padStart(2, '0')}`,
      maxWidth: 1400,
    });
  });

  igKitchen.forEach((file) => {
    list.push({
      from: path.join(SOURCE_ROOT, 'Granity/wizualizacje-social', file),
      category: 'wizualizacje',
      slug: file.replace(/\.jpg$/i, '').toLowerCase(),
      maxWidth: 1400,
      cropBottom: 0.2,
    });
  });

  aiTombs.forEach((file, index) => {
    list.push({
      from: path.join(AI_ROOT, file),
      category: 'realizacje/nowoczesne',
      slug: `wizualizacja-nagrobek-${String(index + 1).padStart(2, '0')}`,
      maxWidth: 1400,
    });
  });

  return list;
}

async function optimize(job: Job): Promise<OptimizedImage> {
  const buffer = await readFile(job.from);
  const rotated = await sharp(buffer).rotate().toBuffer({ resolveWithObject: true });

  let source = rotated.data;
  const { width } = rotated.info;
  let { height } = rotated.info;

  if (job.cropBottom) {
    const cut = Math.round(height * job.cropBottom);
    source = await sharp(rotated.data)
      .extract({
        left: 0,
        top: 0,
        width,
        height: height - cut,
      })
      .toBuffer();
    height -= cut;
  }

  const output = await sharp(source)
    .resize({ width: job.maxWidth, withoutEnlargement: true })
    .jpeg({ quality: 76, progressive: true, mozjpeg: true })
    .toBuffer({ resolveWithObject: true });

  const blur = await sharp(source)
    .resize({ width: 20 })
    .jpeg({ quality: 40 })
    .toBuffer();

  const dir = path.join(OUT_DIR, job.category);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, `${job.slug}.jpg`), output.data);

  return {
    src: `/img/${job.category}/${job.slug}.jpg`,
    width: output.info.width,
    height: output.info.height,
    blurDataURL: `data:image/jpeg;base64,${blur.toString('base64')}`,
    category: job.category,
    slug: job.slug,
  };
}

async function main() {
  const existing: OptimizedImage[] = JSON.parse(
    await readFile(MANIFEST_OUT, 'utf8'),
  );
  const bySrc = new Map(existing.map((image) => [image.src, image]));

  let ok = 0;
  let failed = 0;
  let bytes = 0;

  for (const job of jobs()) {
    try {
      const image = await optimize(job);
      bySrc.set(image.src, image);
      const stat = await readFile(path.join(OUT_DIR, job.category, `${job.slug}.jpg`));
      bytes += stat.length;
      ok += 1;
      console.log(`  ${image.src}  ${(stat.length / 1024).toFixed(0)} KB`);
    } catch (error) {
      failed += 1;
      console.warn(`  ! ${job.from}: ${String(error)}`);
    }
  }

  const next = [...bySrc.values()].sort((a, b) => a.src.localeCompare(b.src, 'pl'));
  await writeFile(MANIFEST_OUT, JSON.stringify(next, null, 2), 'utf8');

  console.log(`\nZapisanych: ${ok}, błędów: ${failed}, razem ${(bytes / 1024 / 1024).toFixed(1)} MB`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
