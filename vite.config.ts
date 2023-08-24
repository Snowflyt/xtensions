import * as packageJson from './package.json';
import path from 'node:path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import EsLint from 'vite-plugin-linter';
import tsConfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig((configEnv) => ({
  plugins: [
    tsConfigPaths(),
    EsLint.linterPlugin({
      include: ['src/**/*.{ts,tsx}'],
      linters: [new EsLint.EsLinter({ configEnv })],
    }),
    dts({
      include: ['src/'],
    }),
  ],
  build: {
    lib: {
      entry: path.resolve('src', 'index.ts'),
      name: 'xtensions',
      formats: ['es', 'umd'],
      fileName: (format) =>
        format === 'es' ? 'index.js' : `index.${format}.js`,
    },
    rollupOptions: {
      external: [...Object.keys(packageJson['dependencies'])],
    },
  },
}));
