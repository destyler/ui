import { defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      name: 'react-unit',
      environment: 'happy-dom',
      browser: { enabled: false },
      include: ['src/**/*.unit.test.tsx'],
    },
  }),
)
