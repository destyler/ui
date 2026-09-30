import { render } from 'svelte/server'
import { describe, expect, it } from 'vitest'
import NavigationNullFixture from './navigation-null.fixture.svelte'

for (const entry of ['root', 'provider', 'hook'] as const) {
  describe(`${entry}: NavigationMenu SSR value ownership`, () => {
    it.each([null, undefined, 'one'] as const)('aligns API and all parts for live value=%s', (value) => {
      const { body } = render(NavigationNullFixture, { props: { entry, value, defaultValue: 'one' } })
      const open = value !== null
      expect(body).toMatch(new RegExp(`data-testid="api-value"[^>]*>${open ? 'one' : 'null'}<`))
      expect(body).toMatch(new RegExp(`data-testid="api-open"[^>]*>${open}<`))
      for (const part of ['trigger', 'content', 'viewport-positioner']) {
        const element = body.match(new RegExp(`<[^>]*data-testid="${part}"[^>]*>`))?.[0]
        expect(element).toContain(`data-state="${open ? 'open' : 'closed'}"`)
      }
    })
  })
}
