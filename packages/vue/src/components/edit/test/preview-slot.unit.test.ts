import { expect, it, vi } from 'vitest'
import { createApp, createSSRApp, h, nextTick, ref } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { Edit } from '../index'

it.each(['client', 'hydrate'] as const)('renders and edits preview text without synthetic slot children (%s)', async (mode) => {
  const warnings = vi.spyOn(console, 'warn')
  const container = document.createElement('div')
  document.body.append(container)
  const value = ref('')
  const editing = ref(false)
  const onEditChange = vi.fn()
  const render = () => h(Edit.Root, {
    'placeholder': 'Placeholder',
    'activationMode': 'click',
    'modelValue': value.value,
    'edit': editing.value,
    'onUpdate:edit': (next: boolean) => editing.value = next,
    onEditChange,
  }, () => h(Edit.Preview))
  let app: ReturnType<typeof createApp> | undefined
  try {
    if (mode === 'hydrate')
      container.innerHTML = await renderToString(createSSRApp(render))
    const serverPreview = container.querySelector('[data-part="preview"]')
    app = mode === 'hydrate' ? createSSRApp(render) : createApp(render)
    app.mount(container)
    await nextTick()
    const preview = container.querySelector<HTMLElement>('[data-part="preview"]')
    expect(preview?.textContent).toBe('Placeholder')
    if (mode === 'hydrate')
      expect(preview).toBe(serverPreview)
    preview?.click()
    await vi.waitFor(() => expect(preview?.hidden).toBe(true))
    expect(onEditChange).toHaveBeenCalledWith(expect.objectContaining({ edit: true }))
    value.value = 'Edited'
    editing.value = false
    await vi.waitFor(() => {
      expect(preview?.hidden).toBe(false)
      expect(preview?.textContent).toBe('Edited')
    })
    expect(warnings).not.toHaveBeenCalled()
  }
  finally {
    app?.unmount()
    container.remove()
    warnings.mockRestore()
  }
})

it('preserves an explicit asChild slot, its props, listener and exposed element', async () => {
  const warnings = vi.spyOn(console, 'warn')
  const onClick = vi.fn()
  const previewRef = ref<InstanceType<typeof Edit.Preview>>()
  const slot = vi.fn(() => h('button', { 'type': 'button', 'textContent': 'Provided', onClick, 'data-slot': 'provided' }))
  const container = document.createElement('div')
  document.body.append(container)
  let app: ReturnType<typeof createApp> | undefined
  try {
    app = createApp({
      render: () => h(Edit.Root, { defaultValue: 'Initial', activationMode: 'click' }, () => [
        h(Edit.Input),
        h(Edit.Preview, { asChild: true, ref: previewRef }, { default: slot }),
      ]),
    })
    app.mount(container)
    await nextTick()
    const preview = container.querySelector<HTMLButtonElement>('[data-part="preview"]')
    expect(preview?.tagName).toBe('BUTTON')
    expect(preview?.textContent).toBe('Provided')
    expect(preview?.getAttribute('data-slot')).toBe('provided')
    expect(previewRef.value?.$el).toBe(preview)
    expect(slot).toHaveBeenCalled()
    preview?.click()
    await nextTick()
    expect(onClick).toHaveBeenCalledTimes(1)
    await vi.waitFor(() => expect(container.querySelector<HTMLInputElement>('[data-part="input"]')?.hidden).toBe(false))
    expect(warnings).not.toHaveBeenCalled()
  }
  finally {
    app?.unmount()
    container.remove()
    warnings.mockRestore()
  }
})
