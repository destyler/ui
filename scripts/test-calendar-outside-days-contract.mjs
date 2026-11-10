// Source-level wiring checks only: these do not render components or prove browser behavior.
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'

const root = new URL('../', import.meta.url)
const read = path => readFileSync(new URL(path, root), 'utf8')
const base = framework => `packages/${framework}/${framework === 'svelte' ? 'src/lib' : 'src'}/components/calendar`

for (const framework of ['react', 'solid', 'svelte']) {
  test(`${framework}: Root routes allowOutsideDays through the machine-props whitelist`, () => {
    const source = read(`${base(framework)}/components/Root.${framework === 'svelte' ? 'svelte' : 'tsx'}`)
    const whitelist = source.match(/\(calendarProps, \[([\s\S]*?)\]/)?.[1]
    assert.ok(whitelist, 'Calendar Root must split machine props from DOM props')
    assert.equal([...whitelist.matchAll(/'allowOutsideDays'/g)].length, 1)
    assert.doesNotMatch(source, /allowOutsideDays\s*[:=]\s*true/, 'omitted option must not opt in')
  })
}

for (const framework of ['react', 'vue', 'solid', 'svelte']) {
  test(`${framework}: hook declares an optional boolean without an enabled default`, () => {
    const hook = framework === 'vue' ? 'composables/use-calendar.ts' : `hooks/use-calendar${framework === 'svelte' ? '.svelte' : ''}.ts`
    const source = read(`${base(framework)}/${hook}`)
    assert.match(source, /allowOutsideDays\?: boolean/)
    // Check the existing whole-prop forwarding path, not only the public type.
    const forwarding = {
      react: /\.\.\.normalizeMachineProps\(calendarProps\)/,
      vue: /\.\.\.cleanOpenProps\(rest\)/,
      solid: /\.\.\.resolveMachineProps\(props, \['defaultView'\]\)/,
      svelte: /\.\.\.resolvedProps/,
    }
    assert.match(source, forwarding[framework])
    assert.doesNotMatch(source, /allowOutsideDays\s*[:=]\s*true/)
  })
}

test('Vue: public prop and undefined BooleanDefaults preserve omitted semantics', () => {
  assert.match(read(`${base('vue')}/types.ts`), /allowOutsideDays\?: boolean/)
  const source = read(`${base('vue')}/components/Root.vue`)
  const defaults = source.match(/withDefaults\(defineProps<CalendarRootProps>\(\), \{([\s\S]*?)\}/)?.[1]
  assert.ok(defaults)
  assert.match(defaults, /allowOutsideDays: undefined/)
  assert.match(source, /useCalendar\(props, emits\)/)
})

test('Calendar dependency floor requires the core outside-day implementation', () => {
  assert.match(read('pnpm-workspace.yaml'), /'@destyler\/calendar': \^0\.3\.5(?:\r?\n|$)/)
})
