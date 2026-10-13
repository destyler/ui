import { playwright } from '@vitest/browser-playwright'
import { defineConfig } from 'vitest/config'
import { astroClientContracts } from './test/client-script-loader.mjs'

export default defineConfig({
  plugins: [astroClientContracts()],
  test: {
    name: 'astro-docs',
    include: ['test/**/*.browser.test.ts'],
    browser: {
      // Preserve the case-insensitive substring locators used before Vitest 5.
      locators: { exact: false },
      enabled: true,
      provider: playwright(),
      instances: [{ browser: 'chromium' }],
    },
  },
})
