const {join} = require('path');
const vue = require('@vitejs/plugin-vue');
const {chrome} = require('./electron-dep-versions');
/**
 * @type {import('vite').UserConfig}
 */
module.exports = {
  root: join(process.cwd(), './src/renderer'),
  alias: {
    '/@/': join(process.cwd(), './src/renderer') + '/',
  },
  plugins: [vue()],
  build: {
    target: `chrome${chrome}`,
    polyfillDynamicImport: false,
    base: '',
    outDir: join(process.cwd(), './dist/source/renderer'),
    assetsDir: '.',
    rollupOptions: {
      external: require('./external-packages').default,
    },
  },
};

