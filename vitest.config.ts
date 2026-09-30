import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    projects: [
      'packages/*',
      'packages/react/vitest.ssr.config.ts',
      'packages/vue/vitest.ssr.config.ts',
      'packages/solid/vitest.ssr.config.ts',
      'packages/svelte/vitest.ssr.config.ts',
    ],
  },
})
