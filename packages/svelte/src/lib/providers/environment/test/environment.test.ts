import { expect, it } from 'vitest'
import { render } from 'vitest-browser-svelte'
import { EnvironmentProvider } from '../index'
import ElementRootFixture from './ElementRootFixture.svelte'

it('exports Environment', () => {
  expect(EnvironmentProvider).toBeDefined()
})

it('supports an element as the environment root', async () => {
  const screen = await render(ElementRootFixture)

  await expect.element(screen.getByRole('textbox', { name: 'Email' }))
    .toHaveAccessibleDescription('Use a work address')
  await expect.element(screen.getByRole('group', { name: 'Profile' }))
    .toHaveAccessibleDescription('Public information')
})
