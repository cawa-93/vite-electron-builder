const { join } = require('path')

/**
 * Vite shared config, assign alias and root dir
 * @type {import('vite').UserConfig}
 */
module.exports = {
  root: join(process.cwd(), './src/renderer'),
  outDir: join(process.cwd(), 'dist/source/renderer'),
  base: '',
  // root: join(__dirname, '../src/main'),
  alias: {
    '/@/': join(__dirname, '../src/renderer'),
  }
}
