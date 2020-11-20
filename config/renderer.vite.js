const {join} = require('path')

/**
 * Vite shared config, assign alias and root dir
 * @type {import('vite').UserConfig}
 */
module.exports = {
  root: join(process.cwd(), './src/renderer'),
  outDir: join(process.cwd(), 'dist/source/renderer'),
  base: '',
  optimizeDeps: {
    exclude: ['electron-updater'],
  },
  rollupOutputOptions: {
    entryFileNames: `[name].js`,
    chunkFileNames: `[name].js`,
    assetFileNames: `[name].[ext]`
  },
  alias: {
    '/@/': join(__dirname, '../src/renderer'),
  },
}
