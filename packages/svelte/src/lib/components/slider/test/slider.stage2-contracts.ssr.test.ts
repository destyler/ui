import { render } from 'svelte/server'
import { expect, it } from 'vitest'
import Fixture from './Stage2Contracts.svelte'

it('server-renders exact multi-thumb values, names and ids without browser globals', () => {
  expect(typeof document).toBe('undefined')
  const { body } = render(Fixture)
  expect(body).toContain('aria-valuenow="20"')
  expect(body).toContain('aria-valuenow="80"')
  expect(body).toContain('id="slider:stage2-slider:input:0"')
  expect(body).toContain('id="slider:stage2-slider:input:1"')
  expect(body).toContain('name="low"')
  expect(body).toContain('name="high"')
})
