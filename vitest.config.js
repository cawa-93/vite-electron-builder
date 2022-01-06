import { defineConfig } from 'vite';

/**
 * Config for global end-to-end tests
 * placed in project root tests folder
 */
export default defineConfig({
  test: {
    /**
     * By default, vitest search test files in all packages.
     * For e2e tests have sense search only is project root tests folder
     */
    include: ['./tests/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
  },
});
