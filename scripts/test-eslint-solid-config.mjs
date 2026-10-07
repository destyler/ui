import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { test } from 'node:test'
import { fileURLToPath } from 'node:url'
import { ESLint } from 'eslint'

const cwd = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const eslint = new ESLint({ cwd })
const solidPath = 'packages/solid/src/components/checkbox/hooks/use-checkbox.ts'

async function lint(source, filePath = solidPath) {
  const [result] = await eslint.lintText(source, { filePath })
  assert.equal(result.fatalErrorCount, 0, 'The rule guard must not stop at a parser error')
  return result.messages
}

function count(messages, ruleId) {
  return messages.filter(message => message.ruleId === ruleId).length
}

test('Solid rules resolve for package TS/TSX/JS/JSX without replacing the TS parser', async () => {
  for (const filePath of [solidPath, 'packages/solid/src/components/checkbox/components/Group.tsx', 'packages/solid/probe.js', 'packages/solid/probe.jsx']) {
    const config = await eslint.calculateConfigForFile(filePath)
    assert.equal(config.rules['solid/no-react-deps']?.[0], 2, filePath)
    assert.equal(config.rules['solid/style-prop']?.[0], 2, filePath)
    assert.ok(config.plugins.solid, filePath)
    if (/\.tsx?$/.test(filePath))
      assert.equal(config.languageOptions.parser.meta.name, 'typescript-eslint/parser', filePath)
  }
})

test('the Solid memo and import rules execute their negative/positive controls', async () => {
  const badMemo = await lint(`import { createMemo } from 'solid-js'\nexport const useProbe = () => createMemo(() => 1, [])\n`)
  const goodMemo = await lint(`import { createMemo } from 'solid-js'\nexport const useProbe = () => createMemo(() => 1)\n`)
  assert.equal(count(badMemo, 'solid/no-react-deps'), 1)
  assert.equal(count(goodMemo, 'solid/no-react-deps'), 0)
  const badImport = await lint(`import { Index } from 'solid-js/web'\nexport { Index }\n`)
  const goodImport = await lint(`import { Index } from 'solid-js'\nexport { Index }\n`)
  assert.equal(count(badImport, 'solid/imports'), 1)
  assert.equal(count(goodImport, 'solid/imports'), 0)
})

test('For rendering passes while a map-to-JSX fixture triggers the real rule', async () => {
  const filePath = 'packages/solid/tests/config-probe.tsx'
  const bad = await lint(`export const Probe = () => <div>{[1, 2].map(value => <span>{value}</span>)}</div>\n`, filePath)
  const good = await lint(`import { For } from 'solid-js'\nexport const Probe = () => <div><For each={[1, 2]}>{value => <span>{value}</span>}</For></div>\n`, filePath)
  assert.equal(count(bad, 'solid/prefer-for'), 1)
  assert.equal(count(good, 'solid/prefer-for'), 0)
})

test('Intl style exceptions are precise and do not permit actual DOM style strings', async () => {
  for (const name of ['NumberWithCurrency', 'NumberWithPercentage', 'NumberWithUnit']) {
    const filePath = `packages/solid/src/providers/format/examples/${name}.tsx`
    const source = await readFile(resolve(cwd, filePath), 'utf8')
    assert.equal(count(await lint(source, filePath), 'solid/style-prop'), 0, name)
    const badDom = `${source}\nexport const StyleProbe = () => <div style="color:red" />\n`
    const goodDom = `${source}\nexport const StyleProbe = () => <div style={{ color: 'red' }} />\n`
    assert.equal(count(await lint(badDom, filePath), 'solid/style-prop'), 1, name)
    assert.equal(count(await lint(goodDom, filePath), 'solid/style-prop'), 0, name)
  }
})

test('Solid rules stay out of React, Vue, Svelte and docs source', async () => {
  for (const filePath of ['packages/react/src/factory/index.ts', 'packages/vue/src/factory/index.ts', 'packages/svelte/src/lib/index.ts', 'docs/src/probe.tsx']) {
    const config = await eslint.calculateConfigForFile(filePath)
    assert.equal(config.rules['solid/no-react-deps'], undefined, filePath)
    const messages = await lint(`import { createMemo } from 'solid-js'\nexport const useProbe = () => createMemo(() => 1, [])\n`, filePath)
    assert.equal(count(messages, 'solid/no-react-deps'), 0, filePath)
  }
})
