import { afterEach, describe, expect, it } from 'vitest'
import { createApp, h, nextTick, ref } from 'vue'
import { AspectRatio } from '../components/aspect-ratio'
import { Label } from '../components/label'
import { Separator } from '../components/separator'

const cleanups: VoidFunction[] = []
afterEach(() => cleanups.splice(0).forEach(cleanup => cleanup()))

describe('structural rendered contracts', () => {
  it('updates ratio and orientation while preserving native labels and caller IDs', async () => {
    const host = document.createElement('main')
    document.body.append(host)
    const ratio = ref(2)
    const vertical = ref(false)
    const labelRef = ref()
    const app = createApp({ render: () => h('div', [
      h(AspectRatio.Root, { id: 'frame', ratio: ratio.value }, () => h(AspectRatio.Content, { id: 'caller-content' }, () => 'Media')),
      h(Separator.Root, { orientation: vertical.value ? 'vertical' : 'horizontal' }),
      h(Label.Root, { ref: labelRef, for: 'field' }, () => 'Name'),
      h('input', { id: 'field' }),
    ]) })
    app.mount(host)
    cleanups.push(() => {
      app.unmount()
      host.remove()
    })
    await nextTick()
    const frame = host.querySelector<HTMLElement>('[data-scope="aspect-ratio"][data-part="root"]')!
    const separator = host.querySelector('[role="separator"]')!
    expect(frame.style.paddingBottom).toBe('50%')
    expect(labelRef.value.$el).toBe(host.querySelector('label'))
    expect(host.querySelector('label')?.htmlFor).toBe('field')
    ratio.value = 0.5
    vertical.value = true
    await nextTick()
    await expect.poll(() => frame.style.paddingBottom).toBe('200%')
    expect(host.querySelector('[data-scope="aspect-ratio"][data-part="root"]')).toBe(frame)
    expect(host.querySelector('#caller-content')?.parentElement).toBe(frame)
    expect(separator.getAttribute('aria-orientation')).toBe('vertical')
  })

  it('preserves asChild label identity and both component and native refs', async () => {
    const host = document.createElement('main')
    document.body.append(host)
    const componentRef = ref()
    const childRef = ref<HTMLLabelElement>()
    const app = createApp({ render: () => h(Label.Root, { ref: componentRef, asChild: true, for: 'field' }, () => h('label', { ref: childRef, id: 'caller-label' }, 'Name')) })
    app.mount(host)
    await nextTick()
    try {
      const label = host.querySelector('label')!
      expect(host.querySelectorAll('label')).toHaveLength(1)
      expect(componentRef.value.$el).toBe(label)
      expect(childRef.value).toBe(label)
      expect(label.htmlFor).toBe('field')
      expect(label.id).toBe('caller-label')
    }
    finally {
      app.unmount()
      host.remove()
    }
    expect(childRef.value).toBeNull()
    expect(componentRef.value).toBeNull()
  })
})
