/**
 * Przygotowuje logo z plików dostarczonych przez klienta.
 *
 * Uruchomienie: npm run logo:prepare
 *
 * Klient przysłał trzy pliki, wszystkie jako JPEG z wypalonym tłem - również
 * ten nazwany „bez tła”. Nie ma więc kanału alfa, a logo trafia i na jasny
 * nagłówek, i na ciemną stopkę, więc tło trzeba wyciąć tutaj.
 *
 * Zamiast jednego progu na całym obrazie liczymy alfę jako odległość piksela
 * od koloru tła. Dzięki temu czerwony i szary kwadrat w godle zostają
 * nieprzezroczyste - próg oparty o samą jasność zamieniłby czerwień
 * w półprzezroczystą plamę.
 *
 * Każdy wariant powstaje z pliku o pasującym tle (biały napis z czarnego,
 * ciemny napis z białego) i jest używany tylko na podobnym tle. Resztki
 * po kluczowaniu - poświata przy krawędziach liter - są wtedy niewidoczne.
 *
 * TODO: gdy klient znajdzie logo w wektorze (SVG/AI/EPS), ten skrypt przestaje
 * być potrzebny - wystarczy podmienić pliki w `src/assets/logo`.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

import sharp from 'sharp';

const ROOT = process.cwd();
const SRC = path.join(ROOT, 'assets', 'logo');
const OUT_ASSETS = path.join(ROOT, 'src', 'assets', 'logo');
const OUT_APP = path.join(ROOT, 'src', 'app');
const OUT_OG = path.join(ROOT, 'public', 'og');
const OUT_PUBLIC_LOGO = path.join(ROOT, 'public', 'logo');

/** Kolor tła strony w wersji ciemnej - `--color-ink-950` z `globals.css`. */
const INK_950 = { r: 13, g: 15, b: 19 };

type KeyOptions = {
  /** Tło pliku źródłowego, które ma zniknąć. */
  background: 'black' | 'white';
  /**
   * Poniżej tej odległości od tła piksel jest w pełni przezroczysty - zjada
   * szum JPEG-a w tle. Powyżej `hard` piksel jest w pełni nieprzezroczysty,
   * między progami alfa rośnie liniowo, co zachowuje wygładzone krawędzie.
   */
  soft: number;
  hard: number;
};

/**
 * Zamienia tło na kanał alfa. Kolory pikseli zostają nietknięte - obraz jest
 * spłaszczoną kompozycją, więc nie ma czego odwracać, a każde „odpremultiplikowanie”
 * rozjaśniałoby czerwień godła.
 */
async function keyOut(file: string, { background, soft, hard }: KeyOptions) {
  const { data, info } = await sharp(file)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const pixels = info.width * info.height;
  const out = Buffer.alloc(pixels * 4);

  for (let i = 0; i < pixels; i++) {
    const s = i * info.channels;
    const r = data[s];
    const g = data[s + 1];
    const b = data[s + 2];

    // Dla czarnego tła liczy się najjaśniejszy kanał (czerwień godła ma
    // wysokie R), dla białego - najciemniejszy.
    const distance =
      background === 'black'
        ? Math.max(r, g, b)
        : 255 - Math.min(r, g, b);

    let alpha = 0;
    if (distance >= hard) alpha = 255;
    else if (distance > soft)
      alpha = Math.round(((distance - soft) / (hard - soft)) * 255);

    const d = i * 4;
    out[d] = r;
    out[d + 1] = g;
    out[d + 2] = b;
    out[d + 3] = alpha;
  }

  return sharp(out, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    // Obcinamy przezroczysty margines, żeby wysokość logo w layoucie
    // odpowiadała samej grafice, a nie przypadkowemu marginesowi w pliku.
    .trim({ threshold: 1 })
    .png();
}

/** Granice czerwonego kwadratu godła - punkt odniesienia dla wycinka ikony. */
async function findRedSquare(png: Buffer) {
  const { data, info } = await sharp(png)
    .raw()
    .toBuffer({ resolveWithObject: true });

  let left = info.width;
  let right = -1;
  let top = info.height;
  let bottom = -1;

  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) {
      const i = (y * info.width + x) * info.channels;
      const isRed =
        data[i + 3] > 200 && data[i] > 110 && data[i + 1] < 70 && data[i + 2] < 70;
      if (!isRed) continue;

      if (x < left) left = x;
      if (x > right) right = x;
      if (y < top) top = y;
      if (y > bottom) bottom = y;
    }
  }

  if (right < 0) throw new Error('Nie znaleziono czerwonego kwadratu w logo.');

  return { left, right, top, bottom };
}

