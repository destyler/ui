import { playwright } from '@vitest/browser-playwright'
import { configDefaults, defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      name: 'vue',
      exclude: [...configDefaults.exclude, '**/*.ssr.test.ts', '**/*.unit.test.ts'],
      environment: 'happy-dom',
      browser: {
        // Preserve the case-insensitive substring locators used before Vitest 5.
        locators: { exact: false },
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
