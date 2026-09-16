'use server';

import { readFile } from 'node:fs/promises';
import path from 'node:path';

import sharp from 'sharp';

import { imageBySlug } from '@/data/images';
import { stoneImageCategory } from '@/data/stones';
import {
  consumeVizSlot,
  refundVizSlot,
  remainingVizSlots,
  VIZ_DAILY_LIMIT,
} from '@/lib/viz-limit';
import { findVizStone } from '@/lib/viz-stones';

const MAX_PHOTO_BYTES = 8 * 1024 * 1024;
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const MODELS = ['gpt-image-1.5', 'gpt-image-1'] as const;

export type KitchenVizState = {
  status: 'idle' | 'ok' | 'error';
  image?: string;
  stoneName?: string;
  remaining?: number;
  error?:
    | 'photo'
    | 'stone'
    | 'consent'
    | 'type'
    | 'tooLarge'
    | 'rate'
    | 'unconfigured'
    | 'generic';
};

type Canvas = {
  width: number;
  height: number;
  size: '1024x1024' | '1024x1536' | '1536x1024';
};

export async function generateKitchenViz(
  _prev: KitchenVizState,
  formData: FormData,
): Promise<KitchenVizState> {
  if (String(formData.get('website') ?? '').trim()) {
    return { status: 'ok', remaining: await remainingVizSlots() };
  }

  if (formData.get('consent') !== 'on') {
    return { status: 'error', error: 'consent' };
  }

  const slug = String(formData.get('stone') ?? '').trim();
  const stone = findVizStone(slug);
  if (!stone) {
    return { status: 'error', error: 'stone' };
  }

  const photo = formData.get('photo');
  if (!(photo instanceof File) || photo.size === 0) {
    return { status: 'error', error: 'photo' };
  }
  if (photo.size > MAX_PHOTO_BYTES) {
    return { status: 'error', error: 'tooLarge' };
  }
  if (photo.type && !ALLOWED_TYPES.has(photo.type)) {
    return { status: 'error', error: 'type' };
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return { status: 'error', error: 'unconfigured' };
  }

  const gate = await consumeVizSlot();
  if (!gate.ok) {
    return { status: 'error', error: 'rate', remaining: 0 };
  }

  try {
    const kitchen = await prepareKitchen(
      Buffer.from(await photo.arrayBuffer()),
    );
    const stoneJpeg = await readStoneSample(stone.slug, stone.material);

    const materialNote =
      stone.material === 'granit'
        ? 'Image 2 is natural granite. Copy its colour, grain scale and characteristic pattern onto every replaced stone surface; veins will not be identical to a specific slab.'
        : 'Image 2 is a manufactured quartz conglomerate with a repeating pattern. Match that pattern closely on worktops and walls, at a realistic installed-slab scale — not a giant wall mural.';

    console.info('[kitchen-viz] start', stone.name);
    const started = Date.now();

    const prompt = [
      'Image 1 is a real photograph of a kitchen. Image 2 is a close-up MATERIAL SAMPLE of the stone slab',
      `"${stone.name}". Use image 2 only as the stone texture, not as a scene.`,
      'Edit image 1 by recladding the kitchen stone surfaces listed below.',
      'Replace ALL of these with the stone from image 2, as one continuous installation:',
      '1) horizontal worktops / countertops, including the visible front edge and thickness;',
      '2) the backsplash — the wall between the worktop and the underside of the upper cabinets;',
      '3) existing stone, marble or tile wall cladding, including full-height panels beside a window.',
      'Veins must wrap naturally from the worktop onto the vertical walls, with correct perspective, polish and lighting.',
      'Do NOT put stone on: cabinet doors, drawer fronts, handles, plinths, painted side panels, floor tiles, window glass, frames, blinds, ceiling, built-in ovens, hobs, hoods, dishwashers or fridges.',
      'The new worktops must be completely EMPTY and CLEAN. Remove every object sitting on the counter (kettles, bottles, fruit, utensils, boards, appliances, plants). Do not leave warped remnants. Keep the built-in sink and tap.',
      materialNote,
      'Keep the exact camera angle, people and room lighting. Result must look like a real photograph of an installed kitchen, not a 3D render, collage, drawing, logo or watermark.',
    ].join(' ');

    const edited = await openaiEdit(apiKey, {
      prompt,
      size: kitchen.canvas.size,
      quality: 'medium',
      images: [
        { bytes: kitchen.jpeg, name: 'kitchen.jpg', type: 'image/jpeg' },
        { bytes: stoneJpeg, name: 'stone.jpg', type: 'image/jpeg' },
      ],
    });

    if (!edited) {
      await refundVizSlot();
      return { status: 'error', error: 'generic', remaining: gate.remaining + 1 };
    }

    console.info('[kitchen-viz] ok', stone.name, `${Date.now() - started}ms`);
    return {
      status: 'ok',
      image: edited,
      stoneName: stone.name,
      remaining: gate.remaining,
    };
  } catch (error) {
    console.error('[kitchen-viz]', error);
    await refundVizSlot();
    return {
      status: 'error',
      error: 'generic',
      remaining: Math.min(VIZ_DAILY_LIMIT, gate.remaining + 1),
    };
  }
}

