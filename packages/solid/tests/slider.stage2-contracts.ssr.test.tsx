import { renderToString } from 'solid-js/web'
import { expect, it } from 'vitest'
import { Stage2Contracts } from '../src/components/slider/test/Stage2Contracts'

it('server-renders exact thumb values and form identities without browser globals', () => {
  expect(typeof document).toBe('undefined')
  const html = renderToString(() => <Stage2Contracts />)
  expect(html).toContain('aria-valuenow="20"')
  expect(html).toContain('aria-valuenow="80"')
  expect(html).toContain('id="slider:stage2-slider:input:0"')
  expect(html).toContain('id="slider:stage2-slider:input:1"')
  expect(html).toContain('name="low"')
  expect(html).toContain('name="high"')
})
