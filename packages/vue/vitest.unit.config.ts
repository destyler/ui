import { defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      name: 'vue-unit',
      environment: 'happy-dom',
      browser: { enabled: false },
      include: ['src/**/*.unit.test.ts'],
    },
  }),
)
