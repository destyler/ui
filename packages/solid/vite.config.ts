import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  resolve: {
    alias: [
      {
        find: '~/',
        replacement: `${path.resolve(__dirname, 'src')}/`,
      },
      {
        find: '@destyler-ui/solid/environment',
        replacement: path.resolve(__dirname, 'src/providers/environment/index.ts'),
      },
      {
        find: '@destyler-ui/solid/client-only',
        replacement: path.resolve(__dirname, 'src/providers/client-only/index.ts'),
      },
      {
        find: '@destyler-ui/solid/focus-trap',
        replacement: path.resolve(__dirname, 'src/providers/focus-trap/index.ts'),
      },
      {
        find: '@destyler-ui/solid/format',
        replacement: path.resolve(__dirname, 'src/providers/format/index.ts'),
      },
      {
        find: '@destyler-ui/solid/frame',
        replacement: path.resolve(__dirname, 'src/providers/frame/index.ts'),
      },
      {
        find: '@destyler-ui/solid/highlight',
        replacement: path.resolve(__dirname, 'src/providers/highlight/index.ts'),
      },
      {
        find: '@destyler-ui/solid/locale',
        replacement: path.resolve(__dirname, 'src/providers/locale/index.ts'),
      },
      {
        find: '@destyler-ui/solid/anatomy',
        replacement: path.resolve(__dirname, 'src/anatomy.ts'),
      },
      {
        find: '@destyler-ui/solid/collection',
        replacement: path.resolve(__dirname, 'src/utils/collection.ts'),
      },
      {
        find: '@destyler-ui/solid/factory',
        replacement: path.resolve(__dirname, 'src/factory/index.tsx'),
      },
      {
        find: /^@destyler-ui\/solid\/(.+)$/,
        replacement: `${path.resolve(__dirname, 'src/components')}/$1/index.ts`,
      },
      {
        find: '@destyler-ui/solid',
        replacement: path.resolve(__dirname, 'src/index.ts'),
      },
    ],
  },
  plugins: [solid()],
  optimizeDeps: {
    include: [
      '@destyler/collapsible',
      '@destyler/collection',
      '@destyler/types',
      '@destyler/xstate',
      '@destyler/i18n',
      '@destyler/dom',
    ],
  },
})
