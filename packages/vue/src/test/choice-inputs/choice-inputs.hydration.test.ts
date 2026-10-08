import type { ComponentPublicInstance } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import { createSSRApp, nextTick } from 'vue'
import { ChoiceInputsFixture, families } from './ChoiceInputsFixture'
import serverMarkup from './server-markup.json'

describe.each(families)('%s hidden input hydration', (family) => {
  it.each([false, true])('preserves genuine server nodes, control state and slot identity with asChild=%s', async (asChild) => {
    const target = document.createElement('div')
    target.innerHTML = serverMarkup[`${family}-${asChild}`]
    document.body.append(target)
    const inputs = Array.from(target.querySelectorAll<HTMLInputElement>('input'))
    const errors = vi.spyOn(console, 'error').mockImplementation(() => {})
    const warnings = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const onChange = vi.fn()
    const refs = new Map<string, Element | ComponentPublicInstance | null>()
    const app = createSSRApp(ChoiceInputsFixture, { family, asChild, onChange, onInputRef: (key: string, input: Element | ComponentPublicInstance | null) => refs.set(key, input) })
    app.mount(target)
    try {
      for (let turn = 0; turn < 4; turn++)
        await nextTick()
      expect(warnings.mock.calls.map(call => String(call[0]))).toEqual([])
      expect(errors.mock.calls.map(call => String(call[0]))).toEqual([])
      for (const [index, input] of Array.from(target.querySelectorAll('input')).entries())
        expect(input).toBe(inputs[index])
      expect(target.querySelectorAll('input').length).toBe(family === 'radio' ? 2 : 1)
      expect(onChange).not.toHaveBeenCalled()
      for (const [index, key] of (family === 'radio' ? ['one', 'two'] : ['one']).entries()) {
        const exposed = refs.get(key)!
        expect('$el' in exposed ? exposed.$el : exposed).toBe(inputs[index])
      }
      for (const input of inputs) {
        expect(input.hasAttribute('data-custom-input')).toBe(asChild)
        expect(input.childNodes.length).toBe(0)
      }
      expect(Array.from(new FormData(target.querySelector('form')!).entries())).toEqual([['answer', 'one']])
      inputs.at(-1)!.click()
      for (let turn = 0; turn < 5; turn++)
        await nextTick()
      expect(onChange.mock.calls).toEqual([[family === 'radio' ? { value: 'two' } : { checked: false }]])
      expect(inputs[0].checked).toBe(true)
      if (family === 'radio')
        expect(inputs[1].checked).toBe(false)
      expect(Array.from(new FormData(target.querySelector('form')!).entries())).toEqual([['answer', 'one']])
      for (const [index, input] of Array.from(target.querySelectorAll('input')).entries())
        expect(input).toBe(inputs[index])
      expect(warnings.mock.calls.map(call => String(call[0]))).toEqual([])
      expect(errors.mock.calls.map(call => String(call[0]))).toEqual([])
    }
    finally {
      app.unmount()
      expect(inputs.every(input => !input.isConnected)).toBe(true)
      expect(Array.from(refs.values())).toEqual(family === 'radio' ? [null, null] : [null])
      target.remove()
      errors.mockRestore()
      warnings.mockRestore()
    }
  })
})
