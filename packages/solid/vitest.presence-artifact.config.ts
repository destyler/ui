import { playwright } from '@vitest/browser-playwright'
import { defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config'

// Explicitly selected artifact probe; *.probe.tsx is outside the normal suite.
export default mergeConfig(viteConfig, defineConfig({
  test: {
    name: 'solid-presence-artifact',
    globals: true,
    setupFiles: ['./src/setup-test.ts'],
    include: [
      'test-artifact/tour-presence.probe.tsx',
      'src/components/tour/test/tour.test.tsx',
    ],
    retry: 0,
    fileParallelism: false,
    browser: {
      enabled: true,
      headless: true,
      provider: playwright(),
      instances: [{ browser: 'chromium' }],
      viewport: { width: 1920, height: 1080 },
    },
  },
}))
