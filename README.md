# Vite Electron Builder Boilerplate v2

> Vite+Electron = 🔥

This is a secure template for electron applications. Written following the latest safety requirements, recommendations and best practices.

Under the hood is used [Vite] — super fast, nextgen bundler, and [electron-builder] for compilation.


___
### Support
- This template maintained by [Alex Kozack][cawa-93-github]. You can [💖 sponsor him][cawa-93-sponsor] for continued development of this template.

- Found a problem? Pull requests are welcome.

- If you have ideas, questions or suggestions - **Welcome to [discussions](https://github.com/cawa-93/vite-electron-builder/discussions)**. 😊
___




## Get started

### Requirements
- **node**: >= v14
- **npm**: >= v7.7

### Installation
Follow these steps to get started with this template:

1. Click the **[Use this template](https://github.com/cawa-93/vite-electron-builder/generate)** button.
    
   **Note**: Only the `main` branch matters. You do not need to include any other branches when creating the repository.
   
That's all you need. 😉

## Features

### Electron [![Electron version](https://img.shields.io/github/package-json/dependency-version/cawa-93/vite-electron-builder/dev/electron?label=%20)][electron]
- Template use the latest electron version with all the latest security patches.
- The architecture of the application is built according to the security [guids](https://www.electronjs.org/docs/tutorial/security) and best practices.
- The latest version of the [electron-builder] is used to compile the application.


### Vite [![Vite version](https://img.shields.io/github/package-json/dependency-version/cawa-93/vite-electron-builder/dev/vite?label=%20)][vite]
- [Vite] is used to bundle all source codes. This is an extremely fast packer that has a bunch of great features. You can learn more about how it is arranged in [this](https://youtu.be/xXrhg26VCSc) video.
- Vite [supports](https://vitejs.dev/guide/env-and-mode.html) reading `.env` files. My template has a separate command to generate `.d.ts` file with type definition your environment variables.

Vite provides you with many useful features, such as: `TypeScript`, `TSX/JSX`, `CSS/JSON Importing`, `CSS Modules`, `Web Assembly` and much more.

[See all Vite features](https://vitejs.dev/guide/features.html).


### TypeScript [![TypeScript version](https://img.shields.io/github/package-json/dependency-version/cawa-93/vite-electron-builder/dev/typescript?label=%20)][typescript] (optional)
- The Latest TypeScript is used for all source code. 
- **Vite** supports TypeScript out of the box. However, it does not support type checking.
- Code formatting rules follow the latest TypeScript recommendations and best practices thanks to [@typescript-eslint/eslint-plugin](https://www.npmjs.com/package/@typescript-eslint/eslint-plugin).

**Note**: If you do not need a TypeScript, you can easily abandon it. To do this, You do not need to make any bundler configuration changes, etc. Just replace all `.ts` files with `.js` files. Additionally, it will be useful to delete TS-specific files, plug-ins and dependencies like `tsconfig.json`, `@typescript-eslint/*`, etc.


### Vue [![Vue version](https://img.shields.io/github/package-json/dependency-version/cawa-93/vite-electron-builder/vue?label=%20)][vue] (optional)
- By default, web pages are built using [Vue]. However, you can easily change it. Or do not use additional frameworks at all. (See [React fork](https://github.com/soulsam480/vite-electron-react-starter))
- Also, by default, the [vue-router] version [![Vue-router version](https://img.shields.io/github/package-json/dependency-version/cawa-93/vite-electron-builder/vue-router?label=%20)][vue-router] is used.
- Code formatting rules follow the latest Vue recommendations and best practices thanks to [eslint-plugin-vue].
- Installed [Vue.js devtools beta](https://chrome.google.com/webstore/detail/vuejs-devtools/ljjemllljcmogpfapbkkighbhhppjdbg) with Vue 3 support.

See [examples of web pages for different frameworks](https://github.com/vitejs/vite/tree/main/packages/create-app).

### Continuous Integration
- The configured workflow for check the types for each push and PR.
- The configured workflow for check the code style for each push and PR.
- **Automatic tests** used [spectron]. Simple, automated test check:
  - Does the main window created and visible?
  - Is the main window not empty?
  - Is dev tools closed?
  

### Continuous delivery
- Each time you push changes to the `main` branch, [`release`](.github/workflows/release.yml) workflow starts, which creates release draft.
  - The version is automatically set based on the current date in the format "yy.mm.dd".
  - Notes are automatically generated and added to the release draft.
  - Code signing supported. See [`compile` job in `release` workflow](.github/workflows/release.yml).
- **Auto-update is supported**. After the release will be published, all client applications will download the new version and install updates silently.


## Status — WIP

This template was created to make my work easier. It may not be universal, but I try to keep it that way.

I am actively involved in its development. But I do not guarantee that this template will be maintained in the future.


**At the moment, there are the following problems:**

- ⚠ Some files require refactoring.
- ⚠ Watch mode for the `main` and `preload` entry points should be improved. Blocked by  [vite#1434](https://github.com/vitejs/vite/issues/1434).
- ⚠ Typechecking `renderer` package in CI implemented by [![vue-tsc](https://img.shields.io/github/package-json/dependency-version/cawa-93/vite-electron-builder/dev/vue-tsc)][vue-tsc], which has a very early version. This is not a problem if you do not use Vue or TypeScript.
- ⚠ Release notes are created automatically based on commit history. [`scripts/release-notes.js`](scripts/release-notes.js) is used for generation. It may not provide some scenarios. If you encounter a problem - write about it.
- ⏳ I want to migrate all code base to ESM. But because Nodejs  ecosystem is unprepared I not known whether this will give more benefits or more inconvenience.

Some improvement or problems can be listed in [issues](https://github.com/cawa-93/vite-electron-builder/issues).

**Pull requests are welcome**.

## How it works
The template required a minimum [dependencies](package.json). Only **Vite** is used for building, nothing more.

### Project Structure

The structure of this template is very similar to the structure of a monorepo.

The entire source code of the program is divided into three modules (packages) that are bundled each independently:
- [`packages/main`](packages/main)
Electron [**main script**](https://www.electronjs.org/docs/tutorial/quick-start#create-the-main-script-file).
- [`packages/preload`](packages/preload)
Used in `BrowserWindow.webPreferences.preload`. See [Checklist: Security Recommendations](https://www.electronjs.org/docs/tutorial/security#2-do-not-enable-nodejs-integration-for-remote-content).
- [`packages/renderer`](packages/renderer)
Electron [**web page**](https://www.electronjs.org/docs/tutorial/quick-start#create-a-web-page).

### Build web resources

Packages `main` and `preload` are built in [library mode](https://vitejs.dev/guide/build.html#library-mode) as it is a simple javascript.
`renderer` package build as regular web app.

The build of web resources is performed in the [`scripts/build.js`](scripts/build.js). Its analogue is a sequential call to `vite build` for each package.

### Compile App
Next step is run  packaging and compilation a ready for distribution Electron app for macOS, Windows and Linux with "auto update" support out of the box. 

To do this, using the [electron-builder]:
- In npm script `compile`: This script is configured to compile the application as quickly as possible. It is not ready for distribution, is compiled only for the current platform and is used for debugging.
- In GitHub Action: The application is compiled for any platform and ready-to-distribute files are automatically added to the draft GitHub release. 


### Using electron API in renderer
As per the security requirements, context isolation is enabled in this template.
> Context Isolation is a feature that ensures that both your `preload` scripts and Electron's internal logic run in a separate context to the website you load in a [`webContents`](https://github.com/electron/electron/blob/master/docs/api/web-contents.md).  This is important for security purposes as it helps prevent the website from accessing Electron internals, or the powerful APIs your preload script has access to.
>
> This means that the `window` object that your preload script has access to is actually a **different** object than the website would have access to.  For example, if you set `window.hello = 'wave'` in your preload script and context isolation is enabled `window.hello` will be undefined if the website tries to access it.

[Read more about Context Isolation](https://github.com/electron/electron/blob/master/docs/tutorial/context-isolation.md).

Exposing APIs from your `preload script` to the renderer is a common use case and there is a dedicated module in Electron to help you do this in a painless way.
```ts
// packages/preload/src/index.ts
const api = {
  data: ['foo', 'bar'],
  doThing: () => ipcRenderer.send('do-a-thing')
}

contextBridge.exposeInMainWorld('electron', api)
```

To access this API use the `useElectron()` function:
```ts
// packages/renderer/src/App.vue
import {useElectron} from '/@/use/electron'

const {doThing, data} = useElectron()
```

**Note**: Context isolation disabled for `test` environment. See [#693](https://github.com/electron-userland/spectron/issues/693#issuecomment-747872160).



### Modes and Environment Variables
All environment variables set as part of the `import.meta`, so you can access them as follows: `import.meta.env`. 

You can also build type definitions of your variables by running `scripts/buildEnvTypes.js`. This command will create `types/env.d.ts` file with describing all environment variables for all modes.

The mode option is used to specify the value of `import.meta.env.MODE` and the corresponding environment variables files that needs to be loaded.

By default, there are two modes:
  - `production` is used by default
  - `development` is used by `npm run watch` script
  - `test` is used by `npm test` script

When running building, environment variables are loaded from the following files in your project root:

```
.env                # loaded in all cases
.env.local          # loaded in all cases, ignored by git
.env.[mode]         # only loaded in specified env mode
.env.[mode].local   # only loaded in specified env mode, ignored by git
```

**Note:** only variables prefixed with `VITE_` are exposed to your code (e.g. `VITE_SOME_KEY=123`) and `SOME_KEY=123` will not.  you can access `VITE_SOME_KEY` using `import.meta.env.VITE_SOME_KEY`. This is because the `.env` files may be used by some users for server-side or build scripts and may contain sensitive information that should not be exposed in code shipped to browsers.



## Contribution

See [Contributing Guide](contributing.md).


[vite]: https://github.com/vitejs/vite/
[electron]: https://github.com/electron/electron
[electron-builder]: https://github.com/electron-userland/electron-builder
[vue]: https://github.com/vuejs/vue-next
[vue-router]: https://github.com/vuejs/vue-router-next/
[typescript]: https://github.com/microsoft/TypeScript/
[spectron]: https://github.com/electron-userland/spectron
[vue-tsc]: https://github.com/johnsoncodehk/vue-tsc
[eslint-plugin-vue]: https://github.com/vuejs/eslint-plugin-vue
[cawa-93-github]: https://github.com/cawa-93/
[cawa-93-sponsor]: https://www.patreon.com/Kozack/
