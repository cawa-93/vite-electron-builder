import {resolveModuleExportNames} from 'mlly';
import {getChromeMajorVersion} from '@vite-electron-builder/electron-versions';

export default /**
 * @type {import('vite').UserConfig}
 * @see https://vitejs.dev/config/
 */
({
  build: {
    ssr: true,
    sourcemap: 'inline',
    outDir: 'dist',
    target: `chrome${getChromeMajorVersion()}`,
    assetsDir: '.',
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
});

/**
 * This plugin creates a browser (renderer) version of `preload` package.
 * Basically, it just read all nominals you exported from package and define it as globalThis properties
 * expecting that real values were exposed by `electron.contextBridge.exposeInMainWorld()`
 *
 * Example:
 * ```ts
 * // index.ts
 * export const someVar = 'my-value';
 * ```
 *
 * Output
 * ```js
 * // _virtual_browser.mjs
 * export const someVar = globalThis[<hash>] // 'my-value'
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
      if (id === resolvedVirtualModuleId) {
        const exportedNames = await resolveModuleExportNames('./src/index.ts', {
          url: import.meta.url,
        });
        return exportedNames.reduce((s, key) => {
          return (
            s +
            (key === 'default'
              ? `export default globalThis['${btoa(key)}'];\n`
              : `export const ${key} = globalThis['${btoa(key)}'];\n`)
          );
        }, '');
      }
    },
  };
}
