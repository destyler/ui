import { expect, it } from 'vitest'
import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import Core033Svg from './Core033Svg.vue'
import { expectedQr, longValue, shortValue } from './core-033-svg.expected'

it.each([shortValue, longValue])('retains native SVG attribute spellings in raw SSR for %s', async (modelValue) => {
  expect(typeof document).toBe('undefined')
  const html = await renderToString(createSSRApp({ render: () => h(Core033Svg, { modelValue }) }))
  expect(html).toContain(`viewBox="${expectedQr(modelValue).viewBox}"`)
  expect(html).not.toContain('viewbox=')
  expect(html).toContain('preserveAspectRatio="xMidYMid meet"')
  expect(html).toContain('stroke-width="2"')
  expect(html).toContain('fill-rule="evenodd"')
  expect(html).toContain('clip-rule="evenodd"')
  expect(html).toContain(`d="${expectedQr(modelValue).path}"`)
})
