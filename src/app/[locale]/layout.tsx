import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Inter } from 'next/font/google';
import { notFound } from 'next/navigation';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { ReactNode } from 'react';

import '@/app/globals.css';

import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import { MobileContactBar } from '@/components/layout/mobile-contact-bar';
import { RevealFallback } from '@/components/reveal-fallback';
import { LocalBusinessSchema } from '@/components/structured-data';
import { locales, routing, type Locale } from '@/i18n/routing';
import { buildAlternates } from '@/lib/metadata';
import { site } from '@/lib/site';

// Fonty pobierane w trakcie builda i serwowane z własnej domeny - żadnych
// żądań do Google przy wejściu na stronę i żadnego skoku layoutu.
const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-inter',
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin', 'latin-ext'],
  weight: ['500', '600'],
  display: 'swap',
  variable: '--font-cormorant',
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: '#14171d',
  colorScheme: 'light',
};

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await props.params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const t = await getTranslations({ locale, namespace: 'meta' });

  return {
    metadataBase: new URL(site.url),
    title: {
      default: `${site.name} — ${t('tagline')}`,
      template: `%s — ${site.name}`,
    },
    description: t('tagline'),
    alternates: buildAlternates('/', locale as Locale),
    robots: { index: true, follow: true },
    // Favikona i ikona Apple biorą się z `src/app/icon.png` oraz
    // `src/app/apple-icon.png` - Next podłącza je sam, bez ręcznych ścieżek.
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  // Wymagane, żeby podstrony renderowały się statycznie w trakcie builda.
  setRequestLocale(locale);

  const tNav = await getTranslations({ locale, namespace: 'nav' });

  return (
    <html lang={locale} className={`${inter.variable} ${cormorant.variable}`}>
      <body className="min-h-dvh antialiased">
        <NextIntlClientProvider>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[70] focus:rounded-full focus:bg-ink-900 focus:px-5 focus:py-3 focus:text-sm focus:text-stone-50"
          >
            {tNav('skipToContent')}
          </a>

          <Header />
          <main id="main" className="pb-16 lg:pb-0">
            {children}
          </main>
          <Footer />
          <MobileContactBar />
        </NextIntlClientProvider>

        <LocalBusinessSchema locale={locale as Locale} />
        <RevealFallback />
      </body>
    </html>
  );
}
