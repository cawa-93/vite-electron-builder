/**
 * @type {import('eslint').}
 */
module.exports = {
  root: true,
  env: {
    es2021: true,
  },

  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },

  ignorePatterns: [
    'node_modules/**',
    'dist/**',
  ],
}