async function openaiEdit(
  apiKey: string,
  options: {
    prompt: string;
    size: Canvas['size'];
    quality: 'low' | 'medium' | 'high';
    images: Array<{ bytes: Buffer; name: string; type: string }>;
  },
) {
  for (const model of MODELS) {
    const body = new FormData();
    body.set('model', model);
    body.set('prompt', options.prompt);
    body.set('size', options.size);
    body.set('quality', options.quality);
    body.set('output_format', 'jpeg');
    body.set('input_fidelity', 'high');
    for (const image of options.images) {
      body.append(
        'image[]',
        new Blob([new Uint8Array(image.bytes)], { type: image.type }),
        image.name,
      );
    }

    const response = await fetch('https://api.openai.com/v1/images/edits', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}` },
      body,
      signal: AbortSignal.timeout(90_000),
    });

    const payload = (await response.json()) as {
      error?: { message?: string; code?: string };
      data?: Array<{ b64_json?: string }>;
    };

    if (response.ok && payload.data?.[0]?.b64_json) {
      return payload.data[0].b64_json;
    }

    const message = payload.error?.message ?? String(response.status);
    console.error('[kitchen-viz] OpenAI', model, message);

    if (!isUnavailableModel(response.status, message)) {
      return null;
    }
  }

  return null;
}

function isUnavailableModel(status: number, message: string) {
  if (status === 404) return true;
  return /invalid model|model_not_found|unknown model|does not exist|model .* not found|not available/i.test(
    message,
  );
}

async function prepareKitchen(input: Buffer) {
  const image = sharp(input).rotate();
  const meta = await image.clone().metadata();
  const canvas = chooseCanvas(meta.width ?? 1536, meta.height ?? 1024);
  const jpeg = await image
    .resize(canvas.width, canvas.height, {
      fit: 'cover',
      position: 'attention',
    })
    .jpeg({ quality: 90 })
    .toBuffer();
  return { jpeg, canvas };
}

function chooseCanvas(width: number, height: number): Canvas {
  const ratio = width / height;
  if (ratio > 1.25) return { width: 1536, height: 1024, size: '1536x1024' };
  if (ratio < 0.8) return { width: 1024, height: 1536, size: '1024x1536' };
  return { width: 1024, height: 1024, size: '1024x1024' };
}

async function readStoneSample(slug: string, material: 'granit' | 'konglomerat') {
  const image = imageBySlug(stoneImageCategory(material), slug);
  if (!image) {
    throw new Error(`Brak próbki kamienia: ${slug}`);
  }

  const publicDir = path.join(process.cwd(), 'public');
  const abs = path.join(publicDir, image.src.replace(/^\//, ''));
  if (!abs.startsWith(publicDir)) {
    throw new Error('Nieprawidłowa ścieżka próbki');
  }

  const file = await readFile(abs);
  const pipeline = sharp(file).rotate();
  const meta = await pipeline.clone().metadata();
  const width = meta.width ?? 1024;
  const height = meta.height ?? 1024;
  const left = Math.round(width * 0.04);
  const top = Math.round(height * 0.22);
  const cropWidth = Math.max(64, width - left * 2);
  const cropHeight = Math.max(64, height - top - Math.round(height * 0.04));

  // Wycinamy belkę z logotypami PACIFIC / Polonia / HK, która siedzi na próbkach.
  return pipeline
    .extract({ left, top, width: cropWidth, height: cropHeight })
    .resize(1024, 1024, { fit: 'cover' })
    .jpeg({ quality: 90 })
    .toBuffer();
}
