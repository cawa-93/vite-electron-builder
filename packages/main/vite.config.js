import {node} from '../../electron-vendors.config.json'
import {join} from 'path'
import externalPackages from '../../external-packages.config.js'
import {defineConfig} from 'vite'
import {loadAndSetEnv} from '../../scripts/loadAndSetEnv.mjs'

const PACKAGE_ROOT = __dirname

/**
 * Vite looks for `.env.[mode]` files only in `PACKAGE_ROOT` directory.
 * Therefore, you must manually load and set the environment variables from the root directory above
 */
loadAndSetEnv(process.env.MODE, process.cwd())

/**
 * @see https://vitejs.dev/config/
 */
export default defineConfig({
  root: PACKAGE_ROOT,
  resolve: {
    alias: {
      '/@/': join(PACKAGE_ROOT, 'src') + '/',
    },
  },
  build: {
    sourcemap: 'inline',
    target: `node${node}`,
    outDir: 'dist',
    assetsDir: '.',
    minify: process.env.MODE === 'development' ? false : undefined, // undefined must set default value
    lib: {
      entry: 'src/index.ts',
      formats: ['cjs'],
    },
    rollupOptions: {
      external: externalPackages,
      output: {
        entryFileNames: '[name].cjs',
      },
    },
    emptyOutDir: true,
  },
})
