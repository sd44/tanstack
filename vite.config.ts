import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import tsConfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  // test: {
  //   name: packageJson.name,
  //   dir: './tests',
  //   watch: false,
  //   environment: 'happy-dom',
  //   typecheck: { enabled: true },
  //   setupFiles: ['./vitest.setup.ts'], // 指向你的 setup 文件
  // },
  server: {
    port: 3000,
  },
  plugins: [
    tsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    tanstackStart({ customViteReactPlugin: true }),
    viteReact(),
  ],
  // optimizeDeps: {
  //   exclude: [
  //     'bun', // Or the exact package name if different
  //   ],
  // },
  // build: {
  //   // This is key for server-side builds:
  //   rollupOptions: {
  //     external: [
  //       // List modules that should NOT be bundled by Vite,
  //       // but instead assumed to be available in the runtime environment.
  //       'bun',
  //       'drizzle-orm',
  //       // Add other Node.js built-in modules if you encounter similar errors
  //       // that Vite tries to bundle for browser (e.g., 'path', 'fs', 'crypto' if not polyfilled)
  //     ],
  //   },
  // },
});
