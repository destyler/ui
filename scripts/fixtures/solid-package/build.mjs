import assert from 'node:assert/strict'
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

// An ordinary JavaScript consumer must use the precompiled import/default
// exports. No Solid compiler or solid resolution condition is involved.
await build({
  configFile: false,
  resolve: { conditions: ['browser'] },
  plugins: [{
    name: 'check-import-exports',
    generateBundle() {
      const modules = [...this.getModuleIds()].filter(id => id.includes('/node_modules/@destyler-ui/solid/'))
      assert.ok(modules.length >= 57, 'The default consumer must include every public entry')
      assert.ok(modules.every(id => id.endsWith('.js')), 'The default consumer must resolve compiled JavaScript')
    },
  }],
  build: { outDir: 'import-client', minify: false, lib: { entry: 'import-client.mjs', formats: ['es'], fileName: 'index' } },
})
