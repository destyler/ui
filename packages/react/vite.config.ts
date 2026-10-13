import path from 'node:path'
import { fileURLToPath } from 'node:url'
import babel from '@rolldown/plugin-babel'
import React, { reactCompilerPreset } from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  resolve: {
    alias: {
      '~/': `${path.resolve(__dirname, 'src')}/`,
    },
  },
  plugins: [
    React(),
    babel({
      // Compile for the minimum supported peer; React 18 has no built-in
      // react/compiler-runtime. The compatibility runtime ships as a dependency.
      presets: [reactCompilerPreset({ target: '18' })],
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
