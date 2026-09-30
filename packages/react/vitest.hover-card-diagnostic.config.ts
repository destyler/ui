import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { playwright } from '@vitest/browser-playwright'
import { defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config'

const dirname = path.dirname(fileURLToPath(import.meta.url))

// Explicit opt-in: this four-case observation does not join the default suite.
export default mergeConfig(viteConfig, defineConfig({
  resolve: {
    alias: [{
      find: '~/hooks/use-machine',
      replacement: path.resolve(dirname, 'src/hooks/test/diagnostics/use-observed-machine.ts'),
    }],
  },
  test: {
    name: 'hover-card-diagnostic',
    root: dirname,
    include: ['src/hooks/test/diagnostics/hover-card-predecessor.probe.tsx'],
    fileParallelism: false,
    retry: 0,
    browser: {
      enabled: true,
      provider: playwright(),
      instances: [{ browser: 'chromium' }],
      viewport: { width: 1920, height: 1080 },
    },
  },
}))
