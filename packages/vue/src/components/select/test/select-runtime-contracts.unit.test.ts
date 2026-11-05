import type { Component, ComponentPublicInstance, VNode } from 'vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createApp, h, nextTick, shallowReactive } from 'vue'
import { createListCollection } from '~/utils/collection'
import { Select } from '../index'

// These tests mount compiled SFC wrappers and the real Select/Presence machines.
// They cover ordinary same-key listeners, not option-suffixed once/capture/passive.
const parts = ['trigger', 'content', 'item', 'clear', 'label'] as const
type Part = typeof parts[number]
type Attrs = Record<string, unknown>
const fruits = ['Apple', 'Banana', 'Cherry']
const cleanups: Array<() => void> = []
afterEach(() => cleanups.splice(0).forEach(cleanup => cleanup()))

let fixtureId = 0
async function mountSelect(initial: Attrs = {}, asChild = false) {
  const container = document.createElement('div')
  document.body.appendChild(container)
  const root = shallowReactive<Attrs>({ ...initial })
  const attrs = shallowReactive(Object.fromEntries(parts.map(part => [part, {}])) as Record<Part, Attrs>)
  const refs: Partial<Record<Part, ComponentPublicInstance | null>> = {}
  const order: string[] = []
  const openChange = vi.fn((_details: unknown) => order.push('open'))
  const valueChange = vi.fn((_details: unknown) => order.push('value'))
  const highlightChange = vi.fn((_details: unknown) => order.push('highlight'))
  const updateOpen = vi.fn()
  const updateValue = vi.fn()
  const callbacks = { openChange, valueChange, highlightChange, updateOpen, updateValue }
  const id = `select-runtime-${fixtureId++}`
  const collection = createListCollection({ items: fruits })

  function part(component: Component, name: Part, children: () => string | VNode[], props: Attrs = {}) {
    return h(component, {
      ...props,
      ...attrs[name],
      'asChild': asChild,
      'data-testid': name,
      'ref': (value: unknown) => { refs[name] = value as ComponentPublicInstance | null },
    }, () => asChild
      ? h(name === 'trigger' || name === 'clear' ? 'button' : name === 'label' ? 'span' : 'section', {
          'data-child': name,
          'class': 'child-class',
          'style': { padding: '2px' },
        }, children())
      : children())
  }

  const app = createApp({
    render: () => h('div', [
      h('button', { 'data-testid': 'outside' }, 'Outside'),
      h(Select.Root, {
        id,
        collection,
        ...root,
        'onOpenChange': openChange,
        'onValueChange': valueChange,
        'onHighlightChange': highlightChange,
        'onUpdate:open': updateOpen,
        'onUpdate:modelValue': updateValue,
      }, () => [
        part(Select.Label, 'label', () => 'Fruit'),
        part(Select.Trigger, 'trigger', () => [h(Select.ValueText, { placeholder: 'Choose fruit' })]),
        part(Select.ClearTrigger, 'clear', () => 'Clear'),
        h(Select.Positioner, {}, () => part(Select.Content, 'content', () => fruits.map(item => item === 'Banana'
          ? part(Select.Item, 'item', () => item, { item })
          : h(Select.Item, { item }, () => item)))),
        h(Select.HiddenSelect),
      ]),
    ]),
  })
  app.mount(container)
  let mounted = true
  const unmount = () => {
    if (!mounted)
      return
    mounted = false
    app.unmount()
    container.remove()
  }
  cleanups.push(unmount)
  const get = (name: Part | 'outside') => container.querySelector<HTMLElement>(`[data-testid="${name}"]`)!
  const selected = () => Array.from(container.querySelectorAll('[role="option"][aria-selected="true"]'), el => el.textContent)
  const highlighted = () => container.querySelector('[role="option"][data-highlighted]')?.textContent
  const snapshot = () => ({
    expanded: get('trigger').getAttribute('aria-expanded'),
    selected: selected(),
    highlighted: highlighted(),
    activeDescendant: get('content')?.getAttribute('aria-activedescendant'),
  })
  const clearCallbacks = () => {
    Object.values(callbacks).forEach(callback => callback.mockClear())
    order.length = 0
  }
  await nextTick()
  if (initial.defaultOpen || initial.open) {
    // Starting open is not an opening transition. Focus the actual content
    // before dispatching keyboard events rather than assuming mount autofocus.
    get('content').focus()
    await nextTick()
    expect(document.activeElement).toBe(get('content'))
  }
  clearCallbacks()
  return { container, root, attrs, refs, order, callbacks, get, selected, highlighted, snapshot, clearCallbacks, unmount }
}

