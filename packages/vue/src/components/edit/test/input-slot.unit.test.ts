import { expect, it, vi } from 'vitest'
import { createSSRApp, h, nextTick, ref } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { Edit } from '../index'

it.each([false, true])('hydrates Edit.Input asChild=%s without synthetic children and retains input events', async (asChild) => {
  const value = ref('Initial')
  const onInput = vi.fn()
  const inputRef = ref<InstanceType<typeof Edit.Input>>()
  const slot = vi.fn(() => h('input', { 'data-provided': 'yes' }))
  const render = () => h(Edit.Root, {
    'modelValue': value.value,
    'defaultEdit': true,
    'onUpdate:modelValue': (next: string) => value.value = next,
  }, () => h(Edit.Input, { asChild, onInput, ref: inputRef }, asChild ? { default: slot } : undefined))
  const container = document.createElement('div')
  const warnings = vi.spyOn(console, 'warn')
  const errors = vi.spyOn(console, 'error')
  let app: ReturnType<typeof createSSRApp> | undefined
  try {
    container.innerHTML = await renderToString(createSSRApp(render))
    document.body.append(container)
    const serverInput = container.querySelector('input')
    expect(serverInput?.value).toBe('Initial')
    expect(serverInput?.childNodes.length).toBe(0)
    app = createSSRApp(render)
    app.mount(container)
    await nextTick()
    const input = container.querySelector('input')
    expect(input).toBe(serverInput)
    expect(inputRef.value?.$el).toBe(input)
    expect(input?.childNodes.length).toBe(0)
    expect(input?.value).toBe('Initial')
    if (asChild) {
      expect(input?.getAttribute('data-provided')).toBe('yes')
      expect(slot).toHaveBeenCalled()
    }
    if (!input)
      throw new Error('Missing edit input')
    input.value = 'Updated'
    input.dispatchEvent(new Event('input', { bubbles: true }))
    await vi.waitFor(() => expect(value.value).toBe('Updated'))
    expect(onInput).toHaveBeenCalledTimes(1)
    expect(warnings).not.toHaveBeenCalled()
    expect(errors).not.toHaveBeenCalled()
  }
  finally {
    app?.unmount()
    container.remove()
    warnings.mockRestore()
    errors.mockRestore()
  }
})
