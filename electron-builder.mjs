import pkg from './package.json' with {type: 'json'};
import mapWorkspaces from '@npmcli/map-workspaces';
import {resolve, matchesGlob, sep, join} from 'node:path';
import {pathToFileURL} from 'node:url';
import {readdirSync} from 'node:fs';

/**
 * @type {Map<string, string>}
 */
const workspaces = await mapWorkspaces({
  cwd: process.cwd(),
  pkg,
});

const allFilesToExclude = [];

for (const [name, path] of workspaces) {

  const pkgPath = resolve(path, 'package.json');
  const {default: workspacePkg} = await import(pathToFileURL(pkgPath), {with: {type: 'json'}});

  let patterns = workspacePkg.files || [];
  patterns.push('package.json');

  patterns = patterns.map(p => resolve(path, p));

  let filesToExclude = getFiles(
    path,
    patterns,
  );

  filesToExclude = filesToExclude.map(f =>  join('!node_modules', name, f.replace(path + sep, '')));
  allFilesToExclude.push(...filesToExclude);
}

function getFiles(directory, patterns) {
  let results = [];
  const files = readdirSync(directory, {withFileTypes: true});

  fileLoop: for (const file of files) {
    const fileFullPath = resolve(directory, file.name);
    if (file.isDirectory()) {
      results = results.concat(getFiles(fileFullPath, patterns));
    } else {
      for (const pattern of patterns) {
        if (matchesGlob(fileFullPath, pattern)) {
          continue fileLoop;
        }
      }

      results.push(fileFullPath);
    }
  }

  return results;
}

export default {
  directories: {
    output: 'dist',
    buildResources: 'buildResources',
  },
  files: [
    'packages/entry-point.js',
    ...allFilesToExclude,
  ],
};
