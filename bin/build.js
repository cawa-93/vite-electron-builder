#!/usr/bin/node
const {build} = require('vite');
const {join} = require('path');

/** @type 'production' | 'development' | 'test' */
const mode = process.env.MODE || 'production';

const packagesMap = new Map([
  ['main', join(process.cwd(), 'packages/main/vite.config.ts')],
  ['preload', join(process.cwd(), 'packages/preload/vite.config.ts')],
  ['renderer', join(process.cwd(), 'packages/renderer/vite.config.ts')],
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
