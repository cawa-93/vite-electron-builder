import electronUpdater, {type AppUpdater} from 'electron-updater';

export function getAutoUpdater(): AppUpdater {
  // Using destructuring to access autoUpdater due to the CommonJS module of 'electron-updater'.
  // It is a workaround for ESM compatibility issues, see https://github.com/electron-userland/electron-builder/issues/7976.
  const {autoUpdater} = electronUpdater;
  return autoUpdater;
}

export async function runAutoUpdater() {
  const updater = getAutoUpdater();
  try {
    updater.fullChangelog = true;
    return await updater.checkForUpdatesAndNotify();
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('No published versions')) {
        return null;
      }
    }

    throw error;
  }
}
