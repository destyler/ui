import { playwright } from '@vitest/browser-playwright'
import { configDefaults, defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      name: 'react',
      environment: 'happy-dom',
      exclude: [...configDefaults.exclude, '**/*.ssr.test.tsx'],
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
