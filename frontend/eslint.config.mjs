// eslint.config.mjs
import { FlatCompat } from '@eslint/eslintrc';

// Create a FlatCompat instance to support legacy "extends" syntax.
const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

const eslintConfig = [
  ...compat.config({
    extends: ['next/core-web-vitals', 'prettier'],
    plugins: ['react-hooks'],
    rules: {
      // React rules
      'react/react-in-jsx-scope': 'off',
      'react/no-unescaped-entities': 'off',
      'react/prop-types': 'off',
      'react/display-name': 'off',
      
      // React Hooks rules
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      
      // Next.js rules
      '@next/next/no-img-element': 'off',
      '@next/next/no-html-link-for-pages': 'error',
      
      // General JavaScript rules
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-unused-vars': ['warn', { 
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      }],
      'prefer-const': 'error',
      'no-var': 'error',
      
      // Import rules
      'import/order': 'off', // Handled by Prettier
      'import/no-unresolved': 'off', // Next.js handles this
    },
  }),
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'dist/**',
      'build/**',
      'public/**',
      '*.config.{js,mjs,cjs}',
      'coverage/**',
    ],
  },
];

export default eslintConfig;
