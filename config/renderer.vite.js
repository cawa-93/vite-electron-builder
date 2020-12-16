const {join} = require('path')

/**
 * Vite shared config, assign alias and root dir
 * @type {import('vite').UserConfig}
 */
module.exports = {
  root: join(process.cwd(), './src/renderer'),
  outDir: join(process.cwd(), 'dist/source/renderer'),
  base: '',
  mode: process.env.NODE_ENV || 'production',
  rollupOutputOptions: {
    entryFileNames: `[name].js`,
    chunkFileNames: `[name].js`, assetFileNames: `[name].[ext]`
  },
                             optimizeDeps: {
          exclude: require('./external-packages')
  },
  alias: {
    '/@/': join(__dirname, '../src/renderer'),
  },
}
