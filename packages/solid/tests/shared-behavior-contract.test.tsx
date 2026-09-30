import type { Accessor } from 'solid-js'
import { parse as parseDate } from '@destyler/calendar'
import { cleanup, render, waitFor } from '@solidjs/testing-library'
import { createSignal } from 'solid-js'
import { afterEach, expect, it, vi } from 'vitest'
import { assertFocusRestored, assertOwnershipCoverage, assertOwnershipSnapshot, ownershipScenarios } from '../../../utils/test/behavior-contracts'
import { useCalendar } from '../src/components/calendar'
import { useCheckbox } from '../src/components/checkbox'
import { useCombobox } from '../src/components/combobox'
import { useDialog } from '../src/components/dialog'
import { useNumberInput } from '../src/components/number-input'
import { useTree } from '../src/components/tree'
import { createFileTreeCollection, createListCollection } from '../src/utils/collection'

afterEach(cleanup)
const collection = createListCollection({ items: ['one', 'two'] })
const treeCollection = createFileTreeCollection(['src/app.ts', 'lib/index.ts'])
const cases = [
  { name: 'Checkbox.checked', hook: useCheckbox, field: 'checked', initial: false, next: true },
  { name: 'NumberInput.value', hook: useNumberInput, field: 'value', initial: '1', next: '2' },
  { name: 'Combobox.value', hook: useCombobox, field: 'value', initial: ['one'], next: ['two'], props: { collection } },
  { name: 'Combobox.inputValue', hook: useCombobox, field: 'inputValue', initial: 'one', next: 'two', props: { collection } },
  { name: 'Dialog.open', hook: useDialog, field: 'open', initial: false, next: true, props: { modal: false, closeOnInteractOutside: false } },
  { name: 'Calendar.value', hook: useCalendar, field: 'value', initial: [parseDate('2026-01-01')], next: [parseDate('2026-02-02')] },
  { name: 'Tree.selectedValue', hook: useTree, field: 'selectedValue', initial: ['src'], next: ['lib'], props: { collection: treeCollection } },
  { name: 'Tree.expandedValue', hook: useTree, field: 'expandedValue', initial: ['src'], next: ['lib'], props: { collection: treeCollection } },
]

it('shared contract coverage includes every target field', () => assertOwnershipCoverage(cases.map(row => row.name)))
for (const row of cases) {
  for (const scenario of ownershipScenarios) {
    it(`shared contract: ${row.name}: ${scenario.name}`, async () => {
      const suffix = row.field[0].toUpperCase() + row.field.slice(1)
      const callback = row.field === 'selectedValue' ? 'onSelectionChange' : row.field === 'expandedValue' ? 'onExpandedChange' : `on${suffix}Change`
      const values = { initial: row.initial, next: row.next }
      const valueFor = (key: 'initial' | 'next') => Array.isArray(values[key]) ? [...values[key]] : values[key]
      const format = (value: any) => JSON.stringify(row.name === 'Calendar.value' ? value.map(String) : value)
      const onChange = vi.fn()
      const [live, setLive] = createSignal<any>(scenario.controlled ? valueFor('initial') : undefined)
      const [defaultValue, setDefaultValue] = createSignal<any>(valueFor(scenario.defaultValue))
      const [dir, setDir] = createSignal<'ltr' | 'rtl'>('ltr')
      const props = {
        ...row.props,
        get [row.field]() { return live() },
        get [`default${suffix}`]() { return defaultValue() },
        get dir() { return dir() },
        [callback]: onChange,
      }
      if (scenario.accept)
        onChange.mockImplementation(details => setLive(() => details[row.field]))
      let api!: Accessor<any>
      const view = render(() => {
        api = (row.hook as (props: any) => Accessor<any>)(props)
        return <output data-testid="contract">{format(api()[row.field])}</output>
      })
      const check = (value: unknown, requests: unknown[]) => waitFor(() => assertOwnershipSnapshot({
        api: format(api()[row.field]),
        rendered: view.getByTestId('contract').textContent,
        requests: onChange.mock.calls.map(([details]) => format(details[row.field])),
      }, format(value), requests.map(format)))
      await check(row.initial, [])
      for (const step of scenario.steps) {
        if (step.action === 'request')
          api()[`set${suffix}`](valueFor(step.value))
        if (step.action === 'parent')
          setLive(() => valueFor(step.value))
        if (step.action === 'default')
          setDefaultValue(() => valueFor(step.value))
        if (step.action === 'rerender')
          setDir(dir => dir === 'ltr' ? 'rtl' : 'ltr')
        await check(values[step.expected], step.requests.map(value => values[value]))
      }
    })
  }
}

it('shared dialog lifecycle: restores focus twice and disposes document listeners on unmount', async () => {
  const onOpenChange = vi.fn()
  let api!: ReturnType<typeof useDialog>
  const view = render(() => {
    api = useDialog({ 'defaultOpen': false, 'preventScroll': false, 'aria-label': 'Contract dialog', onOpenChange })
    return (
      <>
        <button data-contract-trigger {...api().getTriggerProps()}>Open</button>
        <div {...api().getPositionerProps()}><div {...api().getContentProps()}><button {...api().getCloseTriggerProps()}>Close</button></div></div>
      </>
    )
  })
  const trigger = view.container.querySelector<HTMLButtonElement>('[data-contract-trigger]')!
  for (const close of ['api', 'escape']) {
    trigger.focus()
    trigger.click()
    await waitFor(() => expect(api().open).toBe(true))
    await waitFor(() => expect(view.container.querySelector('[data-part="content"]')?.contains(document.activeElement)).toBe(true))
    if (close === 'api')
      api().setOpen(false)
    else
      document.activeElement!.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    await waitFor(() => {
      expect(api().open).toBe(false)
      assertFocusRestored(trigger)
    })
  }
  trigger.click()
  await waitFor(() => expect(api().open).toBe(true))
  await waitFor(() => expect(view.container.querySelector('[data-part="content"]')?.contains(document.activeElement)).toBe(true))
  view.unmount()
  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
  await new Promise(resolve => setTimeout(resolve, 35))
  expect(onOpenChange.mock.calls.map(([details]) => details.open)).toEqual([true, false, true, false, true])
})
