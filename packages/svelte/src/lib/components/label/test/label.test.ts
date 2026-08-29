import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-svelte'
import Basic from '../examples/Basic.svelte'
import RootProvider from '../examples/RootProvider.svelte'
import { Label, labelAnatomy } from '../index'

const componentExports = Label as unknown as Record<string, unknown>
describe('[label] component', () => {
  it.each(labelAnatomy.keys())('renders part %s', async (part) => {
    const screen = await render(Basic)
    expect(screen.container.querySelector(`[data-scope="label"][data-part="${part}"]`)).not.toBeNull()
  })

  it.each(labelAnatomy.keys())('exports %s', (part) => {
    const exportName = `${part.charAt(0).toUpperCase()}${part.slice(1)}`
    expect(componentExports[exportName], `Label.${exportName}`).toBeDefined()
  })

  it('renders label text', async () => {
    const screen = await render(Basic)
    await expect.element(screen.getByText('Username')).toBeVisible()
  })

  it('works with RootProvider', async () => {
    const screen = await render(RootProvider)
    await expect.element(screen.getByText('Email Address')).toBeVisible()
  })
})
