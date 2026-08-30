import path from 'node:path'
import { fileURLToPath } from 'node:url'
import solid from 'vite-plugin-solid'
import { defineConfig } from 'vitest/config'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [solid({ ssr: true })],
  resolve: {
    alias: {
      '~/': `${path.resolve(__dirname, 'src')}/`,
    },
  },
  test: {
    name: 'solid-ssr',
    environment: 'node',
    include: ['tests/**/*.ssr.test.tsx'],
  },
})