type Fixture = Awaited<ReturnType<typeof mountSelect>>
const click = (target: HTMLElement, prevented = false) => dispatch(target, new MouseEvent('click', { bubbles: true, cancelable: true, button: 0 }), prevented)
const keydown = (target: HTMLElement, key: string, prevented = false) => dispatch(target, new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }), prevented)
function dispatch(target: HTMLElement, event: Event, prevented: boolean) {
  if (prevented)
    event.preventDefault()
  target.dispatchEvent(event)
  return event
}

const actions = [
  { name: 'Trigger click', part: 'trigger', listener: 'onClick', initial: {}, key: undefined },
  { name: 'focused Trigger ArrowDown', part: 'trigger', listener: 'onKeydown', initial: {}, key: 'ArrowDown' },
  { name: 'Content End', part: 'content', listener: 'onKeydown', initial: { defaultOpen: true }, key: 'End' },
  { name: 'Item click', part: 'item', listener: 'onClick', initial: { defaultOpen: true, defaultValue: ['Apple'] }, key: undefined },
  { name: 'ClearTrigger click', part: 'clear', listener: 'onClick', initial: { defaultValue: ['Apple'] }, key: undefined },
  { name: 'Label click', part: 'label', listener: 'onClick', initial: {}, key: undefined },
] satisfies Array<{ name: string, part: Part, listener: string, initial: Attrs, key?: string }>
type Action = typeof actions[number]

async function prepare(fixture: Fixture, action: Action) {
  if (action.part === 'trigger')
    fixture.get('trigger').focus()
  if (action.part === 'label')
    fixture.get('outside').focus()
  await nextTick()
  fixture.clearCallbacks()
}

function invoke(fixture: Fixture, action: Action, prevented = false) {
  return action.key ? keydown(fixture.get(action.part), action.key, prevented) : click(fixture.get(action.part), prevented)
}

async function expectAccepted(fixture: Fixture, action: Action) {
  const { get, selected, highlighted, callbacks } = fixture
  await vi.waitFor(() => {
    if (action.part === 'trigger') {
      expect(get('trigger').getAttribute('aria-expanded')).toBe('true')
      expect(get('content').hidden).toBe(false)
      expect(callbacks.openChange).toHaveBeenCalledExactlyOnceWith({ open: true })
      expect(callbacks.updateOpen).toHaveBeenCalledExactlyOnceWith(true)
      if (action.key)
        expect(highlighted()).toBe('Apple')
    }
    else if (action.part === 'content') {
      expect(highlighted()).toBe('Cherry')
      expect(get('content').getAttribute('aria-activedescendant')).toBe(
        fixture.container.querySelector('[role="option"][data-highlighted]')?.id,
      )
      expect(callbacks.highlightChange).toHaveBeenCalledTimes(1)
      expect(callbacks.highlightChange.mock.lastCall?.[0]).toMatchObject({ highlightedValue: 'Cherry' })
    }
    else if (action.part === 'item' || action.part === 'clear') {
      const value = action.part === 'item' ? ['Banana'] : []
      expect(selected()).toEqual(value)
      expect(callbacks.valueChange).toHaveBeenCalledTimes(1)
      expect(callbacks.valueChange.mock.lastCall?.[0]).toMatchObject({ value })
      expect(callbacks.updateValue).toHaveBeenCalledExactlyOnceWith(value)
      expect(get('trigger').textContent).toBe(value[0] ?? 'Choose fruit')
      if (action.part === 'item') {
        expect(get('trigger').getAttribute('aria-expanded')).toBe('false')
        expect(callbacks.openChange).toHaveBeenCalledExactlyOnceWith({ open: false })
      }
    }
    else {
      expect(document.activeElement).toBe(get('trigger'))
      expect(get('trigger').getAttribute('aria-expanded')).toBe('false')
      Object.values(callbacks).forEach(callback => expect(callback).not.toHaveBeenCalled())
    }
  })
}

