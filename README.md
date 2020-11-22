# Overwrite

> Vite+Electron = 🔥

This template uses [Vite](https://github.com/vitejs/vite/) as bundler and [Electron builder](https://www.electron.build/) as compiler.

This is a minimalist template created mainly for my personal needs and is designed for a **simple and flexible start of your project**.

## Status
- ✅ Building main and renderer endpoints in production mode -- works great.
- ✅ Development mode with hot reload for renderer endpoint -- works great.
- ⚠ Development mode for main and preload endpoints -- work fine, but it is possible to reboot the backend faster ([vite#972](https://github.com/vitejs/vite/issues/972))
- ✅ Compile the app with electron builder in CD -- work.
- ✅ Auto update -- work.
- ⏳ Code signing -- planned. 
- ⚠ Typechecking in `.ts` and `.vue` files -- works but needs improvement. I want to integrate it with [reviewdog](https://github.com/reviewdog/reviewdog). Typechecking use [@vuedx/typecheck](https://github.com/znck/vue-developer-experience/tree/master/packages/typecheck)
- ⚠ Linting -- work fine, but need review the configuration files and refactor its. It may also intersect somewhat with Typechecking.
- ⏳ Add Vue dev tools -- planned.
- ⏳ Refactor and simplify the set of npm scripts -- planned.

## How it works
The template holds a minimum number of [dependencies](https://github.com/cawa-93/vite-electron-builder/blob/main/package.json). Only **Vite** is used for building. nothing more.

All additional dependencies for linter or typechecking well be install, if necessary in the CI workflow.

### Project Structure
- `/src`
  Contains all source code.
  - `/src/main` 
  Contain entrypoint for Electron [**main script**](https://www.electronjs.org/docs/tutorial/quick-start#create-the-main-script-file).
  - `/src/renderer` 
    Contain entrypoint for Electron [**web page**](https://www.electronjs.org/docs/tutorial/quick-start#create-a-web-page). All files in this directory work as a regular Vue application.
  - `/src/preload` 
    Contain entrypoint for custom script. It uses as `preload` script in `BrowserWindow.webPreferences.preload`. See [Checklist: Security Recommendations](https://www.electronjs.org/docs/tutorial/security#2-do-not-enable-nodejs-integration-for-remote-content).
  - `/src/*` It is assumed any entry points will be added here, for custom scripts, web workers, webassembly compilations, etc.
- `/dist` 
  - `/dist/source`
  Contains all bundled code.
    - `/dist/source/main` Bundled *main* entrypoint.
    - `/dist/source/renderer` Bundled *renderer* entrypoint.
    - `/dist/source/preload` Bundled *preload* entrypoint.
    - `/dist/source/*` Bundled any custom files.
  - `/dist/app`
  Contain packages and ready-to-distribute electron apps for any platform. Files in this directory created using [electron-builder](https://www.electron.build/).
- `/config`
  Contains various configuration files for Vite, TypeScript, electron builder, etc.
- `/tasks`
  It is believed any scripts for build the application will be located here.
- `/types` 
  Contains all declaration files to be applied globally to the entire project
  
