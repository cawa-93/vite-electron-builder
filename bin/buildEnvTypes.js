#!/usr/bin/env node

const {resolveConfig} = require('vite');
const {writeFileSync} = require('fs');
const {resolve} = require('path');

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

  writeFileSync(filePath, `${interfacesDeclarations}\nexport type ImportMetaEnv = ${type}\n`, {encoding: 'utf-8'});
}

buildMode(['production', 'development', 'test'], resolve(process.cwd(), './types/env.d.ts'))
  .catch(console.error);