describe.each([false, true])('select real machine, asChild=%s', (asChild) => {
  it.each(actions)('$name is canceled before machine work and accepts the replacement caller once', async (action) => {
    const fixture = await mountSelect(action.initial, asChild)
    await prepare(fixture, action)
    const before = fixture.snapshot()
    const focusedBefore = document.activeElement
    const canceled = vi.fn((event: Event) => {
      fixture.order.push('caller')
      event.preventDefault()
    })
    fixture.attrs[action.part] = { [action.listener]: canceled }
    await nextTick()

    const event = invoke(fixture, action)
    await nextTick()
    expect(canceled).toHaveBeenCalledExactlyOnceWith(event)
    expect(event.defaultPrevented).toBe(true)
    expect(fixture.snapshot()).toEqual(before)
    expect(document.activeElement === focusedBefore).toBe(true)
    expect(fixture.order).toEqual(['caller'])
    Object.values(fixture.callbacks).forEach(callback => expect(callback).not.toHaveBeenCalled())

    const accepted = vi.fn(() => fixture.order.push('replacement'))
    fixture.attrs[action.part] = { [action.listener]: accepted }
    await nextTick()
    const replacementEvent = invoke(fixture, action)
    await expectAccepted(fixture, action)
    expect(canceled).toHaveBeenCalledTimes(1)
    expect(accepted).toHaveBeenCalledExactlyOnceWith(replacementEvent)
    expect(fixture.order.slice(0, 2)).toEqual(['caller', 'replacement'])
  })

  it.each(actions)('$name preserves pre-dispatch native cancellation', async (action) => {
    const fixture = await mountSelect(action.initial, asChild)
    await prepare(fixture, action)
    const before = fixture.snapshot()
    const focusedBefore = document.activeElement
    const event = invoke(fixture, action, true)
    await nextTick()
    expect(event.defaultPrevented).toBe(true)
    expect(fixture.snapshot()).toEqual(before)
    expect(document.activeElement === focusedBefore).toBe(true)
    Object.values(fixture.callbacks).forEach(callback => expect(callback).not.toHaveBeenCalled())
  })

  it.each(actions)('$name still runs the real machine after its caller listener is removed', async (action) => {
    const fixture = await mountSelect(action.initial, asChild)
    await prepare(fixture, action)
    const removed = vi.fn((event: Event) => event.preventDefault())
    fixture.attrs[action.part] = { [action.listener]: removed }
    await nextTick()
    fixture.attrs[action.part] = {}
    await nextTick()
    invoke(fixture, action)
    await expectAccepted(fixture, action)
    expect(removed).not.toHaveBeenCalled()
  })

  it('preserves live attrs, class, style, DOM refs and clean unmount for all five wrappers', async () => {
    const fixture = await mountSelect({ defaultOpen: true, defaultValue: ['Apple'] }, asChild)
    for (const part of parts) {
      fixture.attrs[part] = { 'title': 'before', 'data-current': 'before', 'class': 'before-class', 'style': { color: 'red' } }
    }
    await nextTick()
    for (const part of parts) {
      expect(fixture.refs[part]?.$el).toBe(fixture.get(part))
      expect(fixture.get(part).getAttribute('title')).toBe('before')
      expect(fixture.get(part).classList.contains('before-class')).toBe(true)
      expect(fixture.get(part).style.color).toBe('red')
      fixture.attrs[part] = { 'title': 'after', 'data-current': 'after', 'class': 'after-class', 'style': { color: 'blue' } }
    }
    await nextTick()
    for (const part of parts) {
      const element = fixture.get(part)
      expect(fixture.refs[part]?.$el).toBe(element)
      expect(element.getAttribute('title')).toBe('after')
      expect(element.getAttribute('data-current')).toBe('after')
      expect(element.classList.contains('before-class')).toBe(false)
      expect(element.classList.contains('after-class')).toBe(true)
      expect(element.style.color).toBe('blue')
      expect(element.getAttribute('data-scope')).toBe('select')
      if (asChild) {
        expect(element.getAttribute('data-child')).toBe(part)
        expect(element.classList.contains('child-class')).toBe(true)
        expect(element.style.padding).toBe('2px')
      }
    }
    expect(fixture.get('trigger').getAttribute('aria-expanded')).toBe('true')
    expect(fixture.get('content').getAttribute('role')).toBe('listbox')
    expect(fixture.get('item').getAttribute('role')).toBe('option')
    fixture.clearCallbacks()
    fixture.unmount()
    await nextTick()
    expect(fixture.container.isConnected).toBe(false)
    for (const part of parts)
      expect(fixture.refs[part]).toBeNull()
    keydown(document.body, 'Escape')
    click(document.body)
    await nextTick()
    Object.values(fixture.callbacks).forEach(callback => expect(callback).not.toHaveBeenCalled())
  })
})

