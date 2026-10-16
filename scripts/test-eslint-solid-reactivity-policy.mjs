import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, resolve } from 'node:path'
import { test } from 'node:test'
import { pathToFileURL } from 'node:url'

// Resolve every dependency from the isolated package, never an optional Antfu peer.
const requireSolid = createRequire(new URL('../tooling/eslint-solid/package.json', import.meta.url))
const { Linter } = requireSolid('eslint')
const parser = requireSolid('@typescript-eslint/parser')
const pluginManifestPath = requireSolid.resolve('eslint-plugin-solid/package.json')
const pluginManifest = JSON.parse(readFileSync(pluginManifestPath, 'utf8'))
const pluginDirectory = dirname(pluginManifestPath)
const subpaths = ['.', './configs/recommended', './configs/typescript', './configs/v2', './configs/v2-strict']
const variants = []

// These public entrypoints exercise all six independently bundled runtimes:
// the shared ESM chunk, CJS root, and four CJS preset bundles.
for (const subpath of subpaths) {
  const specifier = subpath === '.' ? 'eslint-plugin-solid' : `eslint-plugin-solid/${subpath.slice(2)}`
  const esm = (await import(pathToFileURL(resolve(pluginDirectory, pluginManifest.exports[subpath].import)).href)).default
  const cjs = requireSolid(specifier)
  variants.push(
    { name: `ESM ${subpath}`, plugin: subpath === '.' ? esm : esm.plugins.solid },
    { name: `CJS ${subpath}`, plugin: subpath === '.' ? cjs : cjs.plugins.solid },
  )
}

function lint(source, plugin, options) {
  const rule = options === undefined ? ['warn'] : ['warn', options]
  const messages = new Linter().verify(source, [{
    files: ['**/*.tsx'],
    languageOptions: {
      parser,
      parserOptions: { ecmaFeatures: { jsx: true } },
      sourceType: 'module',
    },
    plugins: { solid: plugin },
    rules: { 'solid/reactivity': rule },
  }], { filename: 'reactivity-probe.tsx' })
  assert.equal(messages.some(message => message.fatal), false, 'The probe must not stop at a parser error')
  assert.ok(messages.every(message => message.ruleId === 'solid/reactivity'), 'Unexpected non-reactivity diagnostics')
  return messages.map(({ messageId, message, severity, line, column, endLine, endColumn }) => ({
    messageId,
    message,
    severity,
    line,
    column,
    endLine,
    endColumn,
  }))
}

const wrap = body => `import { createEffect, createMemo } from 'solid-js'; function App() { const memo = createMemo(() => 1); ${body}; return <div/>; }`
const warning = ['untrackedReactive']
const cases = [
  { name: 'eager memo argument', source: wrap('useThing(memo())'), upstream: [], strict: warning },
  { name: 'nested eager machine argument', source: wrap('useMachine(machine(memo()), { context: memo })'), upstream: [], strict: warning },
  { name: 'aliased createMemo import eager argument', source: `import { createMemo as derive } from 'solid-js'; function App() { const memo = derive(() => 1); useThing(memo()); return <div/>; }`, upstream: [], strict: warning },
  { name: 'member hook eager argument', source: wrap('hooks.useThing(memo())'), upstream: [], strict: warning },
  { name: 'live accessor argument', source: wrap('useThing(memo)'), upstream: [], strict: [] },
  { name: 'deferred memo argument', source: wrap('useThing(() => memo())'), upstream: [], strict: [] },
  { name: 'eager argument within effect', source: wrap('createEffect(() => useThing(memo()))'), upstream: [], strict: [] },
  { name: 'directly created accessor argument', source: `import { createMemo } from 'solid-js'; function App() { useThing(createMemo(() => 1)); return <div/>; }`, upstream: [], strict: [] },
  { name: 'directly returned memo', source: `import { createMemo } from 'solid-js'; export function useValue() { return createMemo(() => 1); }`, upstream: [], strict: [] },
  { name: 'eager memo argument to ordinary function', source: wrap('consume(memo())'), upstream: warning, strict: warning },
  { name: 'eager signal argument to custom hook', source: `import { createSignal } from 'solid-js'; function App() { const [signal] = createSignal(1); useThing(signal()); return <div/>; }`, upstream: warning, strict: warning },
]

test('all public Solid exports expose a backward-compatible boolean opt-in policy', () => {
  assert.equal(pluginManifest.version, '0.18.1')
  for (const { name, plugin } of variants) {
    const rule = plugin.rules.reactivity
    assert.deepEqual(rule.meta.schema[0].properties.allowEagerMemoArguments, {
      description: 'Allow eager memo reads in custom reactive function arguments. Set false to retain conservative reactivity warnings.',
      type: 'boolean',
      default: true,
    }, name)
    assert.deepEqual(rule.defaultOptions, [{ customReactiveFunctions: [], allowEagerMemoArguments: true }], name)
    assert.throws(() => lint(cases[0].source, plugin, { allowEagerMemoArguments: 'false' }), undefined, name)
  }
})

for (const fixture of cases) {
  test(`Solid reactivity policy: ${fixture.name}`, () => {
    let reference
    for (const { name, plugin } of variants) {
      const omitted = lint(fixture.source, plugin)
      const explicitTrue = lint(fixture.source, plugin, { customReactiveFunctions: [], allowEagerMemoArguments: true })
      const strictFalse = lint(fixture.source, plugin, { customReactiveFunctions: [], allowEagerMemoArguments: false })
      assert.deepEqual(omitted.map(message => message.messageId), fixture.upstream, `${name}: default`)
      assert.deepEqual(explicitTrue, omitted, `${name}: explicit true must preserve the upstream default`)
      assert.deepEqual(strictFalse.map(message => message.messageId), fixture.strict, `${name}: strict false`)
      const current = { omitted, explicitTrue, strictFalse }
      if (reference)
        assert.deepEqual(current, reference, `${name}: public ESM/CJS exports must agree`)
      else
        reference = current
    }
  })
}
