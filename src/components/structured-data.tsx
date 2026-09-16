import type { Locale } from '@/i18n/routing';
import { googleBusinessUrl, site } from '@/lib/site';

/**
 * Dane strukturalne firmy. Google wykorzystuje je w wizytówce i wynikach
 * lokalnych - dla zakładu, który obsługuje trzy kraje, to najtańszy sposób
 * pokazania adresu, godzin i zasięgu działania.
 */
export function LocalBusinessSchema({ locale }: { locale: Locale }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Stonemason',
    '@id': `${site.url}/#organization`,
    name: site.name,
    legalName: site.legalName,
    logo: `${site.url}/logo/polonia-granit.png`,
    image: `${site.url}/og/default.jpg`,
    vatID: `PL${site.taxId}`,
    taxID: site.taxId,
    url: site.url,
    email: site.email,
    telephone: site.phones.map((phone) => phone.display),
    priceRange: '$$',
    inLanguage: locale,
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.address.street,
      postalCode: site.address.postalCode,
      addressLocality: site.address.city,
      addressCountry: site.address.country,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: site.geo.latitude,
      longitude: site.geo.longitude,
    },
    openingHours: site.openingHoursSpecification,
    areaServed: [
      { '@type': 'Country', name: 'Polska' },
      { '@type': 'Country', name: 'Deutschland' },
      { '@type': 'Country', name: 'Česko' },
    ],
    sameAs: [
      site.social.facebook,
      site.social.instagram,
      site.wholesale.url,
      googleBusinessUrl,
    ],
  };

  return (
    <script
      type="application/ld+json"
      // Statyczny obiekt z pliku konfiguracyjnego, bez danych z zewnątrz.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
