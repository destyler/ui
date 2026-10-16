import assert from 'node:assert/strict'
import { test } from 'node:test'
import solid from '@destyler-ui/eslint-solid'
import react from '@eslint-react/eslint-plugin'
import { ESLint } from 'eslint'

const rule = 'react/set-state-in-effect'
const fixtures = [
  ['no-argument setter', 'useEffect(() => { setState() }, [])', 0, 1],
  ['direct state update', 'useEffect(() => { setState(1) }, [])', 1, 1],
  ['ref value', 'useEffect(() => { setState(ref.current) }, [])', 0, 1],
  ['ref guard', 'useEffect(() => { if (ref.current) setState(1) }, [])', 0, 1],
  ['ref early return', 'useEffect(() => { if (!ref.current) return; setState(1) }, [])', 0, 1],
  ['direct helper', 'function sync() { setState(1) }; useEffect(sync, [])', 1, 1],
  ['ref helper argument', 'function sync(value: number) { setState(value) }; useEffect(() => { sync(ref.current) }, [])', 0, 1],
  ['ref helper callback', 'function sync() { setState(ref.current) }; useEffect(sync, [])', 0, 1],
  ['ref helper call', 'function sync() { setState(ref.current) }; useEffect(() => { sync() }, [])', 0, 1],
  ['useCallback helper', 'const sync = useCallback(() => { setState(ref.current) }, []); useEffect(sync, [])', 0, 1],
  ['useCallback setter', 'const sync = useCallback(setState, []); useEffect(sync, [])', 1, 1],
  ['useMemo setter', 'const sync = useMemo(() => setState, []); useEffect(sync, [])', 1, 1],
  ['immediate function', 'useEffect(() => { (() => { setState(ref.current) })() }, [])', 0, 1],
  ['tuple setter', 'const tuple = useState(0); useEffect(() => { tuple[1](ref.current) }, [])', 0, 1],
  ['tuple at setter', 'const tuple = useState(0); useEffect(() => { tuple.at(1)(ref.current) }, [])', 0, 1],
  ['direct setter callback', 'useEffect(setState, [])', 1, 1],
  ['layout effect', 'useLayoutEffect(() => { setState(ref.current) }, [])', 0, 1],
  ['custom effect', 'useCustomEffect(() => { setState(ref.current) }, [])', 0, 1],
  ['cleanup callback', 'useEffect(() => () => { setState(ref.current) }, [])', 0, 0],
  ['promise callback', 'useEffect(() => { Promise.resolve().then(() => { setState(ref.current) }) }, [])', 0, 0],
  ['async helper', 'async function sync() { setState(ref.current) }; useEffect(() => { void sync() }, [])', 0, 0],
  ['timer callback', 'useEffect(() => { setTimeout(() => { setState(ref.current) }, 0) }, [])', 0, 0],
  ['unrelated setter parameter', 'function sync(setState: (value: number) => void) { setState(1) }; useEffect(() => { sync(console.log) }, [])', 0, 0],
]

function engine(options) {
  return new ESLint({
    overrideConfigFile: true,
    overrideConfig: [{
      files: ['**/*.tsx'],
      languageOptions: { parser: solid.languageOptions.parser },
      plugins: { react },
      rules: { [rule]: options === undefined ? 'warn' : ['warn', options] },
    }],
  })
}

const upstream = engine()
const explicitDefault = engine({ allowRefDerived: true })
const reviewed = engine({ allowRefDerived: false, allowEmptySetter: false })

async function diagnostics(eslint, body) {
  const source = `import { useState, useRef, useEffect, useLayoutEffect, useCallback, useMemo } from 'react'
function useCustomEffect(effect: () => void, deps: unknown[]) { useEffect(effect, deps) }
export function useProbe() {
  const [state, setState] = useState(0)
  const ref = useRef(1)
  ${body}
  return state
}
`
  const [result] = await eslint.lintText(source, { filePath: 'packages/react/effect-policy.tsx' })
  assert.equal(result.fatalErrorCount, 0)
  assert.ok(result.messages.every(message => message.ruleId === rule && message.severity === 1), JSON.stringify(result.messages))
  return result.messages.length
}

for (const [name, source, expectedDefault, expectedReviewed] of fixtures) {
  test(`${name}: the patch preserves upstream defaults and the reviewed warning policy`, async () => {
    assert.equal(await diagnostics(upstream, source), expectedDefault, 'unchanged upstream default')
    assert.equal(await diagnostics(explicitDefault, source), expectedDefault, 'explicit upstream default')
    assert.equal(await diagnostics(reviewed, source), expectedReviewed, 'reviewed strict effect policy')
  })
}
