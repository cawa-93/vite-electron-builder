import {node} from '../../electron-vendors.config.js';
import {join} from 'path';
import externalPackages from '../../external-packages.config.js';
import {defineConfig} from 'vite';

/**
 * @see https://vitejs.dev/config/
 */
export default defineConfig({
  root: __dirname,
  resolve: {
    alias: {
      '/@/': join(__dirname, 'src') + '/',
    },
  },
  build: {
    sourcemap: 'inline',
    target: `node${node}`,
    outDir: 'dist',
    assetsDir: '.',
    minify: process.env.MODE === 'development' ? false : 'terser',
    lib: {
      entry: 'src/index.ts',
      formats: ['cjs'],
    },
    rollupOptions: {
      external: externalPackages,
      output: {
        entryFileNames: '[name].[format].cjs',
      },
    },
    emptyOutDir: true,
  },
});
