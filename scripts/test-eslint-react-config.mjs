import assert from 'node:assert/strict'
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
