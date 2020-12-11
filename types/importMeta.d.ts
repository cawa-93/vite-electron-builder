interface ImportMeta extends Omit<import('vite/dist/importMeta').ImportMeta, 'env'> {

  /**
   * Environment variables from `.env` files
   *
   * You must run `./bin/buildEnvTypes.js` before to generate `env.d.ts` file
   *
   * @see https://github.com/microsoft/TypeScript/issues/41468
   */
  readonly env: import('./env').ImportMetaEnv
}
