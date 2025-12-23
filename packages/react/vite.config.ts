import path from 'node:path'
import { fileURLToPath } from 'node:url'
import React from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  resolve: {
    alias: {
      '~/': `${path.resolve(__dirname, 'src')}/`,
    },
  },
  plugins: [
    React({
      babel: {
        plugins: ['babel-plugin-react-compiler'],
      },
    }),
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
