import { describe, expect, it, vi } from 'vitest'
import { createApp, h, nextTick } from 'vue'
import { Toggle } from '~/components/toggle'

describe('vue asChild event handler arrays', () => {
  it.each(['child', 'parent', 'both'] as const)('preserves the toggle action with %s handler arrays', async (arrays) => {
    const container = document.createElement('div')
    document.body.append(container)
    const order: string[] = []
    const parent = vi.fn(() => order.push('parent'))
    const child = vi.fn(() => order.push('child'))
    const parentSecond = vi.fn(() => order.push('parentSecond'))
    const childSecond = vi.fn(() => order.push('childSecond'))
    const changed = vi.fn((value: boolean) => order.push(`changed:${value}`))
    const app = createApp(() => h(Toggle.Root, {
      asChild: true,
      onPressedChange: changed,
      onClick: arrays === 'child' ? parent : [parent, parentSecond],
    }, () => h('button', { onClick: arrays === 'parent' ? child : [child, childSecond] }, 'Toggle')))
    try {
      app.mount(container)
      await nextTick()
      const button = container.querySelector('button')!
      expect(button.getAttribute('aria-pressed')).toBe('false')
      button.click()
      await nextTick()
      expect(parent).toHaveBeenCalledTimes(1)
      expect(child).toHaveBeenCalledTimes(1)
      expect(parentSecond).toHaveBeenCalledTimes(arrays === 'child' ? 0 : 1)
      expect(childSecond).toHaveBeenCalledTimes(arrays === 'parent' ? 0 : 1)
      expect(button.getAttribute('aria-pressed')).toBe('true')
      expect(changed).toHaveBeenCalledExactlyOnceWith(true)
      expect(order).toEqual(['child', ...(arrays === 'parent' ? [] : ['childSecond']), 'parent', ...(arrays === 'child' ? [] : ['parentSecond']), 'changed:true'])
      button.click()
      await nextTick()
      expect(button.getAttribute('aria-pressed')).toBe('false')
      expect(changed.mock.calls).toEqual([[true], [false]])
      expect(parent).toHaveBeenCalledTimes(2)
      expect(child).toHaveBeenCalledTimes(2)
    }
    finally {
      app.unmount()
      container.remove()
    }
  })
})

it('retains the ordinary child-handler-only path', async () => {
  const container = document.createElement('div')
  document.body.append(container)
  const child = vi.fn()
  const changed = vi.fn()
  const app = createApp(() => h(Toggle.Root, { asChild: true, onPressedChange: changed }, () => h('button', { onClick: child }, 'Toggle')))
  try {
    app.mount(container)
    const button = container.querySelector('button')!
    button.click()
    await nextTick()
    expect(button.getAttribute('aria-pressed')).toBe('true')
    expect(child).toHaveBeenCalledTimes(1)
    expect(changed).toHaveBeenCalledExactlyOnceWith(true)
  }
  finally {
    app.unmount()
    container.remove()
  }
})

it.each(['preventDefault', 'stopImmediatePropagation'] as const)('preserves native Vue %s semantics for handler arrays', async (method) => {
  const container = document.createElement('div')
  document.body.append(container)
  const order: string[] = []
  const changed = vi.fn()
  const first = (event: MouseEvent) => {
    order.push('first')
    event[method]()
  }
  const app = createApp(() => h(Toggle.Root, { asChild: true, onPressedChange: changed, onClick: () => order.push('parent') }, () => h('button', { onClick: [first, () => order.push('second')] }, 'Toggle')))
  try {
    app.mount(container)
    const button = container.querySelector('button')!
    button.click()
    await nextTick()
    expect(button.getAttribute('aria-pressed')).toBe('false')
    expect(changed).not.toHaveBeenCalled()
    expect(order).toEqual(method === 'preventDefault' ? ['first', 'second', 'parent'] : ['first'])
  }
  finally {
    app.unmount()
    container.remove()
  }
})

it.each(['sync', 'async'] as const)('retains Vue error handling for a %s array listener without skipping later handlers', async (mode) => {
  const container = document.createElement('div')
  document.body.append(container)
  const failure = new Error('Expected listener failure')
  const errors = vi.fn()
  const second = vi.fn()
  const parent = vi.fn()
  const changed = vi.fn()
  const first = mode === 'async'
    ? async () => { throw failure }
    : () => { throw failure }
  const app = createApp(() => h(Toggle.Root, { asChild: true, onPressedChange: changed, onClick: parent }, () => h('button', { onClick: [first, second] }, 'Toggle')))
  app.config.errorHandler = errors
  try {
    app.mount(container)
    const button = container.querySelector('button')!
    button.click()
    await nextTick()
    await vi.waitFor(() => expect(errors).toHaveBeenCalledTimes(1))
    expect(errors.mock.calls[0][0]).toBe(failure)
    expect(second).toHaveBeenCalledTimes(1)
    expect(parent).toHaveBeenCalledTimes(1)
    expect(button.getAttribute('aria-pressed')).toBe('true')
    expect(changed).toHaveBeenCalledExactlyOnceWith(true)
  }
  finally {
    app.unmount()
    container.remove()
  }
})
