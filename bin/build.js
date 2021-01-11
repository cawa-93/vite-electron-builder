#!/usr/bin/node
const {build} = require('vite');
const {join} = require('path');

const mode = process.env.MODE || 'production';

const entryPoints = [
  join(process.cwd(), 'config/main.vite.js'),
  join(process.cwd(), 'config/preload.vite.js'),
  join(process.cwd(), 'config/renderer.vite.js'),
];

const buildEntryPoint = (configFile) => build({configFile, mode});

const generatePacjJson = () => {
  const {writeFile} = require('fs/promises');
  const pjson = require(join(process.cwd(), 'package.json'));

  // Remove all bundled dependencies
  const external = require('../config/external-packages');
  for (const type of ['dependencies', 'devDependencies', 'optionalDependencies']) {
    if (pjson[type] === undefined) {
      continue;
    }

    for (const key of Object.keys(pjson[type])) {
      if (!external.includes(key)) {
        delete pjson[type][key];
      }
    }
  }

  // Set version
  const now = new Date;
  pjson.version = `${now.getFullYear() - 2000}.${now.getMonth() + 1}.${now.getDate()}`;

  // Create new package.json
  return writeFile(join(process.cwd(), 'dist/source/package.json'), JSON.stringify(pjson));
};

Promise.all(entryPoints.map(buildEntryPoint))
  .then(generatePacjJson)
  .catch(e => {
    console.error(e);
    process.exit(1);
  });
