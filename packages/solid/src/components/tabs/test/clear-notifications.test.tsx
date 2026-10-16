import { createSignal } from 'solid-js'
import { isServer, render } from 'solid-js/web'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { page, userEvent } from 'vitest/browser'
import { Tabs } from '../index'

type Mode = 'accept' | 'veto' | 'delay' | 'uncontrolled'
type ClearSource = 'clearValue' | 'click' | 'Enter'
const clearSources: ClearSource[] = ['clearValue', 'click', 'Enter']
const disposers: (() => void)[] = []
const changesAfterDisposal: { value: string | null }[] = []
let lifecyclePhase = 'test'
let restoreWarningSpy: (() => void) | undefined

beforeEach(({ task }) => {
  lifecyclePhase = 'test'
  changesAfterDisposal.length = 0
  const warn = console.warn.bind(console)
  const warningSpy = vi.spyOn(console, 'warn').mockImplementation((...args) => {
    warn(...args)
    if (args[0] === '[@destyler/xstate > transition] Cannot transition a stopped machine') {
      warn('[tabs-stopped-machine-diagnostic]', JSON.stringify({
        test: task.name,
        lifecyclePhase,
        stack: new Error('Tabs stopped-machine warning').stack,
      }))
    }
  })
  restoreWarningSpy = () => warningSpy.mockRestore()
})

afterEach(async () => {
  try {
    lifecyclePhase = 'disposing-roots'
    disposers.splice(0).forEach(dispose => dispose())
    lifecyclePhase = 'roots-disposed'
    lifecyclePhase = 'replacing-body'
    document.body.replaceChildren()
    lifecyclePhase = 'body-replaced'
    // Observe pending activation frames without changing focus or event dispatch.
    await settle()
    expect(changesAfterDisposal).toEqual([])
  }
  finally {
    restoreWarningSpy?.()
    restoreWarningSpy = undefined
  }
})

function Fixture(props: { mode: Mode, onChange: (details: { value: string | null }) => void }) {
  const [value, setValue] = createSignal<string | null>('alpha')
  const [pending, setPending] = createSignal<string | null>(null)
  return (
    <>
      <button onClick={() => setValue('alpha')}>Parent restore</button>
      <button onClick={() => setValue(pending())}>Apply pending</button>
      <output data-testid="parent-value">{value() ?? 'none'}</output>
      <Tabs.Root
        value={props.mode === 'uncontrolled' ? undefined : value()}
        defaultValue="alpha"
        deselectable
        activationMode="manual"
        onValueChange={(details) => {
          props.onChange(details)
          if (props.mode === 'accept')
            setValue(details.value)
          if (props.mode === 'delay')
            setPending(details.value)
        }}
      >
        <Tabs.Context>
          {tabs => (
            <>
              <button onClick={() => tabs().clearValue()}>Request clear</button>
              <button onClick={() => tabs().setValue('alpha')}>Select alpha</button>
              <button onClick={() => tabs().setValue('beta')}>Select beta</button>
              <output data-testid="api-value">{tabs().value ?? 'none'}</output>
            </>
          )}
        </Tabs.Context>
        <Tabs.List><Tabs.Trigger value="alpha">Alpha</Tabs.Trigger><Tabs.Trigger value="beta">Beta</Tabs.Trigger></Tabs.List>
        <Tabs.Content value="alpha">Alpha content</Tabs.Content><Tabs.Content value="beta">Beta content</Tabs.Content>
      </Tabs.Root>
    </>
  )
}

async function settle() {
  // Manual activation runs in a scheduled frame; flush writeback and a later frame.
  await new Promise<void>(resolve => requestAnimationFrame(() => resolve()))
  await new Promise<void>(resolve => requestAnimationFrame(() => resolve()))
}

async function mountFixture(mode: Mode) {
  let disposalStarted = false
  const changes = vi.fn((details: { value: string | null }) => {
    if (disposalStarted)
      changesAfterDisposal.push(details)
  })
  const container = document.createElement('div')
  document.body.append(container)
  expect(isServer).toBe(false)
  const dispose = render(() => <Fixture mode={mode} onChange={changes} />, container)
  disposers.push(() => {
    disposalStarted = true
    dispose()
  })
  await settle()
  expect(changes).not.toHaveBeenCalled()
  return { container, changes }
}

async function clickButton(name: string) {
  await userEvent.click(page.getByRole('button', { name, exact: true }))
  await settle()
}

