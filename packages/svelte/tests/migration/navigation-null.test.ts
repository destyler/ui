import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-svelte'
import NavigationNullFixture from './navigation-null.fixture.svelte'

for (const entry of ['root', 'provider', 'hook'] as const) {
  describe(`${entry}: NavigationMenu live null`, () => {
    it('starts closed and keeps API and native parts aligned through parent updates', async () => {
      const screen = await render(NavigationNullFixture, { props: { entry, value: null, defaultValue: 'one' } })
      for (const value of [null, 'one', null]) {
        await screen.rerender({ value })
        const state = value === null ? 'closed' : 'open'
        await expect.element(screen.getByTestId('api-value')).toHaveTextContent(String(value))
        await expect.element(screen.getByTestId('api-open')).toHaveTextContent(String(value !== null))
        for (const part of ['trigger', 'content', 'viewport-positioner'])
          await expect.element(screen.getByTestId(part)).toHaveAttribute('data-state', state)
      }
    })

    it('retains the default seed when live value is undefined', async () => {
      const screen = await render(NavigationNullFixture, { props: { entry, value: undefined, defaultValue: 'one' } })
      await expect.element(screen.getByTestId('api-value')).toHaveTextContent('one')
      await expect.element(screen.getByTestId('api-open')).toHaveTextContent('true')
    })
  })
}
