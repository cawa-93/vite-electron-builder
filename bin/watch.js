#!/usr/bin/node

// WARNING! Almost everything in this file needs a better approach.

// TODO:
// - Do not use an watcher from Vite. Use your own watcher, or wait for a solution - https://github.com/vitejs/vite/issues/1434
// - Find the best way to start / restart an electron. Logging from child process.
// - Disable dependency optimization during development.
// - Examine the behavior of vite when starting `build` command but with mode = `development`
// - Refactoring and fix duplicate code


const slash = require('slash');
const {createServer, build, normalizePath} = require('vite');
const {join, relative} = require('path');

const mode = process.env.MODE || 'development';

function startElectron() {
  const {spawn} = require('child_process');

  const electronPath = require('electron');

  return spawn(electronPath, [join(process.cwd(), 'dist/source/main/index.cjs.js')]);
}


(async () => {
  // Create Vite dev server
  const server = await createServer({
    mode,
    configFile: join(process.cwd(), 'config/renderer.vite.js'),
  });


  // Build preload entrypoint
  const buildPreload = () => build({mode, configFile: join(process.cwd(), 'config/preload.vite.js')});
  await buildPreload();

  // Watch `src/preload` and rebuild preload entrypoint
  server.watcher.add(join(process.cwd(), 'src/preload/**'));
  server.watcher.on('change', (file) => {
    file = normalizePath(file);

    if (!file.includes('/src/preload/')) {
      return;
    }

    return buildPreload();
  });

  // Reload page on preload script change
  server.watcher.add(join(process.cwd(), 'dist/source/preload/**'));
  server.watcher.on('change', (file) => {
    file = normalizePath(file);

    if (!file.includes('/dist/source/preload/')) {
      return;
    }

    server.ws.send({
      type: 'full-reload',
      path: '/' + slash(relative(server.config.root, file)),
    });
  });


  // Run Vite server
  await server.listen();


  // Pass current Vite dev server port to Main process
  process.env.VITE_DEV_SERVER_PORT = server.config.server.port;

  // Build main entrypoint
  const buildMain = () => build({mode, configFile: join(process.cwd(), 'config/main.vite.js')});
  await buildMain();

  // Watch `src/main` and rebuild main entrypoint
  server.watcher.add(join(process.cwd(), 'src/main/**'));
  server.watcher.on('change', (file) => {
    file = normalizePath(file);

    if (!file.includes('/src/main/')) {
      return;
    }

    return buildMain();
  });



  // Run electron app
  startElectron();
})();

