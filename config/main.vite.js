const builtins = require('builtin-modules')

const {join} = require('path')

/**
 * Vite shared config, assign alias and root dir
 * @type {import('vite').UserConfig}
 */
module.exports = {
  entry: 'src/main/index',
  outDir: 'dist/source/main',
  assetsDir: '.',
  alias: {
    '/@/': join(__dirname, '../src/main'),
  },
  rollupOutputOptions: {
    format: 'cjs',
    entryFileNames: `[name].js`,
    chunkFileNames: `[name].js`,
    assetFileNames: `[name].[ext]`
  },
  rollupInputOptions: {
    external: require('./external-packages'),
  },
}
