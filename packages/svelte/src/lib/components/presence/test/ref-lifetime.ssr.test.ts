import { render } from 'svelte/server'
import { describe, expect, it } from 'vitest'
import Fixture from './RefLifetimeFixture.svelte'

describe.each([false, true])('presence static SSR with asChild=%s', (child) => {
  describe.each([false, true])('bound=%s', (bound) => {
    it.each([false, true])('preserves initiallyPresent=%s without browser globals', (initiallyPresent) => {
      expect(typeof window).toBe('undefined')
      expect(typeof document).toBe('undefined')
      const { body } = render(Fixture, { props: { child, bound, initiallyPresent } })
      expect(body).toContain('data-testid="presence-ref"')
      expect(body).toContain(`data-state="${initiallyPresent ? 'open' : 'closed'}"`)
      expect(body.includes(' hidden')).toBe(!initiallyPresent)
    })
  })

  it('verifies the complete server markup consumed by hydration', async () => {
    expect(typeof window).toBe('undefined')
    expect(typeof document).toBe('undefined')
    const { body } = render(Fixture, { props: { child } })
    await expect(body).toMatchFileSnapshot(`./ref-lifetime-${child ? 'child' : 'native'}.ssr.html`)
  })
})
