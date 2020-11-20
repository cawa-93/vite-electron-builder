const builtins = require('builtin-modules')


const { join } = require('path')

/**
 * Vite shared config, assign alias and root dir
 * @type {import('vite').UserConfig}
 */
module.exports = {
  entry: 'src/main/index',
  outDir: 'dist/source/main',
  assetsDir: '.',
  // root: join(__dirname, '../src/main'),
  emitManifest: true,
  alias: {
    '/@main/': join(__dirname, '../src/main'),
  },
  rollupOutputOptions: {
    format: 'cjs',
  },
  rollupInputOptions: {
    external: [...builtins, 'electron', 'electron-updater'],
  },
}
