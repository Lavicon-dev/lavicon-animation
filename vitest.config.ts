import { defineConfig } from 'vitest/config';

// Fichier .ts : le paquet est "type": "module" et Rollup est en .cjs.
export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    restoreMocks: true,
    unstubGlobals: true,
  },
});
