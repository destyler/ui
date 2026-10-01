import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { playwright } from '@vitest/browser-playwright'
import { configDefaults, defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config'

const rawTraceEnabled = process.env.HOVER_CARD_RAW_TRACE === '1'

export default mergeConfig(
  viteConfig,
  defineConfig({
    define: { __HOVER_CARD_RAW_TRACE__: JSON.stringify(rawTraceEnabled) },
    resolve: {
      alias: rawTraceEnabled
        ? [{
            find: /^~\/hooks\/use-machine$/,
            replacement: path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'src/hooks/test/diagnostics/use-captured-machine.ts'),
          }]
        : [],
    },
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
