import type { Component } from 'solid-js'
import { cleanup, render, waitFor } from '@solidjs/testing-library'
import { createSignal, For, Index, untrack } from 'solid-js'
import * as SolidWeb from 'solid-js/web'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { parseDate } from '../src/components/calendar'
import { ComponentUnderTest as CalendarFixture } from '../src/components/calendar/test/basic'
import { Checkbox } from '../src/components/checkbox'
import { ReactiveCollection } from '../src/components/select/examples/ReactiveCollection'
import { NumberWithCurrency } from '../src/providers/format/examples/NumberWithCurrency'
import { NumberWithPercentage } from '../src/providers/format/examples/NumberWithPercentage'
import { NumberWithUnit } from '../src/providers/format/examples/NumberWithUnit'
import { LocaleProvider } from '../src/providers/locale'

afterEach(cleanup)

it('keeps the canonical For/Index imports identical to the legacy web re-exports', () => {
  expect(SolidWeb.isServer).toBe(false)
  expect(SolidWeb.For).toBe(For)
  expect(SolidWeb.Index).toBe(Index)
})

const formats: { name: string, Example: Component, value: number, options: Intl.NumberFormatOptions }[] = [
  { name: 'currency', Example: NumberWithCurrency, value: 1234.45, options: { style: 'currency', currency: 'USD' } },
  { name: 'percent', Example: NumberWithPercentage, value: 0.145, options: { style: 'percent', minimumFractionDigits: 2, maximumFractionDigits: 2 } },
  { name: 'unit', Example: NumberWithUnit, value: 384.4, options: { style: 'unit', unit: 'kilometer' } },
]

it.each(formats)('retains Intl $name style semantics in the real example', ({ Example, value, options }) => {
  const view = render(() => <LocaleProvider locale="en-US"><Example /></LocaleProvider>)
  expect(view.container.textContent).toBe(new Intl.NumberFormat('en-US', options).format(value))
})

describe('checkbox memo prop composition', () => {
  it('tracks item value and group ownership without remounting or echoing parent writes', async () => {
    const [itemValue, setItemValue] = createSignal('alpha')
    const [groupValue, setGroupValue] = createSignal(['alpha'])
    const first = vi.fn()
    const second = vi.fn()
    const [callback, setCallback] = createSignal(first)
    const view = render(() => (
      <Checkbox.Group value={groupValue} onValueChange={callback()} name="choice">
        <Checkbox.Root value={itemValue()}>
          <Checkbox.Label>Choice</Checkbox.Label>
          <Checkbox.Control />
          <Checkbox.HiddenInput />
        </Checkbox.Root>
      </Checkbox.Group>
    ))
    const input = view.getByRole('checkbox') as HTMLInputElement
    expect(input.checked).toBe(true)
    setItemValue('beta')
    await waitFor(() => expect(input.checked).toBe(false))
    expect(view.getByRole('checkbox')).toBe(input)
    expect(input.value).toBe('beta')
    setGroupValue(['beta'])
    await waitFor(() => expect(input.checked).toBe(true))
    expect(first).not.toHaveBeenCalled()
    setCallback(() => second)
    input.click()
    await waitFor(() => expect(second).toHaveBeenCalledExactlyOnceWith([]))
    expect(first).not.toHaveBeenCalled()
    expect(input.checked).toBe(true)
    setGroupValue([])
    await waitFor(() => expect(input.checked).toBe(false))
    expect(view.getByRole('checkbox')).toBe(input)
    expect(second).toHaveBeenCalledTimes(1)
  })

  it('keeps reactive group disabling/read-only vetoes and restores interaction', async () => {
    const [disabled, setDisabled] = createSignal(false)
    const [readOnly, setReadOnly] = createSignal(false)
    const onValueChange = vi.fn()
    const view = render(() => (
      <Checkbox.Group disabled={disabled()} readOnly={readOnly()} onValueChange={onValueChange}>
        <Checkbox.Root value="alpha">
          <Checkbox.Label>Choice</Checkbox.Label><Checkbox.Control /><Checkbox.HiddenInput />
        </Checkbox.Root>
      </Checkbox.Group>
    ))
    const input = view.getByRole('checkbox') as HTMLInputElement
    setDisabled(true)
    await waitFor(() => expect(input.disabled).toBe(true))
    input.click()
    expect(input.checked).toBe(false)
    expect(onValueChange).not.toHaveBeenCalled()
    setDisabled(false)
    setReadOnly(true)
    await waitFor(() => expect(view.container.querySelector('[data-part="control"]')).toHaveAttribute('data-readonly'))
    input.click()
    await waitFor(() => expect(input.checked).toBe(false))
    expect(onValueChange).not.toHaveBeenCalled()
    setReadOnly(false)
    await waitFor(() => expect(view.container.querySelector('[data-part="control"]')).not.toHaveAttribute('data-readonly'))
    input.click()
    await waitFor(() => expect(input.checked).toBe(true))
    expect(onValueChange).toHaveBeenCalledExactlyOnceWith(['alpha'])
    expect(view.getByRole('checkbox')).toBe(input)
  })
})

it('keeps the reactive Select example item positions and labels after canonical Index imports', async () => {
  const view = render(() => <ReactiveCollection />)
  const items = Array.from(view.container.querySelectorAll('[data-part="item"]'))
  expect(items.map(item => item.textContent)).toEqual(['React-0', 'Solid-0', 'Svelte-0', 'Vue-0'])
  view.getByText('Inc').click()
  await waitFor(() => expect(items.map(item => item.textContent)).toEqual(['React-1', 'Solid-1', 'Svelte-1', 'Vue-1']))
  expect(Array.from(view.container.querySelectorAll('[data-part="item"]'))).toEqual(items)
  view.getByText('Dec').click()
  await waitFor(() => expect(items.map(item => item.textContent)).toEqual(['React-0', 'Solid-0', 'Svelte-0', 'Vue-0']))
})

it('keeps Calendar fixture day/month/year list values and controlled selection after For conversion', async () => {
  const [focused, setFocused] = createSignal(parseDate('2026-01-15'))
  const [mode, setMode] = createSignal<'day' | 'month' | 'year'>('day')
  const onValueChange = vi.fn()
  const view = render(() => <CalendarFixture open focusedValue={focused()} value={[focused()]} view={mode()} onValueChange={onValueChange} />)
  const input = view.container.querySelector('input')
  const cell = (value: string) => document.querySelector<HTMLButtonElement>(`[data-part="table-cell-trigger"][data-value="${value}"]`)
  expect(cell('2026-01-16')).not.toBeNull()
  cell('2026-01-16')!.click()
  await waitFor(() => expect(onValueChange).toHaveBeenCalledTimes(1))
  expect(onValueChange.mock.calls[0][0].value.map((date: { toString: () => string }) => date.toString())).toEqual(['2026-01-16'])
  expect(untrack(focused).toString()).toBe('2026-01-15')
  setFocused(parseDate('2028-02-15'))
  await waitFor(() => expect(cell('2028-02-29')).not.toBeNull())
  setMode('month')
  await waitFor(() => expect(document.querySelector('[data-part="table"][data-view="month"]')).not.toBeNull())
  expect(document.querySelectorAll('[data-part="table"][data-view="month"] [data-part="table-cell-trigger"]')).toHaveLength(12)
  setMode('year')
  await waitFor(() => expect(document.querySelector('[data-part="table"][data-view="year"]')).not.toBeNull())
  expect(cell('2028')).not.toBeNull()
  setMode('day')
  await waitFor(() => expect(cell('2028-02-29')).not.toBeNull())
  expect(view.container.querySelector('input')).toBe(input)
})
