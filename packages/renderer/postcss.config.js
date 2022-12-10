/* eslint-disable no-undef */
module.exports = {
  plugins: {
    autoprefixer: {},
    tailwindcss: {
      content: ['./src/**/*.{js,jsx,ts,tsx}', 'index.html'],
      darkMode: 'media',
      mode: 'jit',
    },
  },
};
