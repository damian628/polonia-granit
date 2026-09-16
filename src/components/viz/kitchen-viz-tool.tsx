'use client';

/* Zdjęcia kuchni i wynik z API to blob/data URL — next/image ich nie zoptymalizuje. */
/* eslint-disable @next/next/no-img-element */

import { useActionState, useEffect, useId, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslations } from 'next-intl';

import {
  generateKitchenViz,
  type KitchenVizState,
} from '@/app/actions/kitchen-viz';
import { buttonStyles } from '@/components/ui/button';
import { CameraIcon, CloseIcon } from '@/components/ui/icons';
import { Link } from '@/i18n/navigation';
import { VIZ_DAILY_LIMIT, VIZ_LIMIT_ENABLED } from '@/lib/viz-constants';
import type { VizStoneOption } from '@/lib/viz-stones';
import { cn } from '@/lib/cn';

const initial: KitchenVizState = { status: 'idle' };

type KitchenVizToolProps = {
  stones: VizStoneOption[];
  variant?: 'home' | 'page';
};

export function KitchenVizTool({
  stones,
  variant = 'page',
}: KitchenVizToolProps) {
  const [state, action, pending] = useActionState(generateKitchenViz, initial);
  const t = useTranslations('kitchenViz');
  const formId = useId();
  const [preview, setPreview] = useState<string | null>(null);
  const [material, setMaterial] = useState<VizStoneOption['material']>(
    'konglomerat',
  );
  const [stoneSlug, setStoneSlug] = useState(
    stones.find((stone) => stone.slug === 'bellagio-closeup-polished')?.slug ??
      stones[0]?.slug ??
      '',
  );

  const visible = useMemo(
    () => stones.filter((stone) => stone.material === material),
    [material, stones],
  );

  const remaining = VIZ_LIMIT_ENABLED
    ? (state.remaining ?? (state.error === 'rate' ? 0 : VIZ_DAILY_LIMIT))
    : 999;
  const selected = stones.find((stone) => stone.slug === stoneSlug);
  const resultSrc = state.image
    ? `data:image/jpeg;base64,${state.image}`
    : null;
  const [lightbox, setLightbox] = useState<{
    src: string;
    alt: string;
  } | null>(null);

  return (
    <form action={action} className="relative space-y-6" noValidate>
      <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
        <input
          id={`${formId}-website`}
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
      <input type="hidden" name="stone" value={stoneSlug} />

      {state.status === 'ok' && state.image ? (
        <div className="overflow-hidden rounded-lg border border-ink-900/10 bg-white">
          <div className="grid sm:grid-cols-2">
            {preview ? (
              <figure className="border-b border-ink-900/8 sm:border-r sm:border-b-0">
                <button
                  type="button"
                  onClick={() =>
                    setLightbox({ src: preview, alt: t('originalAlt') })
                  }
                  className="group relative block w-full"
                >
                  <img
                    src={preview}
                    alt={t('originalAlt')}
                    className="aspect-[4/3] w-full object-cover"
                  />
                  <span className="absolute inset-x-0 bottom-0 bg-ink-950/55 px-3 py-2 text-left text-xs text-stone-50 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                    {t('zoomHint')}
                  </span>
                </button>
                <figcaption className="px-4 py-2 text-xs text-stone-500">
                  {t('originalCaption')}
                </figcaption>
              </figure>
            ) : null}
            {resultSrc ? (
              <figure>
                <button
                  type="button"
                  onClick={() =>
                    setLightbox({
                      src: resultSrc,
                      alt: t('resultAlt', { stone: state.stoneName ?? '' }),
                    })
                  }
                  className="group relative block w-full"
                >
                  <img
                    src={resultSrc}
                    alt={t('resultAlt', { stone: state.stoneName ?? '' })}
                    className="aspect-[4/3] w-full object-cover"
                  />
                  <span className="absolute inset-x-0 bottom-0 bg-ink-950/55 px-3 py-2 text-left text-xs text-stone-50 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                    {t('zoomHint')}
                  </span>
                </button>
                <figcaption className="px-4 py-2 text-xs text-stone-500">
                  {t('resultCaption', { stone: state.stoneName ?? '' })}
                </figcaption>
              </figure>
            ) : null}
          </div>
          <div className="flex flex-wrap items-center gap-3 border-t border-ink-900/8 px-4 py-4">
            <a
              href={`data:image/jpeg;base64,${state.image}`}
              download={`polonia-granit-${(state.stoneName ?? 'blat').toLowerCase().replaceAll(' ', '-')}.jpg`}
              className={buttonStyles('secondary', 'md')}
            >
              {t('download')}
            </a>
            {variant === 'home' ? (
              <a href="#wycena" className={buttonStyles('primary', 'md')}>
                {t('quoteCta')}
              </a>
            ) : (
              <Link href="/kontakt" className={buttonStyles('primary', 'md')}>
                {t('quoteCta')}
              </Link>
            )}
            <p className="text-xs text-stone-500">{t('quoteHint')}</p>
          </div>
        </div>
      ) : null}

      <label className="block">
        <span
          className={cn(
            'mb-2 block text-sm font-medium text-ink-800',
            state.status === 'ok' && 'sr-only',
          )}
        >
          {t('uploadLabel')}
        </span>
        <span
          className={cn(
            'flex min-h-40 cursor-pointer flex-col items-center justify-center gap-3 overflow-hidden rounded-lg border border-dashed border-ink-900/20 bg-stone-50 px-4 text-center transition-colors hover:border-brass-500/50 hover:bg-white',
            preview && 'min-h-0 border-solid p-0',
            state.status === 'ok' && preview && 'hidden',
          )}
        >
          {preview ? (
            <img
              src={preview}
              alt=""
              className="aspect-[4/3] w-full object-cover"
            />
          ) : (
            <>
              <span className="grid size-12 place-items-center rounded-full bg-white text-brass-600 shadow-lift">
                <CameraIcon width={22} height={22} />
              </span>
              <span className="text-sm text-ink-700">{t('uploadHint')}</span>
            </>
          )}
        </span>
        <input
          required
          name="photo"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="sr-only"
          onChange={(event) => {
            const next = event.target.files?.[0] ?? null;
            setPreview((current) => {
              if (current) URL.revokeObjectURL(current);
              return next ? URL.createObjectURL(next) : null;
            });
          }}
        />
        {preview && state.status !== 'ok' ? (
          <span className="mt-2 block text-xs text-brass-600">
            {t('uploadChange')}
          </span>
        ) : null}
      </label>

      <div>
        <p className="mb-3 text-sm font-medium text-ink-800">{t('stonesLabel')}</p>
        <div className="mb-4 flex gap-2">
          <MaterialTab
            active={material === 'konglomerat'}
            onClick={() => {
              setMaterial('konglomerat');
              const first = stones.find((stone) => stone.material === 'konglomerat');
              if (first) setStoneSlug(first.slug);
            }}
          >
            {t('materialPacific')}
          </MaterialTab>
          <MaterialTab
            active={material === 'granit'}
            onClick={() => {
              setMaterial('granit');
              const first = stones.find((stone) => stone.material === 'granit');
              if (first) setStoneSlug(first.slug);
            }}
          >
            {t('materialGranite')}
          </MaterialTab>
        </div>
        <ul
          className={cn(
            'grid grid-cols-4 gap-2 overflow-y-auto sm:grid-cols-5 md:grid-cols-6',
            variant === 'home' ? 'max-h-52' : 'max-h-72',
          )}
        >
          {visible.map((stone) => {
            const active = stone.slug === stoneSlug;
            return (
              <li key={stone.slug}>
                <button
                  type="button"
                  aria-pressed={active}
                  onClick={() => setStoneSlug(stone.slug)}
                  className={cn(
                    'w-full overflow-hidden rounded-md border bg-white text-left transition-shadow',
                    active
                      ? 'border-brass-500 shadow-lift ring-1 ring-brass-500'
                      : 'border-ink-900/10 hover:border-ink-900/25',
                  )}
                >
                  <span className="block aspect-square overflow-hidden bg-stone-200">
                    <img
                      src={stone.src}
                      alt=""
                      width={160}
                      height={160}
                      className="h-full w-full object-cover"
                    />
                  </span>
                  <span className="block truncate px-1.5 py-1 text-[0.65rem] leading-tight text-ink-800">
                    {stone.name}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
        {material === 'granit' ? (
          <p className="mt-2 text-xs text-stone-500">{t('graniteNote')}</p>
        ) : null}
      </div>

      <label className="flex items-start gap-3 text-sm leading-relaxed text-ink-600">
        <input
          required
          name="consent"
          type="checkbox"
          className="mt-1 size-4 accent-ink-900"
        />
        <span>
          {t.rich('consent', {
            privacy: (chunk) => (
              <Link
                href="/polityka-prywatnosci-i-cookies"
                className="text-brass-600 underline underline-offset-4 hover:text-brass-500"
              >
                {chunk}
              </Link>
            ),
          })}
        </span>
      </label>

      {state.status === 'error' && state.error ? (
        <p role="alert" className="text-sm text-red-700">
          {t(`errors.${state.error}`)}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={pending || (VIZ_LIMIT_ENABLED && remaining === 0)}
          className={buttonStyles('primary', 'lg')}
        >
          {pending ? t('generating') : t('generate')}
        </button>
        <p className="text-xs text-stone-500">
          {VIZ_LIMIT_ENABLED
            ? t('remaining', { count: remaining, limit: VIZ_DAILY_LIMIT })
            : t('unlimited')}
        </p>
      </div>
      {pending ? (
        <p className="text-sm text-ink-600">{t('generatingHint')}</p>
      ) : null}
      {selected ? (
        <p className="sr-only">
          {t('selectedStone', { stone: selected.name })}
        </p>
      ) : null}

      {lightbox ? (
        <VizLightbox
          src={lightbox.src}
          alt={lightbox.alt}
          closeLabel={t('closePreview')}
          onClose={() => setLightbox(null)}
        />
      ) : null}
    </form>
  );
}

function MaterialTab({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-full px-3 py-1.5 text-xs font-medium transition-colors',
        active
          ? 'bg-ink-900 text-stone-50'
          : 'bg-white text-ink-700 ring-1 ring-ink-900/10 hover:ring-ink-900/25',
      )}
    >
      {children}
    </button>
  );
}

function VizLightbox({
  src,
  alt,
  closeLabel,
  onClose,
}: {
  src: string;
  alt: string;
  closeLabel: string;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    const { body, documentElement } = document;
    const scrollbar = window.innerWidth - documentElement.clientWidth;
    const previous = {
      overflow: body.style.overflow,
      paddingRight: body.style.paddingRight,
    };
    body.style.overflow = 'hidden';
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;
    window.addEventListener('keydown', onKey);
    return () => {
      body.style.overflow = previous.overflow;
      body.style.paddingRight = previous.paddingRight;
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  // Portal na body: rodzic `.reveal` ma `transform` (animacja wejścia) i wtedy
  // `position: fixed` liczy się względem karty, nie okna — zdjęcie było ucięte.
  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={alt}
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-auto overscroll-contain bg-ink-950/88 p-4 sm:p-8"
      onClick={onClose}
    >
      <button
        type="button"
        autoFocus
        onClick={onClose}
        className="fixed top-4 right-4 z-[101] grid size-11 place-items-center rounded-full bg-white/10 text-stone-50 transition-colors hover:bg-white/20"
        aria-label={closeLabel}
      >
        <CloseIcon width={22} height={22} />
      </button>
      <img
        src={src}
        alt={alt}
        className="max-h-[90dvh] w-auto max-w-[min(100%,92vw)] object-contain"
        onClick={(event) => event.stopPropagation()}
      />
    </div>,
    document.body,
  );
}
