/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
const {loadEnv} = require('vite')

/**
 * Load variables from `.env.[mode]` files in cwd
 * and set it to `process.env`
 *
 * @param {string} mode
 * @param {string} cwd
 *
 * @return {void}
 */
export function loadAndSetEnv(mode, cwd) {
  const env = loadEnv(mode || 'production', cwd)
  for (const envKey in env) {
    if (process.env[envKey] === undefined && env.hasOwnProperty(envKey)) {
      process.env[envKey] = env[envKey]
    }
  }
}
