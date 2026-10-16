import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { test } from 'node:test'
import { fileURLToPath } from 'node:url'
import { ESLint } from 'eslint'

const cwd = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const eslint = new ESLint({ cwd })
const reactPath = 'packages/react/src/components/field/hooks/use-field.ts'
const hooksRule = 'react-hooks/rules-of-hooks'

async function lint(source, filePath = reactPath) {
  const [result] = await eslint.lintText(source, { filePath })
  assert.equal(result.fatalErrorCount, 0, 'The guard must execute rules, not stop at a parser error')
  return result.messages
}

test('the React preset is resolved and rules apply to real package source', async () => {
  for (const filePath of [reactPath, 'packages/react/src/components/field/components/Root.tsx', 'packages/react/probe.js', 'packages/react/probe.jsx']) {
    const config = await eslint.calculateConfigForFile(filePath)
    assert.equal(config.rules[hooksRule]?.[0], 2, filePath)
    assert.ok(config.plugins['react-hooks'], filePath)
    if (/\.tsx?$/.test(filePath))
      assert.equal(config.languageOptions.parser.meta.name, 'typescript-eslint/parser', filePath)
  }
})

test('conditional hooks fail and unconditional hooks pass the actual rule', async () => {
  const bad = await lint(`import { useId } from 'react'\nexport function useProbe(id?: string) { return id ?? useId() }\n`)
  assert.equal(bad.filter(message => message.ruleId === hooksRule).length, 1)
  const good = await lint(`import { useId } from 'react'\nexport function useProbe(id?: string) { const generated = useId(); return id ?? generated }\n`)
  assert.equal(good.filter(message => message.ruleId === hooksRule).length, 0)
})

test('React-specific rules execute beyond the hooks plugin', async () => {
  const bad = await lint(`import type React from 'react'\nexport type Props = React.ComponentProps<'div'>\n`)
  assert.equal(bad.filter(message => message.ruleId === 'react/prefer-namespace-import').length, 1)
  const good = await lint(`import type * as React from 'react'\nexport type Props = React.ComponentProps<'div'>\n`)
  assert.equal(good.filter(message => message.ruleId === 'react/prefer-namespace-import').length, 0)
})

test('React rules remain scoped away from other framework TypeScript and JSX', async () => {
  for (const filePath of ['packages/solid/src/factory.tsx', 'packages/vue/src/factory/index.ts', 'packages/svelte/src/lib/index.ts', 'docs/src/probe.tsx']) {
    const config = await eslint.calculateConfigForFile(filePath)
    assert.equal(config.rules[hooksRule], undefined, filePath)
    assert.equal(config.languageOptions.parser.meta.name, 'typescript-eslint/parser', filePath)
    const messages = await lint(`import { useId } from 'react'\nexport function useProbe(id?: string) { return id ?? useId() }\n`, filePath)
    assert.equal(messages.filter(message => message.ruleId === hooksRule).length, 0, filePath)
  }
})

// Independent pre-upgrade policy, not generated from the current configuration.
test('the effective React policy preserves every reviewed diagnostic and severity', async () => {
  const baseline = JSON.parse(await readFile(new URL('./fixtures/eslint-react-policy.json', import.meta.url), 'utf8')).rules
  const expected = {}
  for (const [oldName, options] of Object.entries(baseline)) {
    if (['react/jsx-uses-react', 'react/jsx-uses-vars'].includes(oldName))
      continue
    const renamed = {
      'react/jsx-key-before-spread': 'react/jsx-no-key-after-spread',
      'react-dom/no-namespace': 'react/jsx-no-namespace',
      'react/prefer-use-state-lazy-initialization': 'react/use-state',
      'react-hooks-extra/no-direct-set-state-in-use-effect': 'react/set-state-in-effect',
    }[oldName] ?? oldName.replace('react-dom/', 'react/dom-').replace('react-web-api/', 'react/web-api-')
    expected[renamed] = options
  }
  expected['react/use-state'] = [1, { enforceAssignment: false, enforceLazyInitialization: true, enforceSetterName: false }]
  expected['react/set-state-in-effect'] = [1, { allowRefDerived: false, allowEmptySetter: false }]
  for (const filePath of [reactPath, 'packages/react/probe.tsx', 'packages/react/probe.js', 'packages/react/probe.jsx']) {
    const config = await eslint.calculateConfigForFile(filePath)
    const actual = Object.fromEntries(Object.entries(config.rules).filter(([name]) => /^(?:react|react-hooks|react-refresh)\//u.test(name)))
    assert.deepEqual(actual, expected, filePath)
  }
})

test('missing effect dependencies and refresh exports remain warnings', async () => {
  const deps = await lint(`import { useEffect } from 'react'\nexport function useProbe(value: string) { useEffect(() => { console.log(value) }, []) }\n`)
  assert.deepEqual(deps.filter(message => message.ruleId === 'react-hooks/exhaustive-deps').map(message => message.severity), [1])
  const refresh = await lint(`export function useProbe() { return 1 }\nexport function Probe() { return <div /> }\n`, 'packages/react/probe.tsx')
  assert.deepEqual(refresh.filter(message => message.ruleId === 'react-refresh/only-export-components').map(message => message.severity), [1])
})

test('createRef errors remain in component render and Hooks, not external harnesses', async () => {
  for (const [body, expected] of [
    ['export function Probe() { const ref = createRef(); return <div ref={ref} /> }', 1],
    ['export function useProbe() { return createRef() }', 1],
    ['export function setupHarness() { return createRef() }', 0],
    ['export class Probe extends Component { ref = createRef(); render() { return <div ref={this.ref} /> } }', 0],
  ]) {
    const messages = await lint(`import { Component, createRef } from 'react'; ${body}`, 'packages/react/probe.tsx')
    assert.deepEqual(messages.filter(message => message.ruleId === 'react/no-create-ref').map(message => message.severity), Array.from({ length: expected }).fill(2), body)
  }
})
