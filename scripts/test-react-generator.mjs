import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { createRequire } from 'node:module'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import process from 'node:process'
import { test } from 'node:test'
import { fileURLToPath } from 'node:url'
import { runInNewContext } from 'node:vm'
import ts from 'typescript'

const require = createRequire(import.meta.url)
const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')

test('the public React generator waits for rendering and keeps its assertions', async (t) => {
  const fixtureRoot = mkdtempSync(join(tmpdir(), 'destyler-react-generator-'))
  t.after(() => rmSync(fixtureRoot, { recursive: true, force: true }))
  const plopPackage = require.resolve('plop/package.json')
  const plopCli = resolve(dirname(plopPackage), require(plopPackage).bin)
  const generated = spawnSync(process.execPath, [
    plopCli,
    'react',
    'fixture-widget',
    '--dest',
    fixtureRoot,
  ], { cwd: repositoryRoot, encoding: 'utf8' })
  assert.equal(generated.status, 0, generated.stderr || generated.stdout)

  const fileName = join(fixtureRoot, 'packages/react/src/components/fixture-widget/test/fixture-widget.test.tsx')
  const source = readFileSync(fileName, 'utf8')
  const compiled = ts.transpileModule(source, {
    fileName,
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022 },
    reportDiagnostics: true,
  })
  assert.deepEqual(compiled.diagnostics, [])

  // Run the emitted test body with a deferred renderer. This checks the generated
  // callback's async contract without a browser or a real component implementation.
  const part = '[data-part="root"]'
  const anatomy = {}
  const basic = () => {}
  const root = () => {}
  const callbacks = new Map()
  const calls = []
  let rendered = false
  let releaseRender
  const modules = {
    'react/jsx-runtime': { jsx: type => ({ type }) },
    'vitest-browser-react': {
      render: async (element) => {
        assert.equal(element.type, basic)
        calls.push('render')
        await new Promise((resolve) => {
          releaseRender = resolve
        })
        rendered = true
        calls.push('rendered')
      },
    },
    'vitest': {
      describe: (_name, callback) => callback(),
      it: {
        each: values => (name, callback) => {
          for (const value of values)
            callbacks.set(name.replace('%s', value), () => callback(value))
        },
      },
      expect: value => ({
        toBeInTheDocument: () => {
          calls.push('part assertion')
          assert.equal(value, part)
        },
        toBeDefined: () => {
          calls.push('export assertion')
          assert.equal(value, root)
        },
      }),
    },
    '../../../../../../utils/test': {
      getParts: (value) => {
        assert.equal(value, anatomy)
        return [part]
      },
      getExports: (value) => {
        assert.equal(value, anatomy)
        return ['Root']
      },
    },
    '../examples/Basic': { Basic: basic },
    '../index': { FixtureWidget: { Root: root }, fixtureWidgetAnatomy: anatomy },
  }
  runInNewContext(compiled.outputText, {
    exports: {},
    require: (name) => {
      assert.ok(Object.hasOwn(modules, name), `Unexpected generated import: ${name}`)
      return modules[name]
    },
    document: {
      querySelector: (selector) => {
        assert.equal(rendered, true, 'The generated test queried the DOM before render settled')
        assert.equal(selector, part)
        calls.push('query')
        return part
      },
    },
  }, { filename: fileName })

  assert.equal(callbacks.size, 2, 'Keep both generated part and export tests')
  const pending = callbacks.get(`should render part ${part}`)()
  assert.equal(typeof pending?.then, 'function', 'The generated callback must return its render promise')
  assert.deepEqual(calls, ['render'], 'Assertions must wait for render to finish')
  releaseRender()
  await pending
  assert.deepEqual(calls, ['render', 'rendered', 'query', 'part assertion'])

  await callbacks.get('should export Root')()
  assert.deepEqual(calls, ['render', 'rendered', 'query', 'part assertion', 'export assertion'])
})
