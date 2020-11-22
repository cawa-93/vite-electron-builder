# Overwrite

> Vite+Electron = 🔥

This template uses [Vite](https://github.com/vitejs/vite/) as bundler and [Electron builder](https://www.electron.build/) as compiler.

This is a minimalist template created mainly for my personal needs and is designed for a **simple and flexible start of your project**.

## Status
- ✅ Building main and renderer endpoints in production mode -- works great.
- ✅ Development mode with hot reload for renderer endpoint -- works great.
- ⚠ Development mode for main and preload endpoints -- work fine, but it is possible to reboot the backend faster ([vite#972](https://github.com/vitejs/vite/issues/972))
- ✅ Compile the app with electron builder in CD -- work.
- ⏳ Code signing -- planned. 
- ⚠ Typechecking in `.ts` and `.vue` files -- works but needs improvement. I want to integrate it with [reviewdog](https://github.com/reviewdog/reviewdog). Typechecking use [@vuedx/typecheck](https://github.com/znck/vue-developer-experience/tree/master/packages/typecheck)
- ⚠ Linting -- work fine, but need review the configuration files and refactor its. It may also intersect somewhat with Typechecking.
- ⏳ Add Vue dev tools -- planned.
- ⏳ Refactor and simplify the set of npm scripts -- planned.
