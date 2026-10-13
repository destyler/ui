import { rm } from 'node:fs/promises'
import { resolve } from 'node:path'
import { defineConfig } from 'tsdown'
import { build } from 'vite'
import solid from 'vite-plugin-solid'

const entry = [
  './src/index.ts',
  './src/anatomy.ts',
  './src/utils/collection.ts',
  './src/factory/index.tsx',
  './src/components/*/index.ts',
  './src/providers/*/index.ts',
]

let domFiles = new Set<string>()
let domBuild = Promise.resolve()

export default defineConfig({
  entry,
  platform: 'neutral',
  format: ['esm'],
  dts: true,
  clean: true,
  inputOptions: {
    transform: {
      jsx: 'preserve',
    },
  },
  outExtensions: () => ({ js: '.jsx' }),
  tsconfig: './tsconfig.build.json',
  hooks: {
    // Preserve JSX for consumers to compile for SSR and hydration.
    // Await the supported Solid 1 compiler for the import/default DOM build.
    'build:done': ({ options }) => {
      domBuild = domBuild.catch(() => undefined).then(async () => {
        const external = Object.keys({ ...options.pkg?.dependencies, ...options.pkg?.peerDependencies })
        const result = await build({
          configFile: false,
          root: options.cwd,
          plugins: [solid({ ssr: false, dev: false, hot: false, solid: { generate: 'dom', hydratable: false } })],
          resolve: { tsconfigPaths: true },
          build: {
            outDir: options.outDir,
            emptyOutDir: false,
            minify: false,
            target: options.target,
            sourcemap: options.sourcemap,
            lib: { entry: options.entry, formats: ['es'], fileName: (_, name) => `${name}.js` },
            rolldownOptions: {
              platform: 'neutral',
              tsconfig: options.tsconfig,
              transform: { jsx: 'preserve' },
              external: id => external.some(dependency => id === dependency || id.startsWith(`${dependency}/`)),
            },
          },
        })
        if (!Array.isArray(result) && !('output' in result))
          throw new Error('Expected a completed Vite build')

        const outputs = Array.isArray(result) ? result : [result]
        const nextDomFiles = new Set(outputs.flatMap(({ output }) => output.map(({ fileName }) => resolve(options.outDir, fileName))))
        // Only prune files owned by the preceding successful DOM build.
        await Promise.all([...domFiles].filter(file => !nextDomFiles.has(file)).map(file => rm(file, { force: true })))
        domFiles = nextDomFiles
      })
      return domBuild
    },
  },
})
