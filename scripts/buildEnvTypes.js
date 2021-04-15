#!/usr/bin/env node

const {resolveConfig} = require('vite');
const {writeFileSync, mkdirSync, existsSync} = require('fs');
const {resolve, dirname} = require('path');

const MODES = ['production', 'development', 'test'];

const typeDefinitionFile = resolve(process.cwd(), './types/env.d.ts');

/**
 *
 * @return {string}
 */
function getBaseInterface() {
  return 'interface IBaseEnv {[key: string]: string}';
}

/**
 *
 * @param {string} mode
 * @return {Promise<{name: string, declaration: string}>}
 */
async function getInterfaceByMode(mode) {
  const interfaceName = `${mode}Env`;
  const {env: envForMode} = await resolveConfig({mode}, 'build');
  return {
    name: interfaceName,
    declaration: `interface ${interfaceName} extends IBaseEnv ${JSON.stringify(envForMode)}`,
  };
}

/**
 * @param {string[]} modes
 * @param {string} filePath
 */
async function buildMode(modes, filePath) {

  const IBaseEnvDeclaration = getBaseInterface();

  const interfaces = await Promise.all(modes.map(getInterfaceByMode));

  const allDeclarations = interfaces.map(i => i.declaration);
  const allNames = interfaces.map(i => i.name);

  const ImportMetaEnvDeclaration = `type ImportMetaEnv = Readonly<${allNames.join(' | ')}>`;

  const content = `
    ${IBaseEnvDeclaration}
    ${allDeclarations.join('\n')}
    ${ImportMetaEnvDeclaration}
  `;

  const dir = dirname(filePath);
  if (!existsSync(dir)) {
    mkdirSync(dir);
  }


  writeFileSync(filePath, content, {encoding: 'utf-8', flag: 'w'});
}

buildMode(MODES, typeDefinitionFile)
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
