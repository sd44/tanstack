import pluginJs from '@eslint/js';
import react from '@eslint-react/eslint-plugin';
import tseslint from 'typescript-eslint';
import * as reactHooks from 'eslint-plugin-react-hooks';
import pluginQuery from '@tanstack/eslint-plugin-query';
import pluginRouter from '@tanstack/eslint-plugin-router';
import eslintConfigPrettier from 'eslint-config-prettier';
/** @type {import('eslint').Linter.Config[]} */

export default [
  {
    ignores: [
      'coverage/',
      'dist/',
      '.vinxi',
      '.wrangler',
      '.vercel',
      '.netlify',
      '.output',
      'build/',
    ],
  },
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      pluginJs.configs.recommended,
      ...tseslint.configs.recommended,
      ...pluginQuery.configs['flat/recommended'],
      ...pluginRouter.configs['flat/recommended'],
      eslintConfigPrettier,
    ],
  },
  reactHooks.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
    ...react.configs['recommended-type-checked'],
  },

  {
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'react/no-children-prop': 'off',
      'react-hooks/react-compiler': 'warn',
    },
  },
];
