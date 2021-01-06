const {join} = require('path');
const {chrome} = require('./electron-dep-versions');

/**
 * @type {import('vite').UserConfig}
 */
module.exports = {
  alias: [
    {
      find: /^\/@\//,
      replacement: join(process.cwd(), './src/preload') + '/',
    },
  ],
  build: {
    target: `chrome${chrome}`,
    outDir: 'dist/source/preload',
    assetsDir: '.',
    lib: {
      entry: 'src/preload/index.ts',
      formats: ['cjs'],
    },
    rollupOptions: {
      external: require('./external-packages'),
      output: {
        entryFileNames: '[name].[format].js',
        chunkFileNames: '[name].[format].js',
        assetFileNames: '[name].[ext]',
      },
    },
  },
};
