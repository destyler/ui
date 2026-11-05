import type { Component, ComponentPublicInstance, FunctionalComponent } from 'vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createApp, createSSRApp, defineComponent, h, nextTick, ref, shallowRef } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { ui } from '~/factory'
import VoidSlotWrapper from './fixtures/VoidSlotWrapper.vue'

const factory = ui as unknown as (component: Component | string) => Component
const disposers: (() => void)[] = []

afterEach(() => {
  disposers.splice(0).reverse().forEach(dispose => dispose())
  vi.restoreAllMocks()
})

function container() {
  const element = document.createElement('div')
  document.body.append(element)
  disposers.push(() => element.remove())
  return element
}

function mount(render: () => ReturnType<typeof h>) {
  const element = container()
  const app = createApp({ render })
  app.mount(element)
  disposers.push(() => app.unmount())
  return element
}

describe('native void elements', () => {
  it.each(['input', 'hr'] as const)('hydrates a compiled %s wrapper with an absent forwarded slot', async (tag) => {
    const value = ref('seed')
    const label = ref('Before')
    const exposed = shallowRef<ComponentPublicInstance | null>(null)
    const input = vi.fn()
    const click = vi.fn()
    const render = () => h(VoidSlotWrapper, {
      'tag': tag,
      'ref': exposed,
      'value': value.value,
      'aria-label': label.value,
      'data-consumer': 'retained',
      'class': 'consumer',
      'onInput': input,
      'onClick': click,
    })
    const element = container()
    element.innerHTML = await renderToString(createSSRApp({ render }))
    const serverElement = element.querySelector(tag)!
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})
    const app = createSSRApp({ render })
    const warnings = vi.fn()
    const errors = vi.fn()
    app.config.warnHandler = warnings
    app.config.errorHandler = errors
    disposers.push(() => app.unmount())
    app.mount(element)
    await nextTick()
    expect(element.querySelector(tag)).toBe(serverElement)
    expect(exposed.value?.$el).toBe(serverElement)
    expect(serverElement.childNodes).toHaveLength(0)
    expect(serverElement.getAttribute('aria-label')).toBe('Before')
    expect(serverElement.getAttribute('data-consumer')).toBe('retained')
    expect(serverElement.className).toBe('consumer')
    if (tag === 'input')
      expect((serverElement as HTMLInputElement).value).toBe('seed')
    serverElement.dispatchEvent(new Event('input', { bubbles: true }))
    serverElement.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    expect(input).toHaveBeenCalledTimes(1)
    expect(click).toHaveBeenCalledTimes(1)
    value.value = 'updated'
    label.value = 'After'
    await nextTick()
    expect(element.querySelector(tag)).toBe(serverElement)
    expect(exposed.value?.$el).toBe(serverElement)
    expect(serverElement.getAttribute('aria-label')).toBe('After')
    if (tag === 'input')
      expect((serverElement as HTMLInputElement).value).toBe('updated')
    expect(warnings).not.toHaveBeenCalled()
    expect(errors).not.toHaveBeenCalled()
    expect(warn).not.toHaveBeenCalled()
    expect(error).not.toHaveBeenCalled()
    app.unmount()
    disposers.pop()
    expect(exposed.value).toBeNull()
    expect(element.childNodes).toHaveLength(0)
  })

  it.each(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'] as const)(
    'does not invoke or attach children of native %s',
    (tag) => {
      const slot = vi.fn(() => [h('span', 'invalid child')])
      const element = mount(() => h(ui[tag], { 'data-void': tag }, { default: slot }))
      expect(slot).not.toHaveBeenCalled()
      expect(element.firstElementChild?.tagName.toLowerCase()).toBe(tag)
      expect(element.firstElementChild?.childNodes).toHaveLength(0)
    },
  )
})

it.each(['div', 'textarea', 'svg', 'custom-input', 'Input'])('preserves children for %s', async (tag) => {
  const text = ref('Before')
  const component = factory(tag)
  const element = mount(() => h(component, null, () => text.value))
  expect(element.firstElementChild?.textContent).toBe('Before')
  text.value = 'After'
  await nextTick()
  expect(element.firstElementChild?.textContent).toBe('After')
})

it.each(['object', 'functional'] as const)('preserves slots on a %s component named input', async (kind) => {
  const functional: FunctionalComponent = (_props, { slots }) => h('section', slots.default?.())
  Object.defineProperty(functional, 'name', { value: 'input' })
  const object = defineComponent({
    name: 'input',
    setup: (_props, { slots }) => () => h('section', slots.default?.()),
  })
  const component = factory(kind === 'object' ? object : functional)
  const text = ref('Before')
  const element = mount(() => h(component, null, () => h('span', text.value)))
  expect(element.querySelector('section > span')?.textContent).toBe('Before')
  text.value = 'After'
  await nextTick()
  expect(element.querySelector('section > span')?.textContent).toBe('After')
})

