#!/usr/bin/node
const {build, loadEnv} = require('vite');
const {join} = require('path');

/** @type 'production' | 'development' | 'test' */
const mode = process.env.MODE || 'production';

/**
 * Vite looks for `.env` files only in "packages/**" directories.
 * Therefore, you must manually load and set the environment variables from the root directory above
 */
const env = loadEnv(mode, process.cwd());
for (const envKey in env) {
  if (process.env[envKey] === undefined && env.hasOwnProperty(envKey)) {
    process.env[envKey] = env[envKey];
  }
}

const packagesMap = new Map([
  ['main', join(process.cwd(), 'packages/main/vite.config.js')],
  ['preload', join(process.cwd(), 'packages/preload/vite.config.js')],
  ['renderer', join(process.cwd(), 'packages/renderer/vite.config.js')],
]);


/**
 * Run `vite build` for config file
 */
const buildByConfig = (configFile) => build({configFile, mode});
(async () => {
  try {
    const totalTimeLabel = 'Total bundling time';
    console.time(totalTimeLabel);

    for (const [packageName, packageConfigPath] of packagesMap) {
      console.group(`Build ${packageName}:`);

      const timeLabel = `Build ${packageName} time`;
      console.time(timeLabel);

      await buildByConfig(packageConfigPath);

      console.timeEnd(timeLabel);
      console.groupEnd();
      console.log('\n'); // Just for pretty print
    }
    console.timeEnd(totalTimeLabel);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
