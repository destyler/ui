import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    fileParallelism: false,
    reporters: ['default', 'junit'],
    outputFile: { junit: 'test/junit.xml' },
    projects: [
      {
        test: {
          name: 'smoke-policy',
          environment: 'node',
          include: ['utils/test/browser-smoke/axe-policy.test.ts'],
        },
      },
      'packages/react/vitest.smoke.config.ts',
      'packages/vue/vitest.smoke.config.ts',
      'packages/svelte/vitest.smoke.config.ts',
      'packages/solid/vitest.smoke.config.ts',
    ],
  },
})
