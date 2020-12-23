const {join} = require('path');

/**
 * Vite shared config, assign alias and root dir
 * @type {import('vite').UserConfig}
 */
module.exports = {
  entry: 'src/preload/index',
  outDir: 'dist/source/preload',
  assetsDir: '.',
  mode: process.env.NODE_ENV || 'production',
  alias: {
    '/@/': join(__dirname, '../src/preload'),
  },
  rollupOutputOptions: {
    format: 'cjs',


    entryFileNames: '[name].js',
    chunkFileNames: '[name].js',
    assetFileNames: '[name].[ext]',
  },
  rollupInputOptions: {
    external: require('./external-packages'),
  },
};
