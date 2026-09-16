/**
 * Opinie zebrane w profilu Google, przeniesione ze starej strony.
 *
 * Świadomie NIE tłumaczymy ich i nie skracamy - opinia to cytat klienta.
 * Każda zostaje w języku, w którym została napisana, a `lang` trafia
 * do atrybutu `lang` na cytacie, żeby czytniki ekranu wymawiały je poprawnie.
 *
 * Dane pochodzą z widżetu Trustindex na starej stronie. Na nowej wpisujemy
 * wybrane cytaty na sztywno (widżet dociągał skrypt blokujący render),
 * a przycisk w sekcji otwiera wizytówkę Google z pełną listą opinii.
 */
export type Review = {
  author: string;
  /** Język treści opinii - kod BCP 47. */
  lang: string;
  rating: 5;
  text: string;
};

export const reviews: Review[] = [
  {
    author: 'Barbara Babsi',
    lang: 'de',
    rating: 5,
    text: 'Wir sind mit dem Service wie mit dem Ergebnis sehr zufrieden. Beim Anblick von dem wunderschönen Grab habe ich erstmal geweint. Es ist schlicht, jedoch wunderschön. Genau so wie wir es uns für unser Sternchen gewünscht haben. Polonia Granit ist vollends auf unsere Wünsche eingegangen, dies wurde woanders leider gar nicht gemacht. Ich kann Polonia Granit nur empfehlen!',
  },
  {
    author: 'Grażyna Smyk',
    lang: 'pl',
    rating: 5,
    text: 'Firma wywiązała się ze swojego zadania. Właściciel godny zaufania.',
  },
  {
    author: 'Carmen Nasui',
    lang: 'en',
    rating: 5,
    text: 'Great! Thank you!',
  },
  {
    author: 'Vitalij',
    lang: 'uk',
    rating: 5,
    text: 'Швидке розвантаження, приємний персонал!!!',
  },
  {
    author: 'Mateusz Stępień',
    lang: 'pl',
    rating: 5,
    text: 'Polecam.',
  },
];

export const averageRating = 5;
export const reviewCount = reviews.length;
