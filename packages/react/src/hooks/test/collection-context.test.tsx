import type { Root } from 'react-dom/client'
import { act, createElement } from 'react'
import { createRoot } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useCombobox } from '~/components/combobox'
import { useSelect } from '~/components/select'
import { useTree } from '~/components/tree'
import { createListCollection, createTreeCollection } from '~/utils/collection'

const roots: Root[] = []
beforeEach(() => vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true))
afterEach(async () => {
  await act(async () => roots.splice(0).forEach(root => root.unmount()))
  document.body.replaceChildren()
  vi.unstubAllGlobals()
})

type Kind = 'combobox' | 'select' | 'tree'
type Api = ReturnType<typeof useCombobox> | ReturnType<typeof useSelect> | ReturnType<typeof useTree>
type UseHook = (props: any) => any

function makeCollection(kind: Kind, suffix = '') {
  return kind === 'tree'
    ? createTreeCollection({
        rootNode: { id: 'root', children: [{ id: 'branch', children: [{ id: `alpha${suffix}` }] }, { id: `beta${suffix}` }] },
        nodeToValue: node => node.id,
        nodeToString: node => node.id,
      })
    : createListCollection({ items: [`alpha${suffix}`, `beta${suffix}`] })
}

async function mount(kind: Kind, props: any) {
  const useHook: UseHook = { combobox: useCombobox, select: useSelect, tree: useTree }[kind]
  const container = document.createElement('div')
  document.body.append(container)
  const root = createRoot(container)
  roots.push(root)
  let current: Api
  function Harness(next: any) {
    'use no memo'
    // Only the observation harness opts out. Production hooks retain the React
    // Compiler, real core actor and real collection objects.
    const api = useHook(next)
    current = api
    return (
      <div {...api.getRootProps()}>
        <input data-testid="retained" defaultValue="initial" />
        {kind === 'tree'
          ? (
              <div {...api.getTreeProps()}>
                {api.collection.rootNode.children.map((node: any, index: number) => (
                  <div
                    key={node.id}
                    {...(node.children
                      ? api.getBranchControlProps({ node, indexPath: [index] })
                      : api.getItemProps({ node, indexPath: [index] }))}
                  >
                    {node.id}
                  </div>
                ))}
              </div>
            )
          : (
              <>
                <button {...api.getTriggerProps()}>Trigger</button>
                {kind === 'combobox' && <input {...api.getInputProps()} />}
                <div {...api.getPositionerProps()}>
                  <div {...api.getContentProps()}>
                    {api.collection.items.map((item: string) => (
                      <div key={item} {...api.getItemProps({ item })}>{item}</div>
                    ))}
                  </div>
                </div>
              </>
            )}
      </div>
    )
  }
  const render = async (next: any) => act(async () => root.render(createElement(Harness, next)))
  await render(props)
  return {
    container,
    render,
    get api() {
      return current! as any
    },
  }
}

const callbackKeys = {
  combobox: ['onValueChange', 'onInputValueChange', 'onHighlightChange', 'onOpenChange'],
  select: ['onValueChange', 'onHighlightChange', 'onOpenChange'],
  tree: ['onFocusChange', 'onExpandedChange', 'onSelectionChange'],
}

async function exercise(kind: Kind, harness: Awaited<ReturnType<typeof mount>>, alternate: boolean) {
  await act(async () => {
    if (kind === 'tree') {
      harness.api.setExpandedValue(alternate ? [] : ['branch'])
      harness.api.setSelectedValue([alternate ? 'branch' : 'beta'])
      harness.api.focus(alternate ? 'branch' : 'beta')
    }
    else {
      harness.api.setValue([alternate ? 'alpha' : 'beta'])
      harness.api.setOpen(true)
      if (kind === 'combobox') {
        harness.api.setInputValue(alternate ? 'second input' : 'first input')
        harness.api.setHighlightValue(alternate ? 'alpha' : 'beta')
      }
    }
  })
  if (kind === 'select') {
    await act(async () => {
      const item = harness.container.querySelector<HTMLElement>(`[data-part="item"][data-value="${alternate ? 'alpha' : 'beta'}"]`)!
      item.dispatchEvent(new PointerEvent('pointermove', { bubbles: true, pointerType: 'mouse' }))
    })
  }
  if (kind !== 'tree')
    await act(async () => harness.api.setOpen(false))
}

