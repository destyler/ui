import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import { ESLint } from 'eslint'

const root = fileURLToPath(new URL('..', import.meta.url))
const requireVue = createRequire(new URL('../packages/vue/package.json', import.meta.url))
const { compileScript, compileTemplate, parse } = requireVue('vue/compiler-sfc')
const engine = new ESLint({ cwd: root })
const framePath = 'packages/vue/src/providers/frame/components/Frame.vue'
const examplePath = 'packages/vue/src/providers/frame/examples/Basic.vue'
const pilotPaths = [
  'packages/vue/src/providers/frame/components/Content.vue',
  framePath,
  examplePath,
  'packages/vue/src/providers/frame/examples/Script.vue',
  'packages/vue/src/providers/frame/examples/SrcDoc.vue',
]
const messages = async (source, filePath = framePath, lint = engine) => (await lint.lintText(source, { filePath }))[0].messages
const hasError = (reports, rule) => reports.some(report => report.ruleId === rule && report.severity === 2)

function compile(source) {
  const { descriptor, errors } = parse(source, { filename: 'Frame.vue' })
  assert.deepEqual(errors, [])
  const script = compileScript(descriptor, { id: 'frame-lint' })
  const template = compileTemplate({
    source: descriptor.template.content,
    filename: 'Frame.vue',
    id: 'frame-lint',
    compilerOptions: { bindingMetadata: script.bindings },
  })
  assert.deepEqual(template.errors, [])
  return template.code
}

for (const path of pilotPaths) {
  const config = await engine.calculateConfigForFile(path)
  assert.equal(config.languageOptions.parser.meta.name, 'vue-eslint-parser', path)
  assert(hasError(await messages('<template>\n  <div v-if="ok" v-else />\n</template>\n', path), 'vue/valid-v-else'), path)
  assert.equal(config.rules['vue/singleline-html-element-content-newline'][0], 1, path)
}
for (const path of [
  'packages/vue/src/providers/frame/examples/NotReviewed.vue',
  'packages/vue/src/components/tree/components/Root.vue',
  'packages/vue/src/components/combobox/components/Root.vue',
  'packages/vue/src/example.ts',
  'packages/svelte/src/lib/example.ts',
  'packages/react/src/example.tsx',
  'scripts/example.js',
]) {
  const config = await engine.calculateConfigForFile(path)
  assert.notEqual(config?.languageOptions?.parser?.meta?.name, 'vue-eslint-parser', path)
  assert(!config?.rules?.['vue/valid-v-else'], path)
  assert(!config?.languageOptions?.globals?.defineProps, path)
}
assert.equal((await engine.lintFiles(pilotPaths)).reduce((total, result) => total + result.errorCount, 0), 0)
console.log('Frame pilot: five real Vue rule scopes, retained warnings, no unintended parser scope')

const crossBlock = `<script lang="ts">\nexport const initial = 1\n</script>\n\n<script setup lang="ts">\nimport { ref } from 'vue'\n\nconst count = ref(initial)\n</script>\n\n<template>\n  <span>{{ count }}</span>\n</template>\n`
compile(crossBlock)
assert(!hasError(await messages(crossBlock), 'import/first'))
const unsafeFixer = new ESLint({
  cwd: root,
  overrideConfig: [{ files: pilotPaths, rules: { 'import/first': 'error' } }],
  fix: report => report.ruleId === 'import/first',
})
const [broken] = await unsafeFixer.lintText(crossBlock, { filePath: framePath })
assert(broken.output)
assert.throws(() => compile(broken.output), /script setup> cannot contain ES module exports/)
for (const path of ['packages/vue/src/example.js', 'packages/vue/src/example.ts', 'scripts/example.js', 'packages/react/src/example.ts']) {
  assert(hasError(await messages('const initial = 1\nimport { ref } from \'vue\'\nexport const count = ref(initial)\n', path), 'import/first'), path)
  assert(!hasError(await messages('import { ref } from \'vue\'\nconst initial = 1\nexport const count = ref(initial)\n', path), 'import/first'), path)
}
console.log('Import ordering: real compiler failure reproduced; ordinary JS/TS remain enforced')

const frame = readFileSync(new URL(`../${framePath}`, import.meta.url), 'utf8')
const render = compile(frame)
assert(render.includes('$setup["FrameContent"]'))
assert(render.includes('$setup.emit(\'mount\')'))
assert(render.includes('$setup.emit(\'unmount\')'))
const noComments = frame.replace(/^\/\/ eslint-disable-next-line .*\n/gm, '')
assert.equal(compile(noComments), render)
for (const rule of ['no-unused-vars', 'unused-imports/no-unused-vars', 'unused-imports/no-unused-imports']) {
  assert(!hasError(await messages(frame), rule), rule)
  assert(hasError(await messages(noComments), rule), rule)
}
const unused = frame.replace('defineExpose({ frameRef })', 'const genuinelyUnused = 1\n\ndefineExpose({ frameRef })')
assert(hasError(await messages(unused), 'no-unused-vars'))
assert(hasError(await messages(unused), 'unused-imports/no-unused-vars'))
const unusedImport = frame.replace('import { EnvironmentProvider }', 'import { computed } from \'vue\'\nimport { EnvironmentProvider }')
assert(hasError(await messages(unusedImport), 'unused-imports/no-unused-imports'))
assert(hasError(await messages(frame.replace('  <EnvironmentProvider', '<EnvironmentProvider')), 'vue/html-indent'))
const strictFrame = new ESLint({
  cwd: root,
  overrideConfig: [{ files: [framePath], rules: { 'vue/html-indent': ['error', 2], 'vue/no-reserved-component-names': ['error', { htmlElementCaseSensitive: false }] } }],
})
assert(hasError(await messages(frame, framePath, strictFrame), 'vue/html-indent'))
assert(hasError(await messages(frame, framePath, strictFrame), 'vue/no-reserved-component-names'))
for (const name of ['frame', 'div', 'iframe'])
  assert(hasError(await messages(frame.replace('name: \'Frame\'', `name: '${name}'`)), 'vue/no-reserved-component-names'), name)
console.log('Frame exceptions: actual compiler references retained; unused, indent, and native-name negative controls fail')

const basic = readFileSync(new URL(`../${examplePath}`, import.meta.url), 'utf8')
assert(!hasError(await messages(basic, examplePath), 'vue/no-useless-v-bind'))
assert(hasError(await messages(basic.replace(/\s*<!-- eslint-disable-next-line[^>]+-->/, ''), examplePath), 'vue/no-useless-v-bind'))
assert(hasError(await messages(basic.replace(':is="\'style\'"', ''), examplePath), 'vue/require-component-is'))
const unrelatedBinding = basic.replace('    <div style="padding: 40px">', '    <div :title="\'literal\'" style="padding: 40px">')
assert(hasError(await messages(unrelatedBinding, examplePath), 'vue/no-useless-v-bind'))
console.log('Static component compatibility: required-is and unrelated literal-binding checks stay active')
