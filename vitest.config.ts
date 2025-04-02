import path from 'path';
import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './app.config';
import packageJson from './package.json';

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      name: packageJson.name,
      dir: './tests',
      watch: false,
      environment: 'jsdom',
      typecheck: { enabled: true },
    },
    resolve: {
      alias: {
        '~': path.resolve(__dirname, './app'),
      },
    },
  }),
);
