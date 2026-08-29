import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { defineConfig } from 'vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  resolve: {
    alias: {
      $lib: path.resolve(__dirname, 'src/lib'),
    },
  },
  plugins: [svelte()],
  optimizeDeps: {
    exclude: ['@destyler/svelte'],
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
