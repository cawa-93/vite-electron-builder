#!/usr/bin/node
console.time('Bundling time');
const {build} = require('vite');
const {join} = require('path');

const mode = process.env.MODE || 'production';

const entryPoints = [
  join(process.cwd(), 'config/main.vite.js'),
  join(process.cwd(), 'config/preload.vite.js'),
  join(process.cwd(), 'config/renderer.vite.js'),
];


const buildEntryPoint = (configFile) => build({configFile, mode});

const generatePackageJson = () => {
  const {writeFile} = require('fs/promises');
  const packageJson = require(join(process.cwd(), 'package.json'));

  // Cleanup
  delete packageJson.scripts;

  // Remove all bundled dependencies
  delete packageJson.devDependencies;
  const {default: external} = require('../config/external-packages');
  for (const type of ['dependencies', 'optionalDependencies']) {
    if (packageJson[type] === undefined) {
      continue;
    }

    for (const key of Object.keys(packageJson[type])) {
      if (!external.includes(key)) {
        delete packageJson[type][key];
      }
    }
  }

  // Set version
  const now = new Date;
  packageJson.version = `${now.getFullYear() - 2000}.${now.getMonth() + 1}.${now.getDate()}`;

  // Create new package.json
  return writeFile(join(process.cwd(), 'dist/source/package.json'), JSON.stringify(packageJson));
};


Promise.all(entryPoints.map(buildEntryPoint))
  .then(generatePackageJson)
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => console.timeEnd('Bundling time'));
