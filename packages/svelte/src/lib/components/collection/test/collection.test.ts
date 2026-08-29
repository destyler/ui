import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-svelte'
import ListCollectionFixture from './ListCollectionFixture.svelte'

describe('[collection] useListCollection', () => {
  it('filters the current items without restoring removed entries', async () => {
    const screen = await render(ListCollectionFixture)
    const items = screen.getByTestId('items')

    await screen.getByRole('button', { name: 'Remove beta' }).click()
    await expect.element(items).toHaveTextContent('a,c,d')
    await screen.getByRole('button', { name: 'Filter alpha' }).click()
    await expect.element(items).toHaveTextContent('a')
    await screen.getByRole('button', { name: 'Clear filter' }).click()
    await expect.element(items).toHaveTextContent('a,c,d')
  })

  it('moves items before and after forward targets without an index offset', async () => {
    const screen = await render(ListCollectionFixture)
    const items = screen.getByTestId('items')

    await screen.getByRole('button', { name: 'Move alpha before charlie' }).click()
    await expect.element(items).toHaveTextContent('b,a,c,d')
    await screen.getByRole('button', { name: 'Reset' }).click()
    await screen.getByRole('button', { name: 'Move alpha after charlie' }).click()
    await expect.element(items).toHaveTextContent('b,c,a,d')
    await screen.getByRole('button', { name: 'Reset' }).click()
    await screen.getByRole('button', { name: 'Move beta after itself' }).click()
    await expect.element(items).toHaveTextContent('a,b,c,d')
  })
})
