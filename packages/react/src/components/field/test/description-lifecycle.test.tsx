import type { Root } from 'react-dom/client'
import { act } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { renderToString } from 'react-dom/server'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { Fieldset } from '~/components/fieldset'
import { Field } from '../index'

type Kind = 'field' | 'fieldset'
interface Props { kind: Kind, id?: string, helper?: boolean, error?: boolean, invalid?: boolean }
const roots: Root[] = []
beforeEach(() => vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true))
afterEach(async () => {
  await act(async () => roots.splice(0).forEach(root => root.unmount()))
  document.body.replaceChildren()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

function Fixture({ kind, id = 'description-probe', helper = true, error = true, invalid = true }: Props) {
  return kind === 'field'
    ? (
        <Field.Root id={id} invalid={invalid}>
          <Field.Label>Name</Field.Label>
          <Field.Input defaultValue="initial" />
          {helper && <Field.HelperText>Help</Field.HelperText>}
          {error && <Field.ErrorText>Error</Field.ErrorText>}
        </Field.Root>
      )
    : (
        <Fieldset.Root id={id} invalid={invalid}>
          <Fieldset.Legend>Name</Fieldset.Legend>
          <input defaultValue="initial" />
          {helper && <Fieldset.HelperText>Help</Fieldset.HelperText>}
          {error && <Fieldset.ErrorText>Error</Fieldset.ErrorText>}
        </Fieldset.Root>
      )
}

async function settle() {
  // Let the native child-list observer run, then let React commit its update.
  await act(async () => new Promise<void>(resolve => setTimeout(resolve, 0)))
}

async function mount(props: Props, hydrate = false, doc = document) {
  const container = doc.createElement('div')
  doc.body.append(container)
  let root: Root
  const recoverable = vi.fn()
  if (hydrate) {
    container.innerHTML = renderToString(<Fixture {...props} />)
    const serverRoot = container.firstElementChild
    const serverInput = container.querySelector('input')!
    serverInput.value = 'edited before hydration'
    // Presence is DOM-observed only: server output still has no description.
    expect(container.querySelector('[aria-describedby]')).toBeNull()
    await act(async () => {
      root = hydrateRoot(container, <Fixture {...props} />, { onRecoverableError: recoverable })
    })
    expect(container.firstElementChild).toBe(serverRoot)
    expect(container.querySelector('input')).toBe(serverInput)
    expect(serverInput.value).toBe('edited before hydration')
  }
  else {
    root = createRoot(container)
    await act(async () => root.render(<Fixture {...props} />))
  }
  roots.push(root!)
  await settle()
  return {
    container,
    recoverable,
    async unmount() {
      roots.splice(roots.indexOf(root), 1)
      await act(async () => root.unmount())
      container.remove()
      await settle()
    },
    async render(next: Props) {
      await act(async () => root.render(<Fixture {...next} />))
      await settle()
    },
  }
}

function assertDescription(container: HTMLElement, kind: Kind, helper: boolean, error: boolean, id = 'description-probe') {
  const target = kind === 'field' ? container.querySelector('input')! : container.querySelector('fieldset')!
  const ids = [error && `${kind}::${id}::error-text`, helper && `${kind}::${id}::helper-text`].filter(Boolean) as string[]
  expect(target.getAttribute('aria-describedby')).toBe(ids.join(' ') || null)
  for (const id of ids)
    expect(container.querySelector(`[id="${id}"]`)).not.toBeNull()
}

describe.each(['field', 'fieldset'] as const)('%s description lifecycle', (kind) => {
  it.each([
    { helper: false, error: false },
    { helper: true, error: false },
    { helper: false, error: true },
    { helper: true, error: true },
  ])('links only present text after the initial commit (helper=$helper, error=$error)', async ({ helper, error }) => {
    const { container } = await mount({ kind, helper, error })
    assertDescription(container, kind, helper, error)
  })

  it('tracks insertion, removal and reinsertion without an unrelated invalid-state update', async () => {
    const harness = await mount({ kind, helper: false, error: false })
    const element = harness.container.firstElementChild
    const input = harness.container.querySelector('input')!
    input.value = 'user edit'
    for (const [helper, error] of [[true, false], [true, true], [false, true], [false, false], [true, true]]) {
      await harness.render({ kind, helper, error })
      assertDescription(harness.container, kind, helper, error)
      expect(harness.container.firstElementChild).toBe(element)
      expect(harness.container.querySelector('input')).toBe(input)
      expect(input.value).toBe('user edit')
    }
  })

  it('removes stale IDs after an already-linked helper disappears', async () => {
    const harness = await mount({ kind, helper: true, error: false, invalid: false })
    // Baseline establishes this link when an unrelated dependency changes.
    // Keep that passing setup so removal isolates the stale-ref bug.
    await harness.render({ kind, helper: true, error: false, invalid: true })
    assertDescription(harness.container, kind, true, false)
    await harness.render({ kind, helper: false, error: false, invalid: true })
    assertDescription(harness.container, kind, false, false)
  })

  it('gates error text by invalid state through repeated changes', async () => {
    const harness = await mount({ kind, helper: false, error: true, invalid: false })
    assertDescription(harness.container, kind, false, false)
    for (const invalid of [true, false, true, false]) {
      await harness.render({ kind, helper: false, error: true, invalid })
      assertDescription(harness.container, kind, false, invalid)
    }
  })

  it('keeps one observer per root and disconnects it before recreation', async () => {
    const NativeObserver = window.MutationObserver
    const deliveries = vi.fn()
    // A declaration stays constructible; an arrow callback cannot serve as new.
    function ObserveDeliveries(callback: MutationCallback) {
      return new NativeObserver((records, observer) => {
        deliveries()
        callback(records, observer)
      })
    }
    vi.spyOn(window, 'MutationObserver').mockImplementation(ObserveDeliveries)
    const observe = vi.spyOn(NativeObserver.prototype, 'observe')
    const disconnect = vi.spyOn(NativeObserver.prototype, 'disconnect')
    const first = await mount({ kind, helper: false, error: false })
    expect(observe).toHaveBeenCalledExactlyOnceWith(first.container.firstElementChild, { childList: true, subtree: true })
    const firstObserver = observe.mock.contexts[0]
    await first.render({ kind, helper: true, error: false })
    await first.render({ kind, helper: true, error: false })
    expect(observe).toHaveBeenCalledTimes(1)
    const oldRoot = first.container.firstElementChild!
    const beforeUnmount = deliveries.mock.calls.length
    oldRoot.append(document.createTextNode('queued mutation'))
    await first.unmount()
    oldRoot.append(document.createTextNode('after unmount'))
    await settle()
    expect(deliveries).toHaveBeenCalledTimes(beforeUnmount)
    expect(disconnect).toHaveBeenCalledTimes(1)
    expect(disconnect.mock.contexts[0]).toBe(firstObserver)
    const second = await mount({ kind, helper: false, error: false })
    expect(observe).toHaveBeenCalledTimes(2)
    expect(observe.mock.contexts[1]).not.toBe(firstObserver)
    assertDescription(second.container, kind, false, false)
    await second.unmount()
    expect(disconnect).toHaveBeenCalledTimes(2)
    expect(disconnect.mock.contexts[1]).toBe(observe.mock.contexts[1])
  })

  it('disconnects the old observer on ID changes and refreshes IDs without stale text', async () => {
    const observe = vi.spyOn(window.MutationObserver.prototype, 'observe')
    const disconnect = vi.spyOn(window.MutationObserver.prototype, 'disconnect')
    const harness = await mount({ kind, helper: false, error: false })
    const oldObserver = observe.mock.contexts[0]
    await harness.render({ kind, id: 'replacement', helper: true, error: true })
    expect(disconnect).toHaveBeenCalledTimes(1)
    expect(disconnect.mock.contexts[0]).toBe(oldObserver)
    expect(observe).toHaveBeenCalledTimes(2)
    expect(observe.mock.contexts[1]).not.toBe(oldObserver)
    expect(observe.mock.calls[1]).toEqual([harness.container.firstElementChild, { childList: true, subtree: true }])
    assertDescription(harness.container, kind, true, true, 'replacement')
    await harness.render({ kind, id: 'replacement', helper: false, error: false })
    assertDescription(harness.container, kind, false, false, 'replacement')
    expect(observe).toHaveBeenCalledTimes(2)
  })

  it('uses the root owner document for presence lookup and observation', async () => {
    const iframe = document.createElement('iframe')
    document.body.append(iframe)
    const doc = iframe.contentDocument!
    const frameWindow = iframe.contentWindow as Window & typeof globalThis
    const foreignObserve = vi.spyOn(frameWindow.MutationObserver.prototype, 'observe')
    const unrelated = document.createElement('span')
    unrelated.id = `${kind}::description-probe::helper-text`
    document.body.append(unrelated)
    const harness = await mount({ kind, helper: false, error: false }, false, doc)
    assertDescription(harness.container, kind, false, false)
    expect(foreignObserve).toHaveBeenCalledWith(harness.container.firstElementChild, { childList: true, subtree: true })
    await harness.render({ kind, helper: true, error: true })
    assertDescription(harness.container, kind, true, true)
    await harness.unmount()
    iframe.remove()
  })

  it.each([true, false])('reconciles descriptions and invalid toggles after hydration without replacing server DOM (invalid=%s)', async (initialInvalid) => {
    const harness = await mount({ kind, invalid: initialInvalid }, true)
    assertDescription(harness.container, kind, true, initialInvalid)
    const input = harness.container.querySelector('input')!
    for (const invalid of [false, true, false]) {
      await harness.render({ kind, invalid })
      assertDescription(harness.container, kind, true, invalid)
      expect(harness.container.querySelector('input')).toBe(input)
      expect(input.value).toBe('edited before hydration')
    }
    expect(harness.recoverable).not.toHaveBeenCalled()
  })
})
