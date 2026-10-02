import { expect, it } from 'vitest'
import { createSSRApp } from 'vue'
import { renderToString } from 'vue/server-renderer'
import Fixture from './Stage2Contracts.vue'

it('server-renders exact thumb values and form identities without browser globals', async () => {
  expect(typeof document).toBe('undefined')
  const html = await renderToString(createSSRApp(Fixture))
  expect(html).toContain('aria-valuenow="20"')
  expect(html).toContain('aria-valuenow="80"')
  expect(html).toContain('id="slider:stage2-slider:input:0"')
  expect(html).toContain('id="slider:stage2-slider:input:1"')
  expect(html).toContain('name="low"')
  expect(html).toContain('name="high"')
})
