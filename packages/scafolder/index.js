import pkgJson from '../renderer/package.json' with {type: 'json'};
import * as fs from 'node:fs';


const step = createStepLogger();

await step(
  'Changing renderer package name to "@vite-electron-builder/renderer"',
  changeRendererPackageName,
);

await step(
  'Add "--base=./" flag to vite build command',
  addTheBaseFlagToBuildCommand,
);

await step(
  'Change the "main" property to "./dist/index.html"',
  addTheMainProperty,
);




function changeRendererPackageName() {
  if (pkgJson?.name === '@vite-electron-builder/renderer') {
    return;
  }
  pkgJson.name = '@vite-electron-builder/renderer';
  savePkg();
}

function addTheBaseFlagToBuildCommand() {
  if (!pkgJson?.scripts?.build) {
    console.warn('No build script found. Skip.');
    return false;
  }

  if (!pkgJson.scripts.build.includes('vite build')) {
    console.warn('The build script is founded but it was not recognized as "vite build" command. Skip.');
    return false;
  }

  if (pkgJson.scripts.build.includes('--base')) {
    console.warn('The "--base" flag already exists. Skip.');
    return false;
  }

  pkgJson.scripts.build = pkgJson.scripts.build.replaceAll('vite build', 'vite build --base ./');
  savePkg();
}

function addTheMainProperty() {
  if (pkgJson.main) {
    console.warn('The "main" property already exists. Skip.');
    return false;
  }

  pkgJson.main = './dist/index.html';
  savePkg();
}


function createStepLogger() {

console.log('\n\n\n\n----------');
console.log('Default vite project has been successfully created.');
console.log('However, additional modifications to the default vite project are now being implemented');
console.log('to ensure compatibility with the template.');
console.log('All changes are detailed below.');
console.log('\n');

  let stepNumber = 1;

  return async function(message, callback) {
    const stepMessage = `${stepNumber++}. ${message}`;

    console.group(stepMessage);
    try {
      await callback();
    } catch (error) {
      console.error(error);
      process.exit(1);
    } finally {
      console.groupEnd();
    }
  };
}


function savePkg() {
  fs.writeFileSync('../renderer/package.json', JSON.stringify(pkgJson, null, 2), {encoding: 'utf8'});
}
