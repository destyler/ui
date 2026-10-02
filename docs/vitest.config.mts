import { playwright } from '@vitest/browser-playwright'
import { defineConfig } from 'vitest/config'
import { astroClientContracts } from './test/client-script-loader.mjs'

export default defineConfig({
  plugins: [astroClientContracts()],
  test: {
    name: 'astro-docs',
    include: ['test/**/*.browser.test.ts'],
    browser: {
      enabled: true,
      provider: playwright(),
      instances: [{ browser: 'chromium' }],
    },
  },
})
