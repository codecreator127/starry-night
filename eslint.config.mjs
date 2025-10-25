import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // Next.js + TypeScript base
  ...compat.extends('next/core-web-vitals', 'next/typescript'),

  // Prettier integration
  ...compat.extends('plugin:prettier/recommended'),

  {
    ignores: ['node_modules/**', '.next/**', 'out/**', 'build/**', 'next-env.d.ts'],
    rules: {
      // optional overrides
      // e.g., turn off conflicts with Prettier
      'react/react-in-jsx-scope': 'off',
    },
  },
];

export default eslintConfig;
