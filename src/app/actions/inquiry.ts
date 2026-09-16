'use server';

import { headers } from 'next/headers';
import { Resend } from 'resend';
import { z } from 'zod';

import { site } from '@/lib/site';

const MAX_FILES = 3;
const MAX_FILE_BYTES = 4 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/heic',
  'image/heif',
  'application/pdf',
]);

const topics = [
  'tombstones',
  'countertops',
  'windowsills',
  'stairs',
  'fireplaces',
  'granites',
  'conglomerates',
  'other',
] as const;

const schema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(180),
  phone: z.string().trim().min(6).max(40),
  topic: z.enum(topics),
  message: z.string().trim().min(10).max(4000),
  consent: z.literal('on'),
});

export type InquiryState = {
  status: 'idle' | 'ok' | 'error';
  fieldErrors?: Partial<Record<keyof z.infer<typeof schema> | 'files', string>>;
};

const recentByIp = new Map<string, number>();

export async function sendInquiry(
  _prev: InquiryState,
  formData: FormData,
): Promise<InquiryState> {
  // Pole-pułapka: boty je wypełniają, ludzie go nie widzą.
  if (String(formData.get('website') ?? '').trim()) {
    return { status: 'ok' };
  }

  const parsed = schema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    topic: formData.get('topic'),
    message: formData.get('message'),
    consent: formData.get('consent'),
  });

  if (!parsed.success) {
    const fieldErrors: InquiryState['fieldErrors'] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === 'string' && !(key in fieldErrors)) {
        fieldErrors[key as keyof NonNullable<InquiryState['fieldErrors']>] =
          issue.message;
      }
    }
    return { status: 'error', fieldErrors };
  }

  const files = formData
    .getAll('files')
    .filter((entry): entry is File => entry instanceof File && entry.size > 0);

  if (files.length > MAX_FILES) {
    return { status: 'error', fieldErrors: { files: 'tooMany' } };
  }

  for (const file of files) {
    if (file.size > MAX_FILE_BYTES) {
      return { status: 'error', fieldErrors: { files: 'tooLarge' } };
    }
    if (file.type && !ALLOWED_TYPES.has(file.type)) {
      return { status: 'error', fieldErrors: { files: 'type' } };
    }
  }

  const ip = await clientIp();
  const now = Date.now();
  const last = recentByIp.get(ip) ?? 0;
  if (now - last < 20_000) {
    return { status: 'error', fieldErrors: { message: 'rate' } };
  }
  recentByIp.set(ip, now);

  const topicLabels: Record<(typeof topics)[number], string> = {
    tombstones: 'Nagrobki',
    countertops: 'Blaty',
    windowsills: 'Parapety',
    stairs: 'Schody',
    fireplaces: 'Kominki',
    granites: 'Płyty granitowe',
    conglomerates: 'Konglomeraty kwarcowe PACIFIC',
    other: 'Inne',
  };

  const { name, email, phone, topic, message } = parsed.data;
  const subject = `Zapytanie ze strony: ${topicLabels[topic]} — ${name}`;

  const html = `
    <p><strong>Imię:</strong> ${escapeHtml(name)}</p>
    <p><strong>E-mail:</strong> ${escapeHtml(email)}</p>
    <p><strong>Telefon:</strong> ${escapeHtml(phone)}</p>
    <p><strong>Temat:</strong> ${escapeHtml(topicLabels[topic])}</p>
    <p><strong>Wiadomość:</strong></p>
    <p>${escapeHtml(message).replaceAll('\n', '<br/>')}</p>
  `;

  const attachments = await Promise.all(
    files.map(async (file) => ({
      filename: file.name || 'zalacznik',
      content: Buffer.from(await file.arrayBuffer()),
    })),
  );

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL ?? site.email;
  const from =
    process.env.CONTACT_FROM_EMAIL ??
    `Polonia Granit <formularz@${new URL(site.url).hostname}>`;

  if (!apiKey) {
    // Na lokalnym serwerze bez klucza nie udajemy wysyłki - zapisujemy treść
    // w logu, żeby dało się przetestować sam formularz.
    console.info('[inquiry] brak RESEND_API_KEY, treść:', {
      name,
      email,
      phone,
      topic,
      message,
      files: files.map((file) => file.name),
    });
    return { status: 'ok' };
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from,
    to,
    replyTo: email,
    subject,
    html,
    attachments: attachments.length ? attachments : undefined,
  });

  if (error) {
    console.error('[inquiry] Resend:', error);
    return { status: 'error' };
  }

  return { status: 'ok' };
}

async function clientIp() {
  const list = (await headers()).get('x-forwarded-for');
  return list?.split(',')[0]?.trim() || 'local';
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}