async function main() {
  await mkdir(OUT_ASSETS, { recursive: true });
  await mkdir(OUT_OG, { recursive: true });

  // --- Wariant na ciemne tło (biały napis) ---------------------------------
  const light = await keyOut(path.join(SRC, 'wordmark-on-black.jpg'), {
    background: 'black',
    soft: 10,
    hard: 42,
  });

  const lightBuffer = await light
    .resize({ width: 720, withoutEnlargement: true })
    .toBuffer({ resolveWithObject: true });

  await writeFile(
    path.join(OUT_ASSETS, 'wordmark-light.png'),
    lightBuffer.data,
  );

  // --- Wariant na jasne tło (ciemny napis) --------------------------------
  // Plik od klienta jest mniejszy (652 px), ale nagłówek pokazuje logo
  // w ok. 190 px, więc zapasu jest dość nawet na ekranach 2x.
  const dark = await keyOut(path.join(SRC, 'wordmark-on-white.jpg'), {
    background: 'white',
    soft: 6,
    hard: 20,
  });

  const darkBuffer = await dark
    .resize({ width: 720, withoutEnlargement: true })
    .toBuffer({ resolveWithObject: true });

  await writeFile(path.join(OUT_ASSETS, 'wordmark-dark.png'), darkBuffer.data);

  // --- Godło do ikony i mediów społecznościowych --------------------------
  // Cały znak słowny w 32x32 px jest nieczytelny, więc do favikony wycinamy
  // samo godło - blok czterech kwadratów z literą „G”.
  //
  // Szerokość bloku wyliczamy z czerwonego kwadratu, a nie wpisujemy na sztywno:
  // czerwony to lewy górny z czterech, więc jego prawa krawędź wypada na środku
  // bloku. Dzięki temu wycinek trafia w ramkę godła nawet po podmianie plików
  // źródłowych na inne rozdzielczości.
  const lightMeta = await sharp(lightBuffer.data).metadata();
  const red = await findRedSquare(lightBuffer.data);

  const emblemWidth = Math.min(
    lightMeta.width ?? 0,
    // Czerwony kwadrat to lewy górny z czterech, więc prawa krawędź bloku
    // wypada w `right + (right - left)`. Litera G wystaje poza ramkę o kilka
    // pikseli - 12 px to szczelina między G a „r” z napisu Granit.
    red.right + (red.right - red.left) + 10,
  );

  const emblem = await sharp(lightBuffer.data)
    .extract({
      left: 0,
      top: 0,
      width: emblemWidth,
      height: lightMeta.height ?? 0,
    })
    .resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  await writeFile(path.join(OUT_ASSETS, 'emblem.png'), emblem);

  // Favikona i ikona na ekran główny. Next.js podłącza je automatycznie
  // z `src/app/icon.png` i `src/app/apple-icon.png`.
  const iconBackground = { ...INK_950, alpha: 1 };

  const icon = await sharp(emblem)
    .resize(432, 432, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .extend({
      top: 40,
      bottom: 40,
      left: 40,
      right: 40,
      background: iconBackground,
    })
    .flatten({ background: iconBackground })
    .png()
    .toBuffer();

  await writeFile(path.join(OUT_APP, 'icon.png'), icon);
  await writeFile(path.join(OUT_APP, 'apple-icon.png'), icon);

  // --- Obrazek Open Graph -------------------------------------------------
  // Metadane wskazywały na `/og/default.jpg`, którego nie było w repozytorium -
  // każdy link wrzucony na Facebooka czy WhatsAppa pokazywał się bez grafiki.
  const ogWidth = 1200;
  const ogHeight = 630;

  const ogLogo = await sharp(lightBuffer.data)
    .resize({ width: 760, withoutEnlargement: true })
    .toBuffer();

  const og = await sharp({
    create: {
      width: ogWidth,
      height: ogHeight,
      channels: 4,
      background: iconBackground,
    },
  })
    .composite([{ input: ogLogo, gravity: 'center' }])
    .jpeg({ quality: 88, progressive: true, mozjpeg: true })
    .toBuffer();

  await writeFile(path.join(OUT_OG, 'default.jpg'), og);

  // --- Logo pod stałym adresem -------------------------------------------
  // Dane strukturalne, wizytówka Google i stopki maili potrzebują logo pod
  // niezmiennym URL-em, a pliki z `src/assets` przechodzą przez optymalizator
  // i mają hash w adresie. Dlatego jedna kopia ląduje w `public`.
  await mkdir(OUT_PUBLIC_LOGO, { recursive: true });

  const brandLogo = await sharp({
    create: {
      width: 1200,
      height: 400,
      channels: 4,
      background: iconBackground,
    },
  })
    .composite([
      {
        input: await sharp(lightBuffer.data)
          .resize({ width: 960, withoutEnlargement: true })
          .toBuffer(),
        gravity: 'center',
      },
    ])
    .png()
    .toBuffer();

  await writeFile(
    path.join(OUT_PUBLIC_LOGO, 'polonia-granit.png'),
    brandLogo,
  );

  const darkMeta = await sharp(darkBuffer.data).metadata();

  console.log('Gotowe:');
  console.log(
    `  src/assets/logo/wordmark-light.png  ${lightMeta.width}x${lightMeta.height}`,
  );
  console.log(
    `  src/assets/logo/wordmark-dark.png   ${darkMeta.width}x${darkMeta.height}`,
  );
  console.log('  src/assets/logo/emblem.png          512x512');
  console.log('  src/app/icon.png, src/app/apple-icon.png  512x512');
  console.log(`  public/og/default.jpg               ${ogWidth}x${ogHeight}`);
  console.log('  public/logo/polonia-granit.png      1200x400');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
