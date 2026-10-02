import { fileURLToPath } from 'node:url'
import { playwright } from '@vitest/browser-playwright'
import { defineConfig } from 'vitest/config'

export function browserSmokeConfig(framework: string, root: URL) {
  return defineConfig({
    root: fileURLToPath(root),
    test: {
      name: `${framework}-smoke`,
      include: ['src/**/*.browser-smoke.{ts,tsx}'],
      testTimeout: 30_000,
      browser: {
        enabled: true,
        headless: true,
        provider: playwright(),
        instances: [
          { browser: 'chromium' },
          { browser: 'firefox' },
          { browser: 'webkit' },
        ],
        screenshotFailures: true,
        viewport: { width: 1280, height: 720 },
      },
    },
  })
}
