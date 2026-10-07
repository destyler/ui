import type { Root } from 'react-dom/client'
import { act, createRef } from 'react'
import { createRoot } from 'react-dom/client'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { createListCollection } from '~/utils/collection'
import { Combobox } from '../index'

const collection = createListCollection({ items: ['React', 'Svelte'] })
const roots: Root[] = []
beforeEach(() => vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true))
afterEach(async () => {
  for (const root of roots.splice(0))
    await act(async () => root.unmount())
  document.body.replaceChildren()
  vi.unstubAllGlobals()
})

for (const asChild of [false, true]) {
  it(`forwards focusable through updates and preserves DOM props, handlers and ref, asChild=${asChild}`, async () => {
    const container = document.createElement('div')
    document.body.append(container)
    const root = createRoot(container)
    roots.push(root)
    // eslint-disable-next-line react/no-create-ref -- This external renderer harness owns the ref outside a React component.
    const ref = createRef<HTMLButtonElement>()
    const onFocus = vi.fn()
    const onClick = vi.fn()
    const onOpenChange = vi.fn()

    async function render(focusable?: boolean, disabled = false) {
      await act(async () => root.render(
        <Combobox.Root collection={collection} open={false} disabled={disabled} onOpenChange={onOpenChange}>
          <Combobox.Label>Framework</Combobox.Label>
          <Combobox.Control data-testid="control">
            <Combobox.Input />
            <Combobox.Trigger
              ref={ref}
              focusable={focusable}
              asChild={asChild}
              title="Open frameworks"
              data-testid="trigger"
              onFocus={onFocus}
              onClick={onClick}
            >
              {asChild ? <button type="button">Open</button> : 'Open'}
            </Combobox.Trigger>
          </Combobox.Control>
          <Combobox.Positioner><Combobox.Content /></Combobox.Positioner>
        </Combobox.Root>,
      ))
      return container.querySelector<HTMLButtonElement>('[data-testid=trigger]')!
    }

    let trigger = await render()
    expect(trigger.tabIndex).toBe(-1)
    expect(trigger.hasAttribute('data-focusable')).toBe(false)
    expect(trigger.hasAttribute('focusable')).toBe(false)
    trigger = await render(true)
    expect(ref.current).toBe(trigger)
    expect(trigger.tabIndex).toBe(0)
    expect(trigger.hasAttribute('data-focusable')).toBe(true)
    expect(trigger.hasAttribute('focusable')).toBe(false)
    expect(trigger.title).toBe('Open frameworks')
    expect(trigger.type).toBe('button')
    await act(async () => trigger.focus())
    expect(document.activeElement).toBe(trigger)
    expect(onFocus).toHaveBeenCalledTimes(1)
    expect(container.querySelector('[data-testid=control]')?.hasAttribute('data-focus')).toBe(true)
    await act(async () => trigger.click())
    expect(onClick).toHaveBeenCalledTimes(1)
    expect(onOpenChange).toHaveBeenCalledWith(expect.objectContaining({ open: true }))
    trigger = await render(false)
    expect(trigger.tabIndex).toBe(-1)
    expect(trigger.hasAttribute('data-focusable')).toBe(false)
    expect(trigger.hasAttribute('focusable')).toBe(false)
    trigger = await render(true, true)
    expect(trigger.disabled).toBe(true)
    const calls = onOpenChange.mock.calls.length
    await act(async () => trigger.click())
    expect(onOpenChange).toHaveBeenCalledTimes(calls)
  })
}

it('lets a consumer override tabIndex without leaking the machine prop', async () => {
  const container = document.createElement('div')
  document.body.append(container)
  const root = createRoot(container)
  roots.push(root)
  await act(async () => root.render(
    <Combobox.Root collection={collection}>
      <Combobox.Trigger focusable tabIndex={3}>Open</Combobox.Trigger>
    </Combobox.Root>,
  ))
  const trigger = container.querySelector('button')!
  expect(trigger.tabIndex).toBe(3)
  expect(trigger.hasAttribute('data-focusable')).toBe(true)
  expect(trigger.hasAttribute('focusable')).toBe(false)
})
