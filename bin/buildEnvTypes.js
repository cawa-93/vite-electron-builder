#!/usr/bin/env node

const {resolveConfig} = require('vite');
const {writeFileSync, mkdirSync, existsSync} = require('fs');
const {resolve, dirname} = require('path');

/**
 * @param {string[]} modes
 * @param {string} filePath
 */
async function buildMode(modes, filePath) {
  const interfaces = await Promise.all(modes.map(async mode => {
    const modeInterfaceName = `${mode}Env`;
    const {env} = await resolveConfig({mode, configFile: resolve(process.cwd(), 'config/main.vite.js')}, 'build');

    const interfaceDeclaration = `interface ${modeInterfaceName} ${JSON.stringify(env)}`;

    return {modeInterfaceName, interfaceDeclaration};
  }));

  const interfacesDeclarations = interfaces.map(({interfaceDeclaration}) => interfaceDeclaration).join('\n');
  const type = interfaces.map(({modeInterfaceName}) => modeInterfaceName).join(' | ');

  const dir = dirname(filePath);
  if (!existsSync(dir)) {
    mkdirSync(dir);
  }

  writeFileSync(filePath, `${interfacesDeclarations}\ntype ImportMetaEnv = ${type}\n`, {encoding: 'utf-8', flag: 'w'});
}

buildMode(['production', 'development', 'test'], resolve(process.cwd(), './types/env.d.ts'))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
