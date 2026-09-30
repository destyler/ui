import type { App } from 'vue'
import { afterEach, describe, expect, it } from 'vitest'
import { createApp, nextTick, reactive } from 'vue'
import { controlledMenu, entries, initialCases } from './fixtures/controlled-menu'

const mounts: { app: App, container: HTMLElement }[] = []
afterEach(() => {
  mounts.splice(0).forEach(({ app, container }) => {
    app.unmount()
    container.remove()
  })
})

async function flush() {
  for (let i = 0; i < 5; i++) {
    await nextTick()
    await Promise.resolve()
  }
}

function assertApi(api: any, value: string | null) {
  expect(api.value).toBe(value)
  expect(api.open).toBe(Boolean(value))
  expect(api.getViewportPositionerProps()['data-state']).toBe(value ? 'open' : 'closed')
  for (const item of ['one', 'two']) {
    expect(api.getTriggerProps({ value: item })['data-state']).toBe(item === value ? 'open' : 'closed')
    expect(api.getContentState({ value: item }).open).toBe(item === value)
    expect(api.getContentProps({ value: item })['data-state']).toBe(item === value ? 'open' : 'closed')
  }
}

function assertDom(container: HTMLElement, value: string | null) {
  expect(container.querySelector('output')?.getAttribute('data-value')).toBe(String(value))
  expect(container.querySelector('output')?.getAttribute('data-open')).toBe(String(Boolean(value)))
  expect(container.querySelector('[data-part="viewport-positioner"]')?.getAttribute('data-state')).toBe(value ? 'open' : 'closed')
  for (const part of ['trigger', 'content']) {
    const elements = [...container.querySelectorAll<HTMLElement>(`[data-part="${part}"]`)]
    expect(elements).toHaveLength(2)
    elements.forEach((element, index) => {
      const open = ['one', 'two'][index] === value
      expect(element.getAttribute('data-state')).toBe(open ? 'open' : 'closed')
      if (part === 'content')
        expect(element.hidden).toBe(!open)
      else
        expect(element.getAttribute('aria-expanded')).toBe(String(open))
    })
  }
}

describe('navigationMenu live value wins before machine initialization', () => {
  for (const entry of entries) {
    it.each(initialCases)(`${entry}: $name live value agrees with API and every mounted part`, async ({ modelValue, expected }) => {
      const props = reactive({ modelValue, defaultValue: 'one' })
      let api: any
      let first = true
      const container = document.createElement('div')
      document.body.append(container)
      const app = createApp(controlledMenu(entry, props, (value) => {
        api = value
        if (first) {
          first = false
          assertApi(api, expected)
        }
      }))
      mounts.push({ app, container })
      app.mount(container)
      await flush()
      assertApi(api, expected)
      assertDom(container, expected)
      props.defaultValue = 'two'
      await flush()
      assertApi(api, expected)
      assertDom(container, expected)
      if (modelValue !== undefined) {
        props.modelValue = 'one'
        await flush()
        assertApi(api, 'one')
        assertDom(container, 'one')
        props.modelValue = null
        await flush()
        assertApi(api, null)
        assertDom(container, null)
      }
    })
  }
})
