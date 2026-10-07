import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'
import { ESLint } from 'eslint'
import ts from 'typescript'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const eslint = new ESLint({ cwd: root })
const astroPath = 'docs/src/components/LintContract.astro'

test('Astro TypeScript frontmatter uses the actual Astro parser and processor', async () => {
  const config = await eslint.calculateConfigForFile(astroPath)
  assert.equal(config?.languageOptions.parser.meta.name, 'astro-eslint-parser')
  assert.equal(config?.processor.meta.name, 'astro/client-side-ts')
  const results = await eslint.lintText(`---
const title: string = 'Title'
---
<h1>{title}</h1>
`, { filePath: astroPath })
  assert.deepEqual(results.flatMap(result => result.messages), [])
})

test('conflicting set directives are rejected by a live Astro rule', async () => {
  const results = await eslint.lintText(`---
const value: string = 'Content'
---
<div set:html={value} set:text={value} />
`, { filePath: astroPath })
  const messages = results.flatMap(result => result.messages)
  assert.equal(messages.filter(message => message.ruleId === 'astro/no-conflict-set-directives' && message.severity === 2).length, 2)
  assert.equal(messages.some(message => message.fatal), false)
})

test('client-side TypeScript is processed and checked, with original line mapping', async () => {
  const results = await eslint.lintText(`<div />
<script>
const label: string = 'Hello'
document.body.setAttribute('data-label', label)
debugger
</script>
`, { filePath: astroPath })
  const messages = results.flatMap(result => result.messages)
  assert.equal(messages.some(message => message.fatal), false)
  assert.deepEqual(messages.map(({ ruleId, severity, line }) => ({ ruleId, severity, line })), [
    { ruleId: 'no-debugger', severity: 2, line: 5 },
  ])
})

test('ordinary docs TypeScript keeps its TypeScript parser', async () => {
  const config = await eslint.calculateConfigForFile('docs/scripts/lint-contract.ts')
  assert.equal(config.languageOptions.parser.meta.name, 'typescript-eslint/parser')
  const results = await eslint.lintText('export const value: number = 1\n', { filePath: 'docs/scripts/lint-contract.ts' })
  assert.deepEqual(results.flatMap(result => result.messages), [])
})

test('Astro parsing does not spread into framework component files', async () => {
  for (const file of ['packages/vue/src/components/field/components/Input.vue', 'packages/svelte/src/lib/components/tabs/components/Root.svelte']) {
    const config = await eslint.calculateConfigForFile(file)
    assert.notEqual(config?.languageOptions?.parser?.meta?.name, 'astro-eslint-parser')
    assert.notEqual(config?.processor?.meta?.name, 'astro/client-side-ts')
  }
})

function projectNames(source) {
  const file = ts.createSourceFile('vitest.config.ts', source, ts.ScriptTarget.Latest, true)
  const exported = file.statements.find(ts.isExportAssignment)
  assert.ok(exported && ts.isCallExpression(exported.expression))
  const config = exported.expression.arguments[0]
  assert.ok(ts.isObjectLiteralExpression(config))
  const property = (object, name) => object.properties.find(node => ts.isPropertyAssignment(node) && node.name.getText(file) === name)?.initializer
  const testConfig = property(config, 'test')
  assert.ok(testConfig && ts.isObjectLiteralExpression(testConfig))
  const projects = property(testConfig, 'projects')
  assert.ok(projects && ts.isArrayLiteralExpression(projects))
  return projects.elements.map((node) => {
    assert.ok(ts.isStringLiteral(node))
    return node.text
  })
}

function assertAggregateProjects(projects) {
  for (const required of [
    'packages/*',
    'packages/react/vitest.ssr.config.ts',
    'packages/vue/vitest.ssr.config.ts',
    'packages/vue/vitest.unit.config.ts',
    'packages/solid/vitest.ssr.config.ts',
    'packages/svelte/vitest.ssr.config.ts',
    'docs/vitest.config.mts',
  ]) assert.ok(projects.includes(required), `Missing aggregate test project: ${required}`)
}

test('aggregate CI keeps every existing project and the native Astro client gate', async () => {
  const source = await fs.readFile(path.join(root, 'vitest.config.ts'), 'utf8')
  const projects = projectNames(source)
  assertAggregateProjects(projects)
  assert.throws(() => assertAggregateProjects(projects.filter(name => name !== 'docs/vitest.config.mts')), /Missing aggregate test project: docs/)
  const manifest = JSON.parse(await fs.readFile(path.join(root, 'package.json'), 'utf8'))
  assert.equal(manifest.scripts['test:ci'], 'pnpm run svelte:sync && vitest run --browser.headless --no-file-parallelism')
})
