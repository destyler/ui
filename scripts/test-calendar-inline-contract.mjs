// Source-level wiring checks only: these do not render components or prove browser behavior.
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'

const root = new URL('../', import.meta.url)
const read = path => readFileSync(new URL(path, root), 'utf8')
const base = framework => `packages/${framework}/${framework === 'svelte' ? 'src/lib' : 'src'}/components/calendar`

for (const framework of ['react', 'solid', 'svelte']) {
  test(`${framework}: Root routes inline through the machine-props whitelist`, () => {
    const source = read(`${base(framework)}/components/Root.${framework === 'svelte' ? 'svelte' : 'tsx'}`)
    const whitelist = source.match(/\(calendarProps, \[([\s\S]*?)\]/)?.[1]
    assert.ok(whitelist, 'Calendar Root must split machine props from DOM props')
    assert.equal([...whitelist.matchAll(/'inline'/g)].length, 1)
    assert.doesNotMatch(source, /inline\s*[:=]\s*true/, 'omitted option must not opt in')
  })
}

for (const framework of ['react', 'vue', 'solid', 'svelte']) {
  test(`${framework}: hook declares an optional boolean without an enabled default`, () => {
    const hook = framework === 'vue' ? 'composables/use-calendar.ts' : `hooks/use-calendar${framework === 'svelte' ? '.svelte' : ''}.ts`
    const source = read(`${base(framework)}/${hook}`)
    assert.match(source, /inline\?: boolean/)
    // Check the existing whole-prop forwarding path, not only the public type.
    const forwarding = {
      react: /\.\.\.normalizeMachineProps\(calendarProps\)/,
      vue: /\.\.\.cleanOpenProps\(rest\)/,
      solid: /\.\.\.resolveMachineProps\(props, \['defaultView'\]\)/,
      svelte: /\.\.\.resolvedProps/,
    }
    assert.match(source, forwarding[framework])
    assert.doesNotMatch(source, /inline\s*[:=]\s*true/)
  })
}

test('Vue: public prop and undefined BooleanDefaults preserve omitted semantics', () => {
  assert.match(read(`${base('vue')}/types.ts`), /inline\?: boolean/)
  const source = read(`${base('vue')}/components/Root.vue`)
  const defaults = source.match(/withDefaults\(defineProps<CalendarRootProps>\(\), \{([\s\S]*?)\}/)?.[1]
  assert.ok(defaults)
  assert.match(defaults, /inline: undefined/)
  assert.match(source, /useCalendar\(props, emits\)/)
})

test('Calendar dependency floor requires the released inline implementation', () => {
  const floor = read('pnpm-workspace.yaml').match(/'@destyler\/calendar': \^0\.3\.(\d+)(?:\r?\n|$)/)
  assert.ok(floor && Number(floor[1]) >= 6)
})
