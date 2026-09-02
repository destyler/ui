import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    projects: [
      'packages/*',
      'packages/solid/vitest.ssr.config.ts',
      'packages/svelte/vitest.ssr.config.ts',
    ],
  },
})
