/** @type {import('vls').VeturConfig} */
module.exports = {
  settings: {
    'vetur.useWorkspaceDependencies': true,
    'vetur.experimental.templateInterpolationService': true,
  },
  projects: [
    {
      root: './src/renderer',
      tsconfig: './tsconfig.json',
      snippetFolder: './.vscode/vetur/snippets',
      globalComponents: [
        './components/**/*.vue',
      ],
    },
    {
      root: './src/main',
      tsconfig: './tsconfig.json',
    },
    {
      root: './src/preload',
      tsconfig: './tsconfig.json',
    },
  ],
};
