import { fileURLToPath } from 'node:url'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

/** @type {import('@sveltejs/vite-plugin-svelte').SvelteConfig & { alias: Record<string, string> }} */
const config = {
  preprocess: vitePreprocess(),
  // svelte-package uses this extension to normalize library imports in its output.
  alias: {
    $lib: fileURLToPath(new URL('./src/lib', import.meta.url)),
  },
}

export default config
