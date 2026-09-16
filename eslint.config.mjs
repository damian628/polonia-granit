import coreWebVitals from 'eslint-config-next/core-web-vitals';
import typescript from 'eslint-config-next/typescript';

/**
 * Domyślny zestaw Nexta - pilnuje m.in. użycia `next/image`, zależności hooków
 * i reguł dostępności, czyli dokładnie tego, na czym nam tu zależy.
 */
const config = [
  ...coreWebVitals,
  ...typescript,
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'public/**',
      'src/data/generated/**',
      '.scratch/**',
    ],
  },
];

export default config;
