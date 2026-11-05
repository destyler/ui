import { expect, it } from 'vitest'
import { createSSRApp, h, ref } from 'vue'
import { renderToString } from 'vue/server-renderer'
import Core033Svg from './Core033Svg.vue'
import { expectedQr, longValue, shortValue } from './core-033-svg.expected'

it('retains the hydrated frame and updates its encoded coordinates without remounting', async () => {
  const value = ref(shortValue)
  const component = { render: () => h(Core033Svg, { modelValue: value.value }) }
  const container = document.createElement('div')
  container.innerHTML = await renderToString(createSSRApp(component))
  document.body.append(container)
  const frame = container.querySelector('svg')!
  const app = createSSRApp(component)
  try {
    app.mount(container)
    expect(container.querySelector('svg')).toBe(frame)
    expect(frame.getAttribute('viewBox')).toBe(expectedQr(shortValue).viewBox)
    value.value = longValue
    await expect.poll(() => frame.getAttribute('viewBox')).toBe(expectedQr(longValue).viewBox)
    expect(container.querySelector('svg')).toBe(frame)
    expect(frame.querySelector('path')?.getAttribute('d')).toBe(expectedQr(longValue).path)
    expect(frame.getAttribute('preserveAspectRatio')).toBe('xMidYMid meet')
    expect(frame.querySelector('path')?.getAttribute('stroke-width')).toBe('2')
  }
  finally {
    app.unmount()
    container.remove()
  }
})
