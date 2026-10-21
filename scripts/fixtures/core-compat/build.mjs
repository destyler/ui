import process from 'node:process'
import { build } from 'vite'

const framework = process.argv[2]
const plugins = framework === 'solid'
  ? [(await import('vite-plugin-solid')).default()]
  : framework === 'svelte' ? [(await import('@sveltejs/vite-plugin-svelte')).svelte()] : []
await build({
  configFile: false,
  plugins,
  define: { __VUE_OPTIONS_API__: true, __VUE_PROD_DEVTOOLS__: false, __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false },
  resolve: { conditions: ['browser', ...(framework === 'solid' ? ['solid'] : [])] },
  build: {
    outDir: 'client',
    minify: false,
    lib: { entry: `${framework}.${framework === 'solid' ? 'tsx' : 'mjs'}`, formats: ['es'], fileName: 'index' },
  },
})
