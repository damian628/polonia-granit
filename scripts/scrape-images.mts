/**
 * Zasysa zdjęcia ze starej strony poloniagranit.pl do `scripts/.cache/raw`.
 *
 * Uruchomienie: npm run images:scrape
 *
 * Zdjęcia na starej stronie są osadzone na trzy sposoby: w `src`/`srcset`
 * tagów <img>, w atrybutach Elementora oraz w regułach `background-image`
 * wewnątrz arkuszy CSS generowanych per podstrona. Skrypt obsługuje wszystkie
 * trzy, a z każdego adresu odtwarza oryginał (WordPress dokleja do nazwy
 * sufiks rozmiaru, np. `-1024x768`).
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

import { OLD_SITE_ORIGIN, sourcePages } from './source-pages.mts';

const RAW_DIR = path.join(process.cwd(), 'scripts', '.cache', 'raw');
const MANIFEST_PATH = path.join(
  process.cwd(),
  'scripts',
  '.cache',
  'scrape-manifest.json',
);

/** Sufiks rozmiaru dokładany przez WordPress: `nazwa-1024x768.jpg`. */
const SIZE_SUFFIX = /-\d{2,4}x\d{2,4}(?=\.[a-z]{3,4}$)/i;

const IMAGE_URL = /https:\/\/poloniagranit\.pl\/wp-content\/uploads\/[^"'()\s\\]+?\.(?:jpg|jpeg|png)/gi;
// WordPress wypisuje znaczniki <link> w apostrofach, a nie w cudzysłowach,
// dlatego dopuszczamy oba warianty. Tu siedzą tła sekcji i slajdów hero,
// generowane przez Elementora do plików `uploads/elementor/css/post-*.css`.
const STYLESHEET =
  /<link[^>]+href=["']([^"']*poloniagranit\.pl[^"']*\.css[^"']*)["']/gi;

type ScrapedImage = {
  /** Adres oryginału na starej stronie. */
  url: string;
  /** Ścieżka pliku w cache, względem `scripts/.cache/raw`. */
  file: string;
  category: string;
  /** Podstrony, na których zdjęcie występuje - pomaga przy porządkowaniu. */
  pages: string[];
};

function toOriginalUrl(url: string): string {
  return url.replace(SIZE_SUFFIX, '');
}

function fileNameFor(url: string): string {
  const uploadsPath = url.split('/wp-content/uploads/')[1] ?? '';
  // `2024/06/N12-1.jpg` -> `2024-06-N12-1.jpg`, żeby nie tworzyć drzewa katalogów.
  return uploadsPath.replace(/\//g, '-');
}

async function fetchText(url: string): Promise<string | null> {
  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': 'PoloniaGranit-Migration/1.0' },
    });
    if (!response.ok) {
      console.warn(`  ! ${response.status} ${url}`);
      return null;
    }
    return await response.text();
  } catch (error) {
    console.warn(`  ! nie udało się pobrać ${url}: ${String(error)}`);
    return null;
  }
}

async function downloadBinary(url: string, target: string): Promise<boolean> {
  if (existsSync(target)) return true;

  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': 'PoloniaGranit-Migration/1.0' },
    });
    if (!response.ok) {
      console.warn(`  ! ${response.status} ${url}`);
      return false;
    }
    await writeFile(target, Buffer.from(await response.arrayBuffer()));
    return true;
  } catch (error) {
    console.warn(`  ! błąd zapisu ${url}: ${String(error)}`);
    return false;
  }
}

function collectUrls(html: string): Set<string> {
  const found = new Set<string>();
  for (const match of html.matchAll(IMAGE_URL)) {
    found.add(toOriginalUrl(match[0]));
  }
  return found;
}

async function main() {
  await mkdir(RAW_DIR, { recursive: true });

  /** url -> wpis; pierwszy trafiony kategoria wygrywa, kolejne dopisują stronę. */
  const images = new Map<string, ScrapedImage>();
  const seenStylesheets = new Set<string>();

  for (const page of sourcePages) {
    const pageUrl = `${OLD_SITE_ORIGIN}${page.path}`;
    console.log(`→ ${page.path}  [${page.category}]`);

    const html = await fetchText(pageUrl);
    if (!html) continue;

    const urls = collectUrls(html);

    // Tła hero i sekcji siedzą w arkuszach CSS Elementora, nie w HTML-u.
    for (const match of html.matchAll(STYLESHEET)) {
      const cssUrl = match[1].replace(/&#0?38;/g, '&');
      if (seenStylesheets.has(cssUrl)) continue;
      seenStylesheets.add(cssUrl);

      const css = await fetchText(cssUrl);
      if (!css) continue;
      for (const url of collectUrls(css)) urls.add(url);
    }

    for (const url of urls) {
      // Logotypy, ikonki i grafiki interfejsu nas nie interesują.
      if (/logo|favicon|cropped-|google_2015|icon|placeholder/i.test(url)) {
        continue;
      }

      const existing = images.get(url);
      if (existing) {
        if (!existing.pages.includes(page.path)) existing.pages.push(page.path);
        continue;
      }

      images.set(url, {
        url,
        file: fileNameFor(url),
        category: page.category,
        pages: [page.path],
      });
    }

    console.log(`  znaleziono ${urls.size} adresów`);
  }

  console.log(`\nPobieram ${images.size} unikalnych plików...`);

  let downloaded = 0;
  let failed = 0;
  const entries = [...images.values()];

  // Pobieramy porcjami, żeby nie zalać serwera starej strony żądaniami.
  const BATCH = 8;
  for (let i = 0; i < entries.length; i += BATCH) {
    const batch = entries.slice(i, i + BATCH);
    const results = await Promise.all(
      batch.map((entry) =>
        downloadBinary(entry.url, path.join(RAW_DIR, entry.file)),
      ),
    );
    for (const ok of results) {
      if (ok) downloaded++;
      else failed++;
    }
    console.log(`  ${Math.min(i + BATCH, entries.length)}/${entries.length}`);
  }

  await writeFile(MANIFEST_PATH, JSON.stringify(entries, null, 2), 'utf8');

  console.log(`\nGotowe: ${downloaded} pobranych, ${failed} nieudanych.`);
  console.log(`Manifest: ${path.relative(process.cwd(), MANIFEST_PATH)}`);
  console.log('Następny krok: npm run images:optimize');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
