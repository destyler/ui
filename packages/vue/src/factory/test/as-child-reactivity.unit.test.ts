import type { ComponentPublicInstance } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import { createApp, h, nextTick, ref } from 'vue'
import { Presence } from '~/components/presence'

describe('reactive asChild composition', () => {
  it.each([false, true])('updates a public wrapper in both directions from asChild=%s', async (initial) => {
    const asChild = ref(initial)
    const exposed = ref<ComponentPublicInstance | null>(null)
    const childRef = ref<HTMLButtonElement | null>(null)
    const label = ref('Target')
    const childRefs: (Element | ComponentPublicInstance | null)[] = []
    const setChildRef = (element: Element | ComponentPublicInstance | null) => {
      childRefs.push(element)
      childRef.value = element as HTMLButtonElement | null
    }
    const container = document.createElement('div')
    document.body.append(container)
    const parentClick = vi.fn()
    const childClick = vi.fn()
    const app = createApp(() => h(Presence, {
      'ref': exposed,
      'present': true,
      'asChild': asChild.value,
      'class': 'parent',
      'data-parent': 'retained',
      'onClick': parentClick,
    }, () => h('button', { type: 'button', class: 'child', ref: setChildRef, onClick: childClick }, label.value)))
    try {
      app.mount(container)
      await nextTick()
      let previousRoot: HTMLElement | undefined
      let previousButton: HTMLButtonElement | undefined
      for (const [index, next] of [initial, !initial, initial].entries()) {
        const refsBeforeSwitch = childRefs.length
        asChild.value = next
        await nextTick()
        const root = container.firstElementChild as HTMLElement
        expect(root.tagName).toBe(next ? 'BUTTON' : 'DIV')
        expect(exposed.value?.$el).toBe(root)
        expect(root.getAttribute('data-parent')).toBe('retained')
        expect(root.getAttribute('data-scope')).toBe('presence')
        expect(root.classList.contains('parent')).toBe(true)
        expect(root.classList.contains('child')).toBe(next)
        const button = container.querySelector('button')!
        expect(childRef.value).toBe(button)
        if (index > 0) {
          expect(root).not.toBe(previousRoot)
          expect(button).not.toBe(previousButton)
          expect(previousRoot!.isConnected).toBe(false)
          expect(previousButton!.isConnected).toBe(false)
          expect(childRefs.slice(refsBeforeSwitch)).toContain(null)
          expect(childRefs.at(-1)).toBe(button)
        }
        previousRoot = root
        previousButton = button
        button.focus()
        label.value = `Target ${index}`
        await nextTick()
        expect(container.firstElementChild).toBe(root)
        expect(childRef.value).toBe(button)
        expect(document.activeElement).toBe(button)
        expect(button.textContent).toBe(label.value)
        button.click()
        expect(parentClick).toHaveBeenCalledTimes(index + 1)
        expect(childClick).toHaveBeenCalledTimes(index + 1)
        expect(container.querySelectorAll('button')).toHaveLength(1)
      }
    }
    finally {
      app.unmount()
      container.remove()
    }
    expect(exposed.value).toBeNull()
    expect(childRef.value).toBeNull()
    expect(childRefs.at(-1)).toBeNull()
  })
})