it('keeps controlled open/value requests separate from delayed acceptance and veto', async () => {
  const fixture = await mountSelect({ open: false, modelValue: ['Apple'] })
  click(fixture.get('trigger'))
  await nextTick()
  expect(fixture.callbacks.openChange).toHaveBeenCalledExactlyOnceWith({ open: true })
  expect(fixture.callbacks.updateOpen).toHaveBeenCalledExactlyOnceWith(true)
  expect(fixture.get('trigger').getAttribute('aria-expanded')).toBe('false')
  expect(fixture.get('content').hidden).toBe(true)
  expect(fixture.selected()).toEqual(['Apple'])

  // The parent accepts the request only on a later render.
  fixture.root.open = true
  await nextTick()
  await vi.waitFor(() => expect(document.activeElement).toBe(fixture.get('content')))
  expect(fixture.get('trigger').getAttribute('aria-expanded')).toBe('true')
  fixture.clearCallbacks()
  click(fixture.get('item'))
  await nextTick()
  expect(fixture.callbacks.valueChange).toHaveBeenCalledTimes(1)
  expect(fixture.callbacks.valueChange.mock.lastCall?.[0]).toMatchObject({ value: ['Banana'] })
  expect(fixture.callbacks.updateValue).toHaveBeenCalledExactlyOnceWith(['Banana'])
  expect(fixture.callbacks.openChange).toHaveBeenCalledExactlyOnceWith({ open: false })
  expect(fixture.selected()).toEqual(['Apple'])
  expect(fixture.get('trigger').getAttribute('aria-expanded')).toBe('true')

  // An unrelated render while retaining the old values is a parent veto.
  fixture.attrs.trigger = { title: 'still controlled' }
  await nextTick()
  expect(fixture.selected()).toEqual(['Apple'])
  expect(fixture.get('trigger').getAttribute('aria-expanded')).toBe('true')
  fixture.root.modelValue = ['Banana']
  fixture.root.open = false
  await nextTick()
  await vi.waitFor(() => expect(fixture.get('content').hidden).toBe(true))
  expect(fixture.selected()).toEqual(['Banana'])
  expect(fixture.get('trigger').textContent).toBe('Banana')
  expect(fixture.callbacks.valueChange).toHaveBeenCalledTimes(1)
  expect(fixture.callbacks.openChange).toHaveBeenCalledTimes(1)
})

