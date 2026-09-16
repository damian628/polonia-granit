import { createHmac, timingSafeEqual } from 'node:crypto';
import { cookies, headers } from 'next/headers';

import { VIZ_DAILY_LIMIT, VIZ_LIMIT_ENABLED } from '@/lib/viz-constants';

export { VIZ_DAILY_LIMIT, VIZ_LIMIT_ENABLED };

const COOKIE = 'pg_viz';

type Slot = { day: string; count: number };

const recentByIp = new Map<string, Slot>();

function secret() {
  return (
    process.env.VIZ_COOKIE_SECRET ??
    process.env.OPENAI_API_KEY ??
    'dev-kitchen-viz'
  );
}

function todayWarsaw() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Warsaw',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}

function sign(day: string, count: number) {
  return createHmac('sha256', secret())
    .update(`${day}:${count}`)
    .digest('hex')
    .slice(0, 24);
}

function parseCookie(value: string | undefined): Slot {
  const day = todayWarsaw();
  const empty = { day, count: 0 };
  if (!value) return empty;
  const [cookieDay, countRaw, sig] = value.split('.');
  if (!cookieDay || !countRaw || !sig) return empty;
  const count = Number.parseInt(countRaw, 10);
  if (!Number.isFinite(count) || count < 0) return empty;
  const expected = sign(cookieDay, count);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return empty;
  if (cookieDay !== day) return empty;
  return { day, count };
}

async function clientIp() {
  const list = (await headers()).get('x-forwarded-for');
  return list?.split(',')[0]?.trim() || 'local';
}

async function currentSlot(): Promise<{ slot: Slot; ip: string }> {
  const day = todayWarsaw();
  const ip = await clientIp();
  const cookieStore = await cookies();
  const fromCookie = parseCookie(cookieStore.get(COOKIE)?.value);
  const fromIp = recentByIp.get(ip);
  const ipCount = fromIp && fromIp.day === day ? fromIp.count : 0;
  return {
    ip,
    slot: { day, count: Math.max(fromCookie.count, ipCount) },
  };
}

async function persist(ip: string, slot: Slot) {
  recentByIp.set(ip, slot);
  const cookieStore = await cookies();
  cookieStore.set(COOKIE, `${slot.day}.${slot.count}.${sign(slot.day, slot.count)}`, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 26,
    secure: process.env.NODE_ENV === 'production',
  });
}

export async function remainingVizSlots() {
  if (!VIZ_LIMIT_ENABLED) return 999;
  const { slot } = await currentSlot();
  return Math.max(0, VIZ_DAILY_LIMIT - slot.count);
}

/** Rezerwuje jedno miejsce. Przy błędzie API trzeba oddać `refundVizSlot`. */
export async function consumeVizSlot(): Promise<
  { ok: true; remaining: number } | { ok: false; remaining: 0 }
> {
  if (!VIZ_LIMIT_ENABLED) {
    return { ok: true, remaining: 999 };
  }
  const { ip, slot } = await currentSlot();
  if (slot.count >= VIZ_DAILY_LIMIT) {
    return { ok: false, remaining: 0 };
  }
  const next = { day: slot.day, count: slot.count + 1 };
  await persist(ip, next);
  return { ok: true, remaining: Math.max(0, VIZ_DAILY_LIMIT - next.count) };
}

export async function refundVizSlot() {
  if (!VIZ_LIMIT_ENABLED) return;
  const { ip, slot } = await currentSlot();
  const next = { day: slot.day, count: Math.max(0, slot.count - 1) };
  await persist(ip, next);
}
