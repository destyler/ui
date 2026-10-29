import { createRequire } from 'node:module'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { defineConfig } from 'vitest/config'
import viteConfig from './vite.config'

const require = createRequire(import.meta.url)
const svelteRoot = path.dirname(require.resolve('svelte/package.json'))
const svelteClient = path.join(svelteRoot, 'src/index-client.js')
const svelteInternalClient = path.join(svelteRoot, 'src/internal/client/index.js')
const root = path.dirname(fileURLToPath(import.meta.url))

// Happy-dom executes this project through Vite's server transform, which would
// compile Svelte components without DOM listeners. Force the client runtime.
export default defineConfig({
  ...viteConfig,
  plugins: [
    svelte({
      dynamicCompileOptions() {
        return { generate: 'client' }
      },
    }),
  ],
  resolve: {
    dedupe: ['svelte'],
    alias: [
      { find: '$lib', replacement: path.resolve(root, 'src/lib') },
      { find: /^svelte$/, replacement: svelteClient },
      { find: 'svelte/internal/client', replacement: svelteInternalClient },
    ],
  },
  optimizeDeps: {
    exclude: ['svelte'],
  },
  ssr: {
    noExternal: ['svelte'],
    optimizeDeps: {
      exclude: ['svelte'],
    },
  },
  test: {
    name: 'svelte-unit',
    environment: 'happy-dom',
    browser: { enabled: false },
    include: ['src/**/*.unit.test.ts'],
  },
})
