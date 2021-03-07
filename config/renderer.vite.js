const {join} = require('path');
const vue = require('@vitejs/plugin-vue');
const {chrome} = require('./electron-vendors');
/**
 * @type {import('vite').UserConfig}
 * @see https://vitejs.dev/config/
 */
module.exports = {
  root: join(process.cwd(), './src/renderer'),
  resolve: {
    alias: {
      '/@/': join(process.cwd(), './src/renderer') + '/',
    },
  },
  plugins: [vue()],
  base: '',
  build: {
    sourcemap: 'inline',
    target: `chrome${chrome}`,
    polyfillDynamicImport: false,
    outDir: join(process.cwd(), 'dist/source/renderer'),
    assetsDir: '.',
    rollupOptions: {
      external: require('./external-packages').default,
    },
    emptyOutDir: true,
  },
};