describe.each(['combobox', 'select', 'tree'] as const)('%s collection context hook structure', (kind) => {
  it('keeps hook order, latest callback ownership and mounted state through absent/added/replaced/removed callbacks', async () => {
    const collection = makeCollection(kind)
    const base = { collection, positioning: { placement: 'bottom' } }
    const harness = await mount(kind, base)
    const element = harness.container.firstElementChild
    const input = harness.container.querySelector<HTMLInputElement>('[data-testid="retained"]')!
    input.value = 'user edit'
    await exercise(kind, harness, false)
    const first = Object.fromEntries(callbackKeys[kind].map(key => [key, vi.fn()]))
    const second = Object.fromEntries(callbackKeys[kind].map(key => [key, vi.fn()]))
    for (const [callbacks, alternate] of [[first, true], [second, false]] as const) {
      await harness.render({ ...base, ...callbacks })
      expect(harness.api.collection).toBe(collection)
      expect(harness.container.firstElementChild).toBe(element)
      expect(harness.container.querySelector('[data-testid="retained"]')).toBe(input)
      expect(input.value).toBe('user edit')
      await exercise(kind, harness, alternate)
      for (const key of callbackKeys[kind])
        expect(callbacks[key], key).toHaveBeenCalled()
      if (callbacks === first)
        Object.values(first).forEach(callback => callback.mockClear())
      else
        Object.values(first).forEach(callback => expect(callback).not.toHaveBeenCalled())
    }
    Object.values(second).forEach(callback => callback.mockClear())
    await harness.render(base)
    await exercise(kind, harness, true)
    Object.values(second).forEach(callback => expect(callback).not.toHaveBeenCalled())
    expect(harness.api.collection).toBe(collection)
    expect(harness.container.firstElementChild).toBe(element)
    expect(input.value).toBe('user edit')
  })

  it('retains immediate versus microtask callback delivery and operation order', async () => {
    const trace: string[] = []
    const callbacks = Object.fromEntries(callbackKeys[kind].map(key => [key, () => trace.push(key)]))
    const harness = await mount(kind, { collection: makeCollection(kind), ...callbacks })
    trace.length = 0
    await act(async () => {
      trace.push('before')
      if (kind === 'combobox') {
        harness.api.setInputValue('typed')
        harness.api.setHighlightValue('beta')
        expect(trace).toEqual(['before', 'onHighlightChange'])
      }
      else if (kind === 'select') {
        harness.api.setValue(['beta'])
        harness.api.setOpen(true)
        expect(trace).toEqual(['before', 'onOpenChange'])
      }
      else {
        harness.api.setExpandedValue(['branch'])
        harness.api.setSelectedValue(['beta'])
        harness.api.focus('beta')
        expect(trace).toEqual(['before', 'onFocusChange'])
      }
      trace.push('after')
      await Promise.resolve()
      const deferred = kind === 'combobox' ? ['onInputValueChange'] : kind === 'select' ? ['onValueChange'] : ['onExpandedChange', 'onSelectionChange']
      expect(trace).toEqual(['before', kind === 'combobox' ? 'onHighlightChange' : kind === 'select' ? 'onOpenChange' : 'onFocusChange', 'after', ...deferred])
    })
  })

  it('preserves the collection instance until replacement without resetting uncontrolled state or controlled ownership', async () => {
    const collection = makeCollection(kind)
    const harness = await mount(kind, { collection })
    const change = (value: string[]) => kind === 'tree' ? harness.api.setSelectedValue(value) : harness.api.setValue(value)
    const read = () => kind === 'tree' ? harness.api.selectedValue : harness.api.value
    await act(async () => change(['beta']))
    await harness.render({ collection, disabled: true })
    expect(harness.api.collection).toBe(collection)
    expect(read()).toEqual(['beta'])
    const replacement = makeCollection(kind, '-new')
    await harness.render({ collection: replacement })
    expect(harness.api.collection).toBe(replacement)
    expect(read()).toEqual(['beta'])
    const callback = vi.fn()
    const controlled = kind === 'tree' ? { selectedValue: ['beta-new'], onSelectionChange: callback } : { value: ['beta-new'], onValueChange: callback }
    await harness.render({ collection: replacement, ...controlled })
    await act(async () => change(['alpha-new']))
    expect(callback).toHaveBeenLastCalledWith(expect.objectContaining({ [kind === 'tree' ? 'selectedValue' : 'value']: ['alpha-new'] }))
    expect(read()).toEqual(['beta-new'])
    await harness.render({ collection: replacement, ...controlled, [kind === 'tree' ? 'selectedValue' : 'value']: ['alpha-new'] })
    expect(read()).toEqual(['alpha-new'])
    expect(harness.api.collection).toBe(replacement)
  })
})
