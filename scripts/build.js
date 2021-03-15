#!/usr/bin/node
const {build, loadEnv} = require('vite');
const {dirname} = require('path');

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

const packagesConfigs = [
  'packages/main/vite.config.js',
  'packages/preload/vite.config.js',
  'packages/renderer/vite.config.js',
];


/**
 * Run `vite build` for config file
 */
const buildByConfig = (configFile) => build({configFile, mode});
(async () => {
  try {
    const totalTimeLabel = 'Total bundling time';
    console.time(totalTimeLabel);

    for (const packageConfigPath of packagesConfigs) {

      const consoleGroupName = `${dirname(packageConfigPath)}/`;
      console.group(consoleGroupName);

      const timeLabel = 'Bundling time';
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
