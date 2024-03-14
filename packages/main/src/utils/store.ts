import ElectronStore from 'electron-store';

const store = new ElectronStore({
  accessPropertiesByDotNotation: false,
  defaults: {
    'main.window.bounds': undefined, // browserWindow.getBounds(), ex: { x: 25, y: 38, width: 800, height: 600 }
    'main.window.bounds-dev': undefined, // browserWindow.getBounds(), ex: { x: 25, y: 38, width: 800, height: 600 }
  },
});

export default store;