async function requestClear(source: ClearSource, container: HTMLElement) {
  if (source === 'clearValue') {
    await clickButton('Request clear')
  }
  else if (source === 'click') {
    await userEvent.click(page.getByRole('tab', { name: 'Alpha', exact: true }))
    await settle()
  }
  else {
    container.querySelector<HTMLButtonElement>('[role="tab"]')!.focus()
    await userEvent.keyboard('[Enter]')
    await settle()
  }
}

function expectSelection(container: HTMLElement, value: string | null, controlled = true) {
  expect(container.querySelector('[data-testid="api-value"]')!.textContent).toBe(value ?? 'none')
  if (controlled)
    expect(container.querySelector('[data-testid="parent-value"]')!.textContent).toBe(value ?? 'none')
  const tabs = Array.from(container.querySelectorAll<HTMLButtonElement>('[role="tab"]'))
  const panels = Array.from(container.querySelectorAll<HTMLElement>('[role="tabpanel"]'))
  expect(tabs).toHaveLength(2)
  expect(panels).toHaveLength(2)
  for (const [index, tabValue] of ['alpha', 'beta'].entries()) {
    expect(tabs[index].getAttribute('aria-selected')).toBe(String(tabValue === value))
    expect(panels[index].hidden).toBe(tabValue !== value)
  }
}

it.each(clearSources)('accepts %s null requests without writeback echoes or duplicate clears', async (source) => {
  const { container, changes } = await mountFixture('accept')
  expectSelection(container, 'alpha')
  for (let cycle = 0; cycle < 2; cycle++) {
    await requestClear(source, container)
    expectSelection(container, null)
    expect(changes.mock.calls).toEqual(Array.from({ length: cycle + 1 }, () => [{ value: null }]))
    await clickButton('Request clear')
    expectSelection(container, null)
    expect(changes).toHaveBeenCalledTimes(cycle + 1)
    await clickButton('Parent restore')
    expectSelection(container, 'alpha')
    expect(changes).toHaveBeenCalledTimes(cycle + 1)
  }
})

it.each(clearSources)('allows repeated %s null requests to be vetoed by the parent', async (source) => {
  const { container, changes } = await mountFixture('veto')
  for (let attempt = 0; attempt < 2; attempt++) {
    await requestClear(source, container)
    expectSelection(container, 'alpha')
    expect(changes.mock.calls).toEqual(Array.from({ length: attempt + 1 }, () => [{ value: null }]))
  }
  await settle()
  expectSelection(container, 'alpha')
  expect(changes).toHaveBeenCalledTimes(2)
})

it.each(clearSources)('waits for delayed parent acceptance of %s without an echo', async (source) => {
  const { container, changes } = await mountFixture('delay')
  for (let attempt = 0; attempt < 2; attempt++) {
    await requestClear(source, container)
    expectSelection(container, 'alpha')
    expect(changes.mock.calls).toEqual(Array.from({ length: attempt + 1 }, () => [{ value: null }]))
  }
  await clickButton('Apply pending')
  expectSelection(container, null)
  expect(changes).toHaveBeenCalledTimes(2)
  await clickButton('Apply pending')
  await clickButton('Request clear')
  expectSelection(container, null)
  expect(changes).toHaveBeenCalledTimes(2)
  await clickButton('Parent restore')
  expectSelection(container, 'alpha')
  expect(changes).toHaveBeenCalledTimes(2)
})

it.each(clearSources)('clears uncontrolled Tabs through %s and does not notify twice', async (source) => {
  const { container, changes } = await mountFixture('uncontrolled')
  expectSelection(container, 'alpha', false)
  await requestClear(source, container)
  expectSelection(container, null, false)
  expect(changes.mock.calls).toEqual([[{ value: null }]])
  await clickButton('Request clear')
  expectSelection(container, null, false)
  expect(changes).toHaveBeenCalledTimes(1)
})

it.each(['accept', 'uncontrolled'] as const)('keeps setValue selection-only with deselectable Tabs (%s)', async (mode) => {
  const { container, changes } = await mountFixture(mode)
  const controlled = mode === 'accept'
  await clickButton('Select alpha')
  expectSelection(container, 'alpha', controlled)
  expect(changes).not.toHaveBeenCalled()
  await clickButton('Select beta')
  expectSelection(container, 'beta', controlled)
  expect(changes.mock.calls).toEqual([[{ value: 'beta' }]])
  await clickButton('Select beta')
  expectSelection(container, 'beta', controlled)
  expect(changes).toHaveBeenCalledTimes(1)
  await clickButton('Request clear')
  expectSelection(container, null, controlled)
  await clickButton('Select beta')
  expectSelection(container, 'beta', controlled)
  expect(changes.mock.calls).toEqual([[{ value: 'beta' }], [{ value: null }], [{ value: 'beta' }]])
})
