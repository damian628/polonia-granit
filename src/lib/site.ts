/**
 * Dane firmy w jednym miejscu - używane w nagłówku, stopce, danych
 * strukturalnych, mailach z formularza i na landingach lokalnych.
 * Wszystko przepisane z obecnej strony poloniagranit.pl.
 */

export const site = {
  name: 'Polonia Granit',
  /** Pełna nazwa i NIP z polityki prywatności starej strony. */
  legalName: '„POLONIA-GRANIT” J. Dobrzycki, K. Dobrzycki spółka jawna',
  taxId: '6151980407',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://poloniagranit.pl',

  address: {
    street: 'ul. Łużycka 89',
    postalCode: '59-900',
    city: 'Zgorzelec',
    country: 'PL',
  },

  /**
   * Numery biura ze strony kontaktowej. Pierwszy jest głównym - trafia
   * do przycisku "Zadzwoń", belki mobilnej i WhatsAppa. Czwarty numer
   * (+48 609 121 911) stara strona podpisywała jako "Siedziba firmy";
   * ten sam numer obsługuje hurtownię, więc trzymamy go niżej, przy `wholesale`.
   */
  phones: [
    { display: '+48 731 162 602', href: 'tel:+48731162602' },
    { display: '+48 881 262 616', href: 'tel:+48881262616' },
    { display: '+48 530 288 188', href: 'tel:+48530288188' },
  ],

  email: 'biuro.poloniagranit@wp.pl',

  whatsapp: {
    number: '48731162602',
    href: 'https://wa.me/48731162602',
  },

  openingHours: {
    weekdays: { from: '09:00', to: '17:00' },
    saturday: { from: '09:00', to: '13:00' },
  },

  /** Format wymagany przez schema.org LocalBusiness. */
  openingHoursSpecification: [
    'Mo-Fr 09:00-17:00',
    'Sa 09:00-13:00',
  ],

  geo: {
    // Zgorzelec, ul. Łużycka - do potwierdzenia dokładnymi współrzędnymi zakładu.
    latitude: 51.1394,
    longitude: 15.0086,
  },

  social: {
    // TODO: uzupełnić dokładnymi adresami profili od klienta.
    facebook: 'https://www.facebook.com/poloniagranit',
    instagram: 'https://www.instagram.com/poloniagranit',
  },

  /** Hurtownia płyt - osobny serwis, otwierany w nowej karcie. */
  wholesale: {
    url: 'https://hurtowniakamienia.eu',
    name: 'Hurtowniakamienia.eu',
    email: 'k.dobrzycki@hurtowniakamienia.eu',
    phone: { display: '+48 609 121 911', href: 'tel:+48609121911' },
  },
} as const;

export const fullAddress = `${site.address.street}, ${site.address.postalCode} ${site.address.city}`;

const mapsQuery = `${site.name}, ${fullAddress}`;

/** Link otwierający dojazd w Mapach Google (nowa karta). */
export const mapsSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapsQuery)}`;

export const mapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(mapsQuery)}`;

/**
 * Wizytówka Google (GBP). Ten sam adres co wyszukiwanie miejsca — Maps
 * otwiera profil firmy z opiniami. Bez Place ID, żeby nie trzymać
 * martwego identyfikatora, gdy Google go zmieni.
 */
export const googleBusinessUrl = mapsSearchUrl;

/** Osadzona mapa Google. Ładuje się od razu — na życzenie klienta jest widoczna bez klikania. */
export function mapsEmbedUrl(locale: string) {
  const hl = locale === 'de' || locale === 'cs' ? locale : 'pl';
  const params = new URLSearchParams({
    hl,
    q: mapsQuery,
    z: '16',
    output: 'embed',
  });
  return `https://maps.google.com/maps?${params.toString()}`;
}

/**
 * Firma na starej stronie deklaruje „ponad 20-letnie doświadczenie”, ale roku
 * założenia nigdzie nie podaje. Zostawiamy więc dokładnie tę deklarację zamiast
 * wyliczać konkretną liczbę z wymyślonej daty.
 *
 * TODO: gdy klient poda rok rozpoczęcia działalności, można to zamienić
 * na wyliczenie z bieżącego roku.
 */
export const yearsOnMarket = 20;
