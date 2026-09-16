'use client';

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { useTranslations } from 'next-intl';

import { CloseIcon } from '@/components/ui/icons';

type OpenPhoto = {
  index: number;
  src: string;
  width: number;
  height: number;
  alt: string;
};

/**
 * Lightbox, który nie dostaje listy zdjęć w propsach.
 *
 * Kafle renderuje serwer, a ten komponent tylko nasłuchuje kliknięć i czyta
 * `data-*` z klikniętego przycisku. Dzięki temu 400 wpisów galerii nie ląduje
 * w payloadzie strony, a przełączanie zdjęć sprowadza się do wyszukania
 * kolejnego przycisku w DOM-ie.
 */
export function GalleryLightbox({
  children,
  total,
}: {
  children: ReactNode;
  total: number;
}) {
  const [photo, setPhoto] = useState<OpenPhoto | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const t = useTranslations('gallery.lightbox');

  const readPhoto = useCallback((index: number): OpenPhoto | null => {
    const target = gridRef.current?.querySelector<HTMLElement>(
      `[data-photo-index="${index}"]`,
    );
    if (!target) return null;

    const { src, width, height, alt } = target.dataset;
    if (!src || !width || !height) return null;

    return {
      index,
      src,
      width: Number(width),
      height: Number(height),
      alt: alt ?? '',
    };
  }, []);

  const step = useCallback(
    (delta: number) => {
      setPhoto((current) => {
        if (!current) return current;
        // Zawijamy na obu końcach - w galerii tego rozmiaru wygodniej niż
        // dobijanie do „ściany” po kilkudziesięciu kliknięciach.
        const next = (current.index + delta + total) % total;
        return readPhoto(next) ?? current;
      });
    },
    [readPhoto, total],
  );

  const close = useCallback(() => {
    setPhoto(null);
    openerRef.current?.focus();
    openerRef.current = null;
  }, []);

  useEffect(() => {
    if (!photo) return;

    // Blokujemy przewijanie tła i podmieniamy padding, żeby zniknięcie
    // paska przewijania nie przesunęło layoutu pod spodem.
    const { body, documentElement } = document;
    const scrollbar = window.innerWidth - documentElement.clientWidth;
    const previous = {
      overflow: body.style.overflow,
      paddingRight: body.style.paddingRight,
    };
    body.style.overflow = 'hidden';
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') close();
      else if (event.key === 'ArrowRight') step(1);
      else if (event.key === 'ArrowLeft') step(-1);
    }

    window.addEventListener('keydown', onKeyDown);
    closeButtonRef.current?.focus();

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      body.style.overflow = previous.overflow;
      body.style.paddingRight = previous.paddingRight;
    };
  }, [photo, close, step]);

  return (
    <>
      <div
        ref={gridRef}
        onClick={(event) => {
          const trigger = (event.target as HTMLElement).closest<HTMLElement>(
            '[data-photo-index]',
          );
          if (!trigger) return;

          const opened = readPhoto(Number(trigger.dataset.photoIndex));
          if (!opened) return;

          openerRef.current = trigger;
          setPhoto(opened);
        }}
      >
        {children}
      </div>

      {photo ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={photo.alt}
          onClick={(event) => {
            if (event.target === event.currentTarget) close();
          }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/94 p-4 backdrop-blur-sm sm:p-8"
        >
          {/* Pliki w `public/img/realizacje` mają już 1400 px szerokości,
              więc podajemy je bezpośrednio - bez przechodzenia przez
              optymalizator, który przy 400 zdjęciach zjadałby limity hostingu. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photo.src}
            alt={photo.alt}
            width={photo.width}
            height={photo.height}
            className="max-h-full w-auto max-w-full rounded-sm object-contain shadow-lift"
          />

          <p className="pointer-events-none absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-ink-950/70 px-4 py-1.5 text-sm text-stone-300">
            {t('counter', { current: photo.index + 1, total })}
          </p>

          <button
            ref={closeButtonRef}
            type="button"
            onClick={close}
            aria-label={t('close')}
            className="absolute top-4 right-4 grid size-11 place-items-center rounded-full bg-white/10 text-stone-100 transition-colors hover:bg-white/20 sm:top-6 sm:right-6"
          >
            <CloseIcon width={20} height={20} />
          </button>

          <NavButton side="left" label={t('prev')} onClick={() => step(-1)} />
          <NavButton side="right" label={t('next')} onClick={() => step(1)} />
        </div>
      ) : null}
    </>
  );
}

function NavButton({
  side,
  label,
  onClick,
}: {
  side: 'left' | 'right';
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`absolute top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-stone-100 transition-colors hover:bg-white/20 ${
        side === 'left' ? 'left-3 sm:left-6' : 'right-3 sm:right-6'
      }`}
    >
      <svg
        viewBox="0 0 24 24"
        width={20}
        height={20}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className={side === 'left' ? 'rotate-180' : undefined}
      >
        <path d="M9 5l7 7-7 7" />
      </svg>
    </button>
  );
}
