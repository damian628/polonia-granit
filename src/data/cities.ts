/**
 * Miejscowości, do których firma dojeżdża. Lista polskich miast przeniesiona
 * ze starej strony, miasta niemieckie i czeskie dobrane po odległości od
 * zakładu w Zgorzelcu - przejście graniczne jest w linii prostej od warsztatu.
 *
 * Na razie to tylko lista na stronie głównej i w kontakcie. Osobne landingi
 * lokalne mają sens dopiero z własną treścią per miasto - patrz notatka
 * w README, sekcja „Do zrobienia”.
 */
export type ServedCity = {
  name: string;
  country: 'pl' | 'de' | 'cz';
};

export const servedCities: ServedCity[] = [
  { name: 'Zgorzelec', country: 'pl' },
  { name: 'Bogatynia', country: 'pl' },
  { name: 'Lubań', country: 'pl' },
  { name: 'Bolesławiec', country: 'pl' },
  { name: 'Jelenia Góra', country: 'pl' },
  { name: 'Gryfów Śląski', country: 'pl' },
  { name: 'Żary', country: 'pl' },
  { name: 'Żagań', country: 'pl' },
  { name: 'Görlitz', country: 'de' },
  { name: 'Zittau', country: 'de' },
  { name: 'Löbau', country: 'de' },
  { name: 'Weißwasser', country: 'de' },
  { name: 'Bautzen', country: 'de' },
  { name: 'Liberec', country: 'cz' },
  { name: 'Hrádek nad Nisou', country: 'cz' },
  { name: 'Frýdlant', country: 'cz' },
];

export const countryLabels: Record<ServedCity['country'], string> = {
  pl: 'PL',
  de: 'DE',
  cz: 'CZ',
};
