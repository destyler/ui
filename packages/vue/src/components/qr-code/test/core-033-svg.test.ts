import { expect, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import { page } from 'vitest/browser'
import Core033Svg from './Core033Svg.vue'
import { expectedQr, longValue, shortValue } from './core-033-svg.expected'

it('preserves native SVG names, current QR coordinates, and exported XML after a value update', async () => {
  const screen = await render(Core033Svg, { props: { modelValue: shortValue } })
  const frame = document.querySelector<SVGSVGElement>('[data-part="frame"]')!
  const pattern = document.querySelector<SVGPathElement>('[data-part="pattern"]')!
  expect(frame.getAttribute('viewBox')).toBe(expectedQr(shortValue).viewBox)
  expect(frame.hasAttribute('viewbox')).toBe(false)
  expect(frame.getAttribute('preserveAspectRatio')).toBe('xMidYMid meet')
  expect(pattern.getAttribute('stroke-width')).toBe('2')
  expect(pattern.getAttribute('fill-rule')).toBe('evenodd')
  expect(pattern.getAttribute('clip-rule')).toBe('evenodd')
  expect(pattern.getAttribute('d')).toBe(expectedQr(shortValue).path)

  await screen.rerender({ modelValue: longValue })
  expect(expectedQr(longValue).viewBox).not.toBe(expectedQr(shortValue).viewBox)
  await expect.poll(() => frame.getAttribute('viewBox')).toBe(expectedQr(longValue).viewBox)
  expect(pattern.getAttribute('d')).toBe(expectedQr(longValue).path)
  expect(frame.hasAttribute('viewbox')).toBe(false)
  expect(frame.getAttribute('preserveAspectRatio')).toBe('xMidYMid meet')
  await page.getByRole('button', { name: 'Export SVG' }).click()
  const output = document.querySelector('[data-testid="svg-data-url"]')!
  await expect.poll(() => output.textContent).toMatch(/^data:image\/svg\+xml/)
  const xml = await fetch(output.textContent!).then(response => response.text())
  expect(xml).toContain(`viewBox="${expectedQr(longValue).viewBox}"`)
  expect(xml).not.toContain('viewbox=')
  expect(xml).toContain(`d="${expectedQr(longValue).path}"`)
})
