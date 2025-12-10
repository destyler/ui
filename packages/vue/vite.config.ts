import path from 'node:path'
import { fileURLToPath } from 'node:url'
import Vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  resolve: {
    alias: {
      '~/': `${path.resolve(__dirname, 'src')}/`,
    },
  },
  plugins: [
    Vue(),
  ],
  optimizeDeps: {
    include: [
      '@destyler/collapsible',
      '@destyler/collection',
      '@destyler/xstate',
      '@destyler/i18n',
      '@destyler/dom',
    ],
  },
})
