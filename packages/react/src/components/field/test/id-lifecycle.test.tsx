import type { Root } from 'react-dom/client'
import { act } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { renderToString } from 'react-dom/server'
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import { Fieldset } from '~/components/fieldset'
import { Field } from '../index'

type Kind = 'field' | 'fieldset'

beforeAll(() => vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true))
const disposers: (() => void)[] = []
afterEach(async () => {
  await act(async () => disposers.splice(0).forEach(dispose => dispose()))
})
afterAll(() => vi.unstubAllGlobals())

function Fixture({ kind, id, label = 'Name' }: { kind: Kind, id?: string, label?: string }) {
  return kind === 'field'
    ? <Field.Root id={id}><Field.Label>{label}</Field.Label><Field.Input defaultValue="retained" /><Field.HelperText>Help</Field.HelperText></Field.Root>
    : <Fieldset.Root id={id}><Fieldset.Legend>{label}</Fieldset.Legend><input defaultValue="retained" /><Fieldset.HelperText>Help</Fieldset.HelperText></Fieldset.Root>
}

async function setup(kind: Kind, id: string | undefined, hydrate = false) {
  const container = document.createElement('div')
  document.body.append(container)
  const errors = vi.fn()
  let root: Root
  const fixture = <Fixture kind={kind} id={id} />
  if (hydrate) {
    container.innerHTML = renderToString(fixture)
    const serverRoot = container.firstElementChild
    const serverInput = container.querySelector('input')
    await act(async () => {
      root = hydrateRoot(container, fixture, { onRecoverableError: errors })
    })
    expect(container.firstElementChild).toBe(serverRoot)
    expect(container.querySelector('input')).toBe(serverInput)
    expect(errors).not.toHaveBeenCalled()
  }
  else {
    root = createRoot(container)
    await act(async () => root.render(fixture))
  }
  disposers.push(() => {
    root.unmount()
    container.remove()
  })
  const render = async (next: string | undefined, label?: string) => {
    await act(async () => root.render(<Fixture kind={kind} id={next} label={label} />))
  }
  return { container, render, errors }
}

function readId(container: HTMLElement, kind: Kind) {
  const helper = container.querySelector<HTMLElement>('[data-part="helper-text"]')!
  expect(helper.id.startsWith(`${kind}::`)).toBe(true)
  expect(helper.id.endsWith('::helper-text')).toBe(true)
  const id = helper.id.slice(`${kind}::`.length, -'::helper-text'.length)
  expect(id.length).toBeGreaterThan(0)
  if (kind === 'field') {
    expect(container.querySelector('input')!.id).toBe(id)
    expect(container.querySelector('label')!.htmlFor).toBe(id)
    expect(container.firstElementChild!.id).toBe(`field::${id}`)
  }
  return id
}

describe.each(['field', 'fieldset'] as const)('%s ID hook order', (kind) => {
  it.each([
    { initial: undefined, hydrate: false },
    { initial: 'provided', hydrate: false },
    { initial: undefined, hydrate: true },
    { initial: 'provided', hydrate: true },
  ])('switches generated/explicit IDs without remounting (initial=$initial, hydrate=$hydrate)', async ({ initial, hydrate }) => {
    const { container, render, errors } = await setup(kind, initial, hydrate)
    const root = container.firstElementChild
    const input = container.querySelector('input')!
    input.value = 'user value'
    let generated: string | undefined
    for (const id of [initial, initial === undefined ? 'provided' : undefined, 'replacement', undefined]) {
      await render(id)
      expect(container.firstElementChild).toBe(root)
      expect(container.querySelector('input')).toBe(input)
      expect(input.value).toBe('user value')
      const resolved = readId(container, kind)
      if (id !== undefined) {
        expect(resolved).toBe(id)
      }
      else if (generated === undefined) {
        generated = resolved
      }
      else {
        expect(resolved).toBe(generated)
      }
      expect(errors).not.toHaveBeenCalled()
    }
  })

  it.each([undefined, 'provided'])('preserves the stable ID mode while unrelated content changes (%s)', async (id) => {
    const { container, render } = await setup(kind, id)
    const before = readId(container, kind)
    const input = container.querySelector('input')
    await render(id, 'Updated label')
    expect(readId(container, kind)).toBe(before)
    expect(container.querySelector('input')).toBe(input)
    expect(container.querySelector(kind === 'field' ? 'label' : 'legend')!.textContent).toBe('Updated label')
  })
})
