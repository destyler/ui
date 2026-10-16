import assert from 'node:assert/strict'
import { readdirSync, readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join, relative, resolve } from 'node:path'
import process from 'node:process'
import { fileURLToPath, pathToFileURL } from 'node:url'
import ts from 'typescript'
import { resolveConfig } from 'vite'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const library = join(root, 'src/lib')
process.chdir(root)

const configPath = join(root, 'tsconfig.json')
const config = ts.readConfigFile(configPath, ts.sys.readFile)
assert.equal(config.error, undefined)
assert.equal(config.config.extends, '$app/tsconfig', 'Extend the current Kit-generated configuration, never stale .svelte-kit output')

// Use the exact loader that svelte-package resolves, not a second direct dependency.
const packageRequire = createRequire(import.meta.resolve('@sveltejs/package/package.json'))
const { loadConfig } = await import(pathToFileURL(packageRequire.resolve('@sveltejs/load-config')).href)
const vite = await resolveConfig({ root, configFile: join(root, 'vite.config.ts') }, 'build')
const plugin = vite.plugins.find(plugin => plugin.name === 'vite-plugin-svelte:config')
assert.ok(plugin, 'The library must retain the plain Svelte Vite plugin')
assert.ok(!vite.plugins.some(plugin => plugin.name === 'vite-plugin-sveltekit-setup'), 'The library is not a Kit application')
assert.equal(plugin.api.options.alias?.$lib, library, 'Vite plugin options must retain the package alias')
assert.equal(vite.resolve.alias.find(alias => alias.find === '$lib')?.replacement, library)
const loaded = await loadConfig(root, { traverse: false })
assert.equal(loaded?.error, undefined)
assert.equal(loaded?.configSource, 'vite', 'Exercise the preferred Vite loader rather than a fallback')
assert.equal(loaded.config.alias?.$lib, library, 'svelte-package must receive the same alias through load-config')
assert.ok(loaded.config.preprocess, 'svelte-package must retain preprocessing')

const { default: storybook } = await import('../.storybook/main.ts')
const storybookVite = await storybook.viteFinal({ resolve: { alias: {} } })
assert.equal(storybookVite.resolve.alias.$lib, library, 'Storybook must resolve the same library source')

const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, root)
assert.deepEqual(parsed.errors, [], 'The generated Kit configuration must resolve from a cold sync')
// Preserve the measured pre-Kit-3 effective scope, rather than inheriting new JS defaults.
assert.equal(parsed.options.allowJs, false)
assert.equal(parsed.options.checkJs, false)
assert.equal(parsed.options.strict, true)
assert.equal(parsed.options.noUnusedLocals, true)
assert.ok(parsed.options.types.includes('$app/types'), 'Keep the generated $app/types in the explicit types list')
for (const [specifier, target] of [['$lib', 'index.ts'], ['$lib/utils/create-context', 'utils/create-context.ts']]) {
  const resolved = ts.resolveModuleName(specifier, join(root, 'tests/probe.ts'), parsed.options, ts.sys)
  assert.equal(resolved.resolvedModule?.resolvedFileName, join(library, target), `TypeScript must resolve ${specifier}`)
}
console.log('Svelte toolchain config checked: Vite, package loader, Storybook and TypeScript agree')

if (!process.argv.includes('--config-only')) {
  const dist = join(root, 'dist')
  const files = readdirSync(dist, { recursive: true }).filter(file => /\.(?:[cm]?js|ts|svelte)$/u.test(file))
  assert.ok(files.length > 0, 'Build the package before checking emitted aliases')
  const aliasPattern = /['"`](?:\$(?:lib|app)|#lib)[/'"`]/u
  for (const file of files) {
    const source = readFileSync(join(dist, file), 'utf8')
    assert.doesNotMatch(source, aliasPattern, `Source-only alias leaked into ${relative(root, join(dist, file))}`)
    assert.ok(!source.includes(library), `Absolute source path leaked into dist/${file}`)
  }
  console.log(`Svelte package aliases checked: ${files.length} JavaScript, Svelte and declaration files`)
}
