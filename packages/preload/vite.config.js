import {chrome} from '../../.electron-vendors.cache.json';
// import {preload} from 'unplugin-auto-expose';
import {join} from 'node:path';
import {injectAppVersion} from '../../version/inject-app-version-plugin.mjs';

const PACKAGE_ROOT = __dirname;
const PROJECT_ROOT = join(PACKAGE_ROOT, '../..');

/**
 * @type {import('vite').UserConfig}
 * @see https://vitejs.dev/config/
 */
const config = {
  mode: process.env.MODE,
  root: PACKAGE_ROOT,
  envDir: PROJECT_ROOT,
  build: {
    ssr: true,
    sourcemap: 'inline',
    target: `chrome${chrome}`,
    outDir: 'dist',
    assetsDir: '.',
    minify: process.env.MODE !== 'development',
    lib: {
      entry: 'src/index.ts',
      formats: ['es'],
    },
    rollupOptions: {
      output: {
        entryFileNames: '[name].mjs',
      },
    },
    emptyOutDir: true,
    reportCompressedSize: false,
  },

  // TODO: Enable unplugin-auto-expose when it will be fixed for ESM support
  plugins: [/* vite.preload(), */ injectAppVersion()],
};

export default config;
