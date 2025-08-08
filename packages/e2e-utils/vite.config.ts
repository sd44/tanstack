import { tanstackViteConfig } from '@tanstack/config/vite';
import { defineConfig, mergeConfig } from 'vitest/config';
import packageJson from './package.json' with { type: 'json' };

const config = defineConfig({
  test: {
    name: packageJson.name,
    dir: './tests',
    watch: false,
    typecheck: { enabled: true },
  },
});

export default mergeConfig(
  config,
  tanstackViteConfig({
    entry: './src/index.ts',
    srcDir: './src',
  }),
);
