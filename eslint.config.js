import pluginJs from '@eslint/js';
import pluginReact from 'eslint-plugin-react';
import reactCompiler from 'eslint-plugin-react-compiler';
import tseslint from 'typescript-eslint';

import pluginQuery from '@tanstack/eslint-plugin-query';
import pluginRouter from '@tanstack/eslint-plugin-router';
import eslintConfigPrettier from 'eslint-config-prettier';
import drizzle from 'eslint-plugin-drizzle';
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
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    settings: {
      react: {
        version: 'detect',
      },
      plugins: {
        drizzle,
      },
      rules: {
        ...drizzle.configs.recommended.rules,
      },
    },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  ...pluginQuery.configs['flat/recommended'],
  ...pluginRouter.configs['flat/recommended'],
  eslintConfigPrettier,
  reactCompiler.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },

  {
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'react/no-children-prop': 'off',
    },
  },
];
