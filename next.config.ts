import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from 'next';

import { legacyRedirects } from './src/lib/legacy-redirects';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  // Stara strona na WordPressie używała adresów ze slashem na końcu.
  // Zachowujemy ten kształt, żeby linki z wizytówek, Google i katalogów
  // trafiały pod właściwy adres bez dodatkowego przekierowania.
  trailingSlash: true,

  // Formularz przyjmuje zdjęcia (do 3 × 4 MB), więc limit musi być większy
  // niż domyślne 1 MB akcji serwerowych.
  experimental: {
    serverActions: {
      bodySizeLimit: '12mb',
    },
  },

  images: {
    formats: ['image/avif', 'image/webp'],
    // Next 16 domyślnie pozwala tylko na 75. Hero potrzebuje 90, inaczej
    // `quality={90}` i tak schodzi do 75 i zdjęcie wygląda na zamazane.
    qualities: [75, 90],
    // Szerokości dopasowane do siatek na stronie - mniej wariantów to mniej
    // pracy przy generowaniu i lepsze wykorzystanie cache CDN.
    deviceSizes: [400, 640, 828, 1080, 1280, 1920],
    imageSizes: [96, 160, 240, 320],
  },

  async redirects() {
    return legacyRedirects;
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
      {
        source: '/fonts/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
