import { svelte } from '@sveltejs/vite-plugin-svelte'
import { build } from 'vite'

for (const ssr of [true, false]) {
  await build({
    configFile: false,
    plugins: [svelte()],
    ssr: { noExternal: ['@destyler-ui/svelte', '@destyler/svelte'] },
    build: { ssr: ssr ? 'server.js' : false, outDir: ssr ? 'server' : 'client', minify: false, lib: ssr ? undefined : { entry: 'client.js', formats: ['es'], fileName: 'index' }, rollupOptions: { output: { entryFileNames: 'index.js' } } },
  })
}
