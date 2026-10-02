import { expect } from 'vitest'

// Shared expectations, not a renderer adapter. Each framework owns mounting,
// prop updates, native events, settling and disposal in its existing harness.
export const ownershipFields = [
  'Checkbox.checked',
  'NumberInput.value',
  'Combobox.value',
  'Combobox.inputValue',
  'Dialog.open',
  'Calendar.value',
  'Tree.selectedValue',
  'Tree.expandedValue',
] as const

export type ContractValue = 'initial' | 'next'
interface Step {
  action: 'request' | 'parent' | 'default' | 'rerender'
  value: ContractValue
  expected: ContractValue
  requests: ContractValue[]
}
interface OwnershipScenario {
  name: string
  controlled: boolean
  accept: boolean
  defaultValue: ContractValue
  steps: Step[]
}

export const ownershipScenarios: OwnershipScenario[] = [
  {
    name: 'undefined live props seed defaults once across requests and rerenders',
    controlled: false,
    accept: false,
    defaultValue: 'initial',
    steps: [
      { action: 'request', value: 'next', expected: 'next', requests: ['next'] },
      { action: 'default', value: 'next', expected: 'next', requests: ['next'] },
      { action: 'request', value: 'initial', expected: 'initial', requests: ['next', 'initial'] },
      { action: 'rerender', value: 'initial', expected: 'initial', requests: ['next', 'initial'] },
      { action: 'default', value: 'initial', expected: 'initial', requests: ['next', 'initial'] },
      { action: 'default', value: 'next', expected: 'initial', requests: ['next', 'initial'] },
      { action: 'request', value: 'next', expected: 'next', requests: ['next', 'initial', 'next'] },
    ],
  },
  {
    name: 'live props win over defaults, veto repeatedly and accept delayed writeback',
    controlled: true,
    accept: false,
    defaultValue: 'next',
    steps: [
      { action: 'request', value: 'next', expected: 'initial', requests: ['next'] },
      { action: 'request', value: 'next', expected: 'initial', requests: ['next', 'next'] },
      { action: 'parent', value: 'next', expected: 'next', requests: ['next', 'next'] },
      { action: 'default', value: 'initial', expected: 'next', requests: ['next', 'next'] },
      { action: 'request', value: 'initial', expected: 'next', requests: ['next', 'next', 'initial'] },
      { action: 'request', value: 'initial', expected: 'next', requests: ['next', 'next', 'initial', 'initial'] },
      { action: 'parent', value: 'initial', expected: 'initial', requests: ['next', 'next', 'initial', 'initial'] },
    ],
  },
  {
    name: 'accepted requests complete two cycles without duplicate change notifications',
    controlled: true,
    accept: true,
    defaultValue: 'next',
    steps: [
      { action: 'request', value: 'next', expected: 'next', requests: ['next'] },
      { action: 'request', value: 'initial', expected: 'initial', requests: ['next', 'initial'] },
      { action: 'request', value: 'next', expected: 'next', requests: ['next', 'initial', 'next'] },
      { action: 'request', value: 'initial', expected: 'initial', requests: ['next', 'initial', 'next', 'initial'] },
      { action: 'rerender', value: 'next', expected: 'initial', requests: ['next', 'initial', 'next', 'initial'] },
    ],
  },
]

export function assertOwnershipSnapshot(
  snapshot: { api: string, rendered: string | null | undefined, requests: string[] },
  value: string,
  requests: string[],
) {
  expect(snapshot.api, 'public API state').toBe(value)
  expect(snapshot.rendered, 'rendered state').toBe(value)
  expect(snapshot.requests, 'ordered change notifications').toEqual(requests)
}

export function assertTextSelection(input: HTMLInputElement, value: string, caret: number) {
  expect(input.value, 'native edit text').toBe(value)
  expect(input.selectionStart, 'selection start').toBe(caret)
  expect(input.selectionEnd, 'selection end').toBe(caret)
}

export function assertFocusRestored(trigger: HTMLElement) {
  expect(trigger.isConnected, 'restoration target remains mounted').toBe(true)
  expect(trigger.ownerDocument.activeElement, 'focus returns to the original trigger').toBe(trigger)
}

export function assertOwnershipCoverage(fields: string[]) {
  const normalize = (field: string) => field.replace(/[- .]/g, '').toLowerCase()
  expect(fields.map(normalize).sort()).toEqual(ownershipFields.map(normalize).sort())
}

export function assertCheckboxForm(input: HTMLInputElement, checked: boolean) {
  expect(input.checked, 'native checked property').toBe(checked)
  expect(input.form, 'native form association').not.toBeNull()
  expect(input.name, 'successful-control name').not.toBe('')
  expect(new FormData(input.form!).getAll(input.name), 'submitted checkbox values').toEqual(checked ? [input.value] : [])
}
