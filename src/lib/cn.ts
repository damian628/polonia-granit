/**
 * Minimalne łączenie klas. Świadomie bez clsx i tailwind-merge - na tej stronie
 * nie nadpisujemy klas warunkowo na tyle, żeby uzasadnić dwie dodatkowe
 * biblioteki w bundlu.
 */
export function cn(
  ...classes: Array<string | false | null | undefined>
): string {
  return classes.filter(Boolean).join(' ');
}
