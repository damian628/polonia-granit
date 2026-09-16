import createMiddleware from 'next-intl/middleware';

import { routing } from './i18n/routing';

/**
 * W Next.js 16 konwencja `middleware.ts` została zastąpiona przez `proxy.ts`.
 * Jedyne zadanie tej warstwy to rozstrzygnięcie języka i przepisanie adresu
 * na wewnętrzną ścieżkę - podstrony nadal renderują się statycznie.
 */
export default createMiddleware(routing);

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
