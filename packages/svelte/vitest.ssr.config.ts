import { defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      name: 'svelte-ssr',
      environment: 'node',
      include: ['**/*.ssr.test.ts'],
    },
  }),
)
