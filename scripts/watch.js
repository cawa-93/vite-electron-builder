#!/usr/bin/node

// TODO:
// - Disable dependency optimization during development.
// - Need more tests
// - Refactoring

const chokidar = require('chokidar');
const {createServer, build, normalizePath} = require('vite');
const electronPath = require('electron');
const {spawn} = require('child_process');
const {join} = require('path');

const mode = process.env.MODE || 'development';

const TIMEOUT = 500;

function debounce(f, ms) {
  let isCoolDown = false;
  return function () {
    if (isCoolDown) return;
    f.apply(this, arguments);
    isCoolDown = true;
    setTimeout(() => isCoolDown = false, ms);
  };
}

(async () => {

// Create Vite dev server
  const viteDevServer = await createServer({
    mode,
    configFile: join(process.cwd(), 'config/renderer.vite.js'),
  });

  await viteDevServer.listen();


// Determining the current URL of the server. It depend on /config/renderer.vite.js
// Write a value to an environment variable to pass it to the main process.
  {
    const protocol = `http${viteDevServer.config.server.https ? 's' : ''}:`;
    const host = viteDevServer.config.server.host || 'localhost';
    const port = viteDevServer.config.server.port; // Vite searches for and occupies the first free port: 3000, 3001, 3002 and so on
    const path = '/';
    process.env.VITE_DEV_SERVER_URL = `${protocol}//${host}:${port}${path}`;
  }


  /** @type {ChildProcessWithoutNullStreams | null} */
  let spawnProcess = null;
  const runMain = debounce(() => {
    if (spawnProcess !== null) {
      spawnProcess.kill('SIGINT');
      spawnProcess = null;
    }

    spawnProcess = spawn(electronPath, [join(process.cwd(), 'dist/source/main/index.cjs.js')]);

    spawnProcess.stdout.on('data', d => console.log(d.toString()));
    spawnProcess.stderr.on('data', d => console.error(d.toString()));

    return spawnProcess;

  }, TIMEOUT);

  const buildMain = () => {
    return build({mode, configFile: join(process.cwd(), 'config/main.vite.js')});
  };

  const buildMainDebounced = debounce(buildMain, TIMEOUT);

  const runPreload = debounce(() => {
    viteDevServer.ws.send({
      type: 'full-reload',
    });

  }, TIMEOUT);

  const buildPreload = () => {
    return build({mode, configFile: join(process.cwd(), 'config/preload.vite.js')});
  };

  const buildPreloadDebounced = debounce(buildPreload, TIMEOUT);


  await Promise.all([
    buildMain(),
    buildPreload(),
  ]);


  const watcher = chokidar.watch([
    join(process.cwd(), 'src/main/**'),
    join(process.cwd(), 'src/preload/**'),
    join(process.cwd(), 'dist/source/main/**'),
    join(process.cwd(), 'dist/source/preload/**'),
  ], {ignoreInitial: true});


  watcher
    .on('unlink', path => {
      const normalizedPath = normalizePath(path);
      if (spawnProcess !== null && normalizedPath.includes('/dist/source/main/')) {
        spawnProcess.kill('SIGINT');
        spawnProcess = null;
      }
    })
    .on('add', path => {
      const normalizedPath = normalizePath(path);
      if (normalizedPath.includes('/dist/source/main/')) {
        return runMain();
      }

      if (spawnProcess !== undefined && normalizedPath.includes('/dist/source/preload/')) {
        return runPreload(normalizedPath);
      }
    })
    .on('change', (path) => {
      const normalizedPath = normalizePath(path);

      if (normalizedPath.includes('/src/main/')) {
        return buildMainDebounced();
      }

      if (normalizedPath.includes('/dist/source/main/')) {
        return runMain();
      }

      if (normalizedPath.includes('/src/preload/')) {
        return buildPreloadDebounced();
      }

      if (normalizedPath.includes('/dist/source/preload/')) {
        return runPreload(normalizedPath);
      }
    });

  await runMain();
})();
