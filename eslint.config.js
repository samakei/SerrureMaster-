import js from '@eslint/js';
import reactPlugin from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import globals from 'globals';

export default [
  {
    ignores: ['**/build/**', '**/dist/**', '**/dist_old/**', '**/public/**', '**/node_modules/**'],
    linterOptions: { reportUnusedDisableDirectives: 'off', noInlineConfig: true },
  },
  js.configs.recommended,
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.browser,
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      react: reactPlugin,
      'react-hooks': reactHooks,
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      ...(tsPlugin.configs?.recommended?.rules ?? {}),
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
      'react/react-in-jsx-scope': 'off',
      'react/no-inline-styles': 'off',
      'react/forbid-component-props': 'off',
    },
  },
  // Node environment for config and setup files (TS/JS)
  {
    files: [
      'vite.config.ts',
      'vitest.config.ts',
      'vitest.setup.ts',
      'eslint.config.js',
      'tailwind.config.js',
      'postcss.config.js',
      'verify-stripe-config.js',
      'get-stripe-prices.mjs',
    ],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.node,
    },
  },
  // Relax rules in supabase functions (edge/server code)
  {
    files: ['supabase/functions/**/*.ts'],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    rules: {
      '@typescript-eslint/ban-ts-comment': 'off',
    },
  },
  {
    files: [
      '**/*.js',
      '**/*.mjs',
      'vitest.config.ts',
      'verify-stripe-config.js',
      'get-stripe-prices.mjs',
    ],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.node,
    },
    plugins: {
      react: reactPlugin,
    },
  },
];
