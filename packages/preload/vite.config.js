import {chrome} from '../../.electron-vendors.cache.json';
import {join} from 'node:path';
import {EXPOSED_PREFIX} from './src/exposed-prefix.js';

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
      entry: ['src/exposed.ts', 'virtual:browser.js'],
    },
    rollupOptions: {
      output: [
        {
          // ESM preload scripts must have the .mjs extension
          // https://www.electronjs.org/docs/latest/tutorial/esm#esm-preload-scripts-must-have-the-mjs-extension
          entryFileNames: '[name].mjs',
        },
      ],
    },
    emptyOutDir: true,
    reportCompressedSize: false,
  },
  plugins: [mockExposed()],
};

/**
 * This plugin creates a browser (renderer) version of `preload` package.
 * Basically, it just read all nominals you exported from package and define it as globalThis properties
 * expecting that real values were exposed by `electron.contextBridge.exposeInMainWorld()`
 *
 * Example:
 * ```typescript
 * // index.ts
 * export const someVar = 'my-value';
 * ```
 *
 * Output
 * ```
 * // _virtual_browser.mjs
 * export const someVar = globalThis[EXPOSED_PREFIX + 'someVar']
 * ```
 */
function mockExposed() {
  const virtualModuleId = 'virtual:browser.js';
  const resolvedVirtualModuleId = '\0' + virtualModuleId;

  return {
    name: 'electron-main-exposer',
    resolveId(id) {
      if (id.endsWith(virtualModuleId)) {
        return resolvedVirtualModuleId;
      }
    },
    async load(id) {
      const preload = await import('./src/index.js');
      if (id === resolvedVirtualModuleId) {
        return Object.keys(preload).reduce(
          (s, key) => s + `export const ${key} = globalThis.${EXPOSED_PREFIX}${key};`,
          '',
        );
      }
    },
  };
}

export default config;
