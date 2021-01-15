const {join} = require('path');
const {chrome} = require('./electron-dep-versions');

/**
 * @type {import('vite').UserConfig}
 * @see https://vitejs.dev/config/
 */
module.exports = {
  alias: {
    '/@/': join(process.cwd(), './src/preload') + '/',
  },
  build: {
    target: `chrome${chrome}`,
    outDir: 'dist/source/preload',
    assetsDir: '.',
    minify: process.env.MODE === 'development' ? false : 'terser',
    lib: {
      entry: 'src/preload/index.ts',
      formats: ['cjs'],
    },
    rollupOptions: {
      external: require('./external-packages').default,
      output: {
        entryFileNames: '[name].[format].js',
        chunkFileNames: '[name].[format].js',
        assetFileNames: '[name].[ext]',
      },
    },
    emptyOutDir: true,
  },
};
