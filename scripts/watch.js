#!/usr/bin/node

const {createServer, build} = require('vite');
const electronPath = require('electron');
const {spawn} = require('child_process');

/** @type 'production' | 'development' | 'test' */
const mode = process.env.MODE = process.env.MODE || 'development';

/** @type {import('vite').LogLevel} */
const LOG_LEVEL = 'warn';

/** @type {import('vite').InlineConfig} */
const sharedConfig = {
  mode,
  build: {
    watch: {},
  },
  logLevel: LOG_LEVEL,
};

const setupMainPackageWatcher = (viteDevServer) => {
  // Write a value to an environment variable to pass it to the main process.
  {
    const protocol = `http${viteDevServer.config.server.https ? 's' : ''}:`;
    const host = viteDevServer.config.server.host || 'localhost';
    const port = viteDevServer.config.server.port; // Vite searches for and occupies the first free port: 3000, 3001, 3002 and so on
    const path = '/';
    process.env.VITE_DEV_SERVER_URL = `${protocol}//${host}:${port}${path}`;
  }

  /**
   * Start or restart App when source files are changed
   * @returns {import('vite').Plugin}
   */
  const electronRunner = () => {
    /** @type {ChildProcessWithoutNullStreams | null} */
    let spawnProcess = null;

    return {
      name: 'reload-app-on-main-package-change',
      writeBundle() {
        if (spawnProcess !== null) {
          spawnProcess.kill('SIGINT');
          spawnProcess = null;
        }

        spawnProcess = spawn(String(electronPath), ['.']);

        spawnProcess.stdout.on('data', d => console.log(d.toString()));
        spawnProcess.stderr.on('data', d => console.error(d.toString()));
      },
    };
  };

  return build({
    ...sharedConfig,
    configFile: 'packages/main/vite.config.js',
    plugins: [electronRunner()],
  });
};


const setupPreloadPackageWatcher = (viteDevServer) => {
  /**
   * Start or restart App when source files are changed
   * @returns {import('vite').Plugin}
   */
  const reloadPage = () => {
    return {
      name: 'reload-page-on-preload-package-change',
      writeBundle() {
        viteDevServer.ws.send({
          type: 'full-reload',
        });
      },
    };
  };

  return build({
    ...sharedConfig,
    configFile: 'packages/preload/vite.config.js',
    plugins: [reloadPage()],
  });
};

(async () => {
  try {
    const viteDevServer = await createServer({
      ...sharedConfig,
      configFile: 'packages/renderer/vite.config.js',
    });

    await viteDevServer.listen();

    await setupPreloadPackageWatcher(viteDevServer);
    await setupMainPackageWatcher(viteDevServer);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