it.each(['input', 'hr'] as const)('preserves %s asChild composition while switching reactively', async (tag) => {
  const asChild = ref(true)
  const text = ref('Before')
  const parentClick = vi.fn()
  const childClick = vi.fn()
  const childRef = shallowRef<HTMLButtonElement | null>(null)
  const slot = vi.fn(() => h('button', {
    'ref': childRef,
    'class': 'child',
    'data-child': 'retained',
    'onClick': childClick,
  }, text.value))
  const element = mount(() => h(ui[tag], {
    'asChild': asChild.value,
    'class': 'parent',
    'data-parent': 'retained',
    'onClick': parentClick,
  }, { default: slot }))
  for (const next of [true, false, true]) {
    const callsBefore = slot.mock.calls.length
    asChild.value = next
    await nextTick()
    const root = element.firstElementChild as HTMLElement
    expect(root.tagName).toBe(next ? 'BUTTON' : tag.toUpperCase())
    expect(root.getAttribute('data-parent')).toBe('retained')
    expect(root.classList.contains('parent')).toBe(true)
    if (next) {
      expect(root.getAttribute('data-child')).toBe('retained')
      expect(root.classList.contains('child')).toBe(true)
      expect(childRef.value).toBe(root)
      text.value += '!'
      await nextTick()
      expect(root.textContent).toBe(text.value)
      root.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    }
    else {
      expect(slot).toHaveBeenCalledTimes(callsBefore)
      expect(root.childNodes).toHaveLength(0)
      expect(childRef.value).toBeNull()
    }
  }
  expect(parentClick).toHaveBeenCalledTimes(2)
  expect(childClick).toHaveBeenCalledTimes(2)
})

it('switches dynamic factory components between input and div without leaking children or refs', async () => {
  const tag = ref<'input' | 'div'>('input')
  const text = ref('Before')
  const exposed = shallowRef<ComponentPublicInstance | null>(null)
  const childRef = shallowRef<HTMLSpanElement | null>(null)
  const slot = vi.fn(() => h('span', { ref: childRef }, text.value))
  // Selecting the h() component is the render-function equivalent of <component :is="ui[tag]">.
  const element = mount(() => h(ui[tag.value], { ref: exposed, title: text.value }, { default: slot }))
  let previousRoot: Element | null = null
  let previousInstance: ComponentPublicInstance | null = null
  for (const next of ['input', 'div', 'input', 'div'] as const) {
    const callsBefore = slot.mock.calls.length
    tag.value = next
    await nextTick()
    const root = element.firstElementChild!
    expect(root.tagName.toLowerCase()).toBe(next)
    expect(exposed.value?.$el).toBe(root)
    if (previousRoot) {
      expect(root).not.toBe(previousRoot)
      expect(previousRoot.isConnected).toBe(false)
      expect(exposed.value).not.toBe(previousInstance)
    }
    if (next === 'input') {
      expect(slot).toHaveBeenCalledTimes(callsBefore)
      expect(root.childNodes).toHaveLength(0)
      expect(childRef.value).toBeNull()
    }
    else {
      expect(childRef.value).toBe(root.firstElementChild)
      expect(root.textContent).toBe(text.value)
    }
    previousInstance = exposed.value
    text.value += '!'
    await nextTick()
    expect(element.firstElementChild).toBe(root)
    expect(exposed.value).toBe(previousInstance)
    expect(root.getAttribute('title')).toBe(text.value)
    if (next === 'input') {
      expect(slot).toHaveBeenCalledTimes(callsBefore)
      expect(root.childNodes).toHaveLength(0)
    }
    else {
      expect(root.textContent).toBe(text.value)
      expect(childRef.value).toBe(root.firstElementChild)
    }
    previousRoot = root
  }
  disposers.pop()!()
  expect(exposed.value).toBeNull()
  expect(childRef.value).toBeNull()
})

it('retains div children when the native is attribute is input', async () => {
  const text = ref('Before')
  const slot = vi.fn(() => h('span', text.value))
  const element = mount(() => h(ui.div, { is: 'input' }, { default: slot }))
  const root = element.firstElementChild!
  expect(root.tagName).toBe('DIV')
  expect(root.getAttribute('is')).toBe('input')
  expect(slot).toHaveBeenCalledTimes(1)
  expect(root.querySelector('span')?.textContent).toBe('Before')
  text.value = 'After'
  await nextTick()
  expect(element.firstElementChild).toBe(root)
  expect(root.querySelector('span')?.textContent).toBe('After')
})
