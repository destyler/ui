import { playwright } from '@vitest/browser-playwright'
import { configDefaults, defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      name: 'solid',
      globals: true,
      setupFiles: ['./src/setup-test.ts'],
      exclude: [
        ...configDefaults.exclude,
        '**/*.ssr.test.tsx',
        'dist/**',
        'storybook-static/**',
      ],
      browser: {
        enabled: true,
        provider: playwright(),
        instances: [
          { browser: 'chromium' },
        ],
        viewport: {
          width: 1920,
          height: 1080,
        },
      },
    },
  }),
)
