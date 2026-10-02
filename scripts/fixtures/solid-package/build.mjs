import { build } from 'vite'
import solid from 'vite-plugin-solid'

for (const ssr of [true, false]) {
  await build({
    configFile: false,
    plugins: [solid({ ssr: true })],
    resolve: { conditions: ['solid', ...(ssr ? [] : ['browser'])] },
    ssr: { noExternal: ['@destyler-ui/solid'], resolve: { conditions: ['solid'] } },
    build: { ssr: ssr ? 'server.tsx' : false, outDir: ssr ? 'server' : 'client', minify: false, lib: ssr ? undefined : { entry: 'client.tsx', formats: ['es'], fileName: 'index' }, rollupOptions: { output: { entryFileNames: 'index.js' } } },
  })
}
