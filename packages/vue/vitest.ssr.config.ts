import { defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      name: 'vue-ssr',
      environment: 'node',
      browser: { enabled: false },
      include: ['src/**/*.ssr.test.ts'],
    },
  }),
)
