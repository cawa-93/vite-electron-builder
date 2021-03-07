const {node} = require('./electron-vendors');
const {join} = require('path');

/**
 * @type {import('vite').UserConfig}
 * @see https://vitejs.dev/config/
 */
module.exports = () => {

  return {
    resolve: {
      alias: {
        '/@/': join(process.cwd(), './src/main') + '/',
      },
    },
    build: {
      sourcemap: 'inline',
      target: `node${node}`,
      outDir: 'dist/source/main',
      assetsDir: '.',
      minify: process.env.MODE === 'development' ? false : 'terser',
      lib: {
        entry: 'src/main/index.ts',
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
};
