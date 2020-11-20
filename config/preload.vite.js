const builtins = require('builtin-modules')


const {join} = require('path')

/**
 * Vite shared config, assign alias and root dir
 * @type {import('vite').UserConfig}
 */
module.exports = {
  entry: 'src/preload/index',
  outDir: 'dist/source/preload',
  assetsDir: '.',
  // root: join(__dirname, '../src/main'),
  emitManifest: true,
  alias: {
    '/@preload/': join(__dirname, '../src/preload'),
  },
  rollupOutputOptions: {
    format: 'cjs',
  },
  rollupInputOptions: {
    external: [...builtins, 'electron'],
  },
}
