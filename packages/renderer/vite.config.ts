import {chrome} from '../../config/electron-vendors.js';
import {join} from 'path';
import externalPackages from '../../config/external-packages.js';
import {defineConfig} from 'vite';
import vue from '@vitejs/plugin-vue';
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
  plugins: [vue()],
  base: '',
  build: {
    sourcemap: 'inline',
    target: `chrome${chrome}`,
    polyfillDynamicImport: false,
    outDir: 'dist',
    assetsDir: '.',
    rollupOptions: {
      external: externalPackages,
    },
    emptyOutDir: true,
  },
});