it.each([false, true])('retains lazyMount/unmountOnExit and current listeners through reopening, asChild=%s', async (asChild) => {
  const fixture = await mountSelect({ lazyMount: true, unmountOnExit: true }, asChild)
  expect(fixture.get('content')).toBeNull()
  click(fixture.get('trigger'))
  await vi.waitFor(() => {
    expect(fixture.get('content')).not.toBeNull()
    expect(document.activeElement).toBe(fixture.get('content'))
  })
  const oldContent = fixture.get('content')
  const canceled = vi.fn((event: Event) => event.preventDefault())
  fixture.attrs.content = { onKeydown: canceled }
  await nextTick()
  keydown(oldContent, 'End')
  await nextTick()
  expect(fixture.highlighted()).toBeUndefined()
  expect(canceled).toHaveBeenCalledTimes(1)

  click(fixture.get('trigger'))
  await vi.waitFor(() => expect(fixture.get('content')).toBeNull())
  expect(oldContent.isConnected).toBe(false)
  expect(fixture.refs.content).toBeNull()
  fixture.attrs.content = { title: 'reopened' }
  click(fixture.get('trigger'))
  await vi.waitFor(() => {
    expect(fixture.get('content')).not.toBeNull()
    expect(document.activeElement).toBe(fixture.get('content'))
  })
  expect(fixture.get('content')).not.toBe(oldContent)
  expect(fixture.refs.content?.$el).toBe(fixture.get('content'))
  expect(fixture.get('content').getAttribute('title')).toBe('reopened')
  keydown(fixture.get('content'), 'End')
  await vi.waitFor(() => expect(fixture.highlighted()).toBe('Cherry'))
  expect(canceled).toHaveBeenCalledTimes(1)
  click(fixture.get('item'))
  await vi.waitFor(() => expect(fixture.get('content')).toBeNull())
  expect(fixture.get('trigger').textContent).toBe('Banana')
  expect(fixture.callbacks.updateValue).toHaveBeenCalledExactlyOnceWith(['Banana'])
  expect(fixture.callbacks.updateOpen.mock.calls).toEqual([[true], [false], [true], [false]])
})

it.each([false, true])('forwards Content into Presence and cleans synthetic exit-animation listeners, asChild=%s', async (asChild) => {
  const fixture = await mountSelect({ defaultOpen: true, lazyMount: true, unmountOnExit: true }, asChild)
  const animationEvent = (name: string) => {
    const event = new Event('animationend', { bubbles: true })
    Object.defineProperty(event, 'animationName', { value: name })
    return event
  }

  async function suspendExit() {
    const content = fixture.get('content')
    // Happy DOM does not run CSS animations. Supply computed animation styles
    // and dispatch native events to exercise real Presence lifecycle wiring.
    content.style.animationName = 'select-test-exit'
    content.style.animationDuration = '10s'
    const add = vi.spyOn(content, 'addEventListener')
    const remove = vi.spyOn(content, 'removeEventListener')
    click(fixture.get('trigger'))
    await vi.waitFor(() => expect(add.mock.calls.some(([type]) => type === 'animationend')).toBe(true))
    expect(fixture.get('content') === content).toBe(true)
    expect(content.getAttribute('data-state')).toBe('closed')
    expect(content.hidden).toBe(false)
    expect(fixture.refs.content?.$el === content).toBe(true)
    return { content, add, remove }
  }

  const first = await suspendExit()
  fixture.get('item').dispatchEvent(animationEvent('select-test-exit'))
  first.content.dispatchEvent(animationEvent('unrelated-animation'))
  await nextTick()
  expect(fixture.get('content') === first.content).toBe(true)
  first.content.dispatchEvent(animationEvent('select-test-exit'))
  await vi.waitFor(() => expect(fixture.get('content')).toBeNull())
  expect(first.content.isConnected).toBe(false)
  expect(fixture.refs.content).toBeNull()
  for (const type of ['animationstart', 'animationcancel', 'animationend']) {
    const handler = first.add.mock.calls.find(([event]) => event === type)?.[1]
    expect(handler).toBeTypeOf('function')
    expect(first.remove).toHaveBeenCalledWith(type, handler)
  }

  click(fixture.get('trigger'))
  await vi.waitFor(() => {
    expect(fixture.get('content')).not.toBeNull()
    expect(document.activeElement === fixture.get('content')).toBe(true)
  })
  expect(fixture.get('content') === first.content).toBe(false)
  const second = await suspendExit()
  fixture.clearCallbacks()
  fixture.unmount()
  await nextTick()
  expect(fixture.refs.content).toBeNull()
  for (const type of ['animationstart', 'animationcancel', 'animationend']) {
    const handler = second.add.mock.calls.find(([event]) => event === type)?.[1]
    expect(handler).toBeTypeOf('function')
    expect(second.remove).toHaveBeenCalledWith(type, handler)
  }
  first.content.dispatchEvent(animationEvent('select-test-exit'))
  second.content.dispatchEvent(animationEvent('select-test-exit'))
  await nextTick()
  Object.values(fixture.callbacks).forEach(callback => expect(callback).not.toHaveBeenCalled())
})
