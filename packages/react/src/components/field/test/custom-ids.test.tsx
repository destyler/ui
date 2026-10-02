import type { Root } from 'react-dom/client'
import type { UseFieldProps } from '../hooks/use-field'
import { act } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { renderToString } from 'react-dom/server'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { Field } from '../index'

type Control = 'input' | 'textarea' | 'select'
interface Props extends UseFieldProps { control?: Control }
const roots: Root[] = []
beforeEach(() => vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true))
afterEach(async () => {
  await act(async () => roots.splice(0).forEach(root => root.unmount()))
  document.body.replaceChildren()
  vi.unstubAllGlobals()
})

function Fixture({ control = 'input', ...props }: Props) {
  return (
    <Field.Root invalid {...props}>
      <Field.Label>Name</Field.Label>
      {control === 'input'
        ? <Field.Input defaultValue="initial" />
        : control === 'textarea'
          ? <Field.Textarea defaultValue="initial" />
          : <Field.Select defaultValue="initial"><option value="initial">Initial</option><option value="edited">Edited</option></Field.Select>}
      <Field.HelperText>Help</Field.HelperText>
      <Field.ErrorText>Error</Field.ErrorText>
    </Field.Root>
  )
}

function getControl(container: HTMLElement) {
  return container.querySelector<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>('input, textarea, select')!
}

async function mount(props: Props, hydrate = false) {
  const container = document.createElement('div')
  document.body.append(container)
  let root: Root
  const recoverable = vi.fn()
  if (hydrate) {
    container.innerHTML = renderToString(<Fixture {...props} />)
    const serverRoot = container.firstElementChild
    const serverControl = getControl(container)
    if (props.id !== undefined)
      assertIds(container, props.id, props.ids)
    // Plain React textarea hydration restores defaultValue in the installed
    // runtime too. Its edit-retention control below starts after hydration.
    const beforeHydration = props.control === 'textarea' ? 'initial' : 'edited'
    serverControl.value = beforeHydration
    await act(async () => {
      root = hydrateRoot(container, <Fixture {...props} />, { onRecoverableError: recoverable })
    })
    expect(container.firstElementChild).toBe(serverRoot)
    expect(getControl(container)).toBe(serverControl)
    expect(serverControl.value).toBe(beforeHydration)
  }
  else {
    root = createRoot(container)
    await act(async () => root.render(<Fixture {...props} />))
  }
  roots.push(root!)
  return {
    container,
    recoverable,
    async render(next: Props) {
      await act(async () => root.render(<Fixture {...next} />))
    },
  }
}

function assertIds(container: HTMLElement, base: string, ids: Props['ids'] = {}) {
  const control = getControl(container)
  const label = container.querySelector('label')!
  expect(container.firstElementChild!.id).toBe(ids.root ?? `field::${base}`)
  expect(control.id).toBe(ids.control ?? base)
  expect(label.htmlFor).toBe(control.id)
  // HTMLLabelElement.control checks the browser's native ID association.
  expect(label.control).toBe(control)
  expect(label.id).toBe(ids.label ?? `field::${base}::label`)
  expect(container.querySelector('[data-part="helper-text"]')!.id).toBe(ids.helperText ?? `field::${base}::helper-text`)
  expect(container.querySelector('[data-part="error-text"]')!.id).toBe(ids.errorText ?? `field::${base}::error-text`)
  const assigned = Array.from(container.querySelectorAll('[id]'), element => element.id)
  expect(new Set(assigned).size).toBe(assigned.length)
}

describe.each([false, true])('field custom part IDs (hydrate=%s)', (hydrate) => {
  it.each([
    { name: 'defaults', ids: undefined },
    { name: 'root only', ids: { root: 'custom-root' } },
    { name: 'control only', ids: { control: 'custom-control' } },
    { name: 'root and control', ids: { root: 'custom-root', control: 'custom-control' } },
    { name: 'all parts', ids: { root: 'custom-root', control: 'custom-control', label: 'custom-label', helperText: 'custom-helper', errorText: 'custom-error' } },
  ])('routes $name to their own parts', async ({ ids }) => {
    const { container, recoverable } = await mount({ id: 'provided-base', ids }, hydrate)
    assertIds(container, 'provided-base', ids)
    expect(recoverable).not.toHaveBeenCalled()
  })

  it.each(['input', 'textarea', 'select'] as const)('keeps native %s label association, DOM and user value across override replacement', async (control) => {
    const harness = await mount({ id: 'provided-base', control }, hydrate)
    const root = harness.container.firstElementChild
    const input = getControl(harness.container)
    input.value = 'edited'
    for (const ids of [{ root: 'root-a' }, { control: 'control-b' }, { root: 'root-c', control: 'control-c' }, undefined]) {
      await harness.render({ id: 'provided-base', control, ids })
      assertIds(harness.container, 'provided-base', ids)
      expect(harness.container.firstElementChild).toBe(root)
      expect(getControl(harness.container)).toBe(input)
      expect(input.value).toBe('edited')
    }
    // Explicit props.id controls fallback namespaces, not explicit part IDs.
    await harness.render({ id: 'replacement-base', control, ids: { control: 'fixed-control' } })
    assertIds(harness.container, 'replacement-base', { control: 'fixed-control' })
    expect(getControl(harness.container)).toBe(input)
    expect(input.value).toBe('edited')
    expect(harness.recoverable).not.toHaveBeenCalled()
  })

  it('keeps one generated fallback while part overrides are added and removed', async () => {
    // id remains absent throughout, avoiding the separate #76 hook-order defect.
    const harness = await mount({}, hydrate)
    const generated = getControl(harness.container).id
    expect(generated).not.toBe('')
    const input = getControl(harness.container)
    input.value = 'edited'
    for (const ids of [{ root: 'custom-root', control: 'custom-control' }, undefined, { control: 'next-control' }, undefined]) {
      await harness.render({ ids })
      assertIds(harness.container, generated, ids)
      expect(getControl(harness.container)).toBe(input)
      expect(input.value).toBe('edited')
    }
    expect(harness.recoverable).not.toHaveBeenCalled()
  })
})
