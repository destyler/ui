import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-svelte'
import Basic from '../examples/Basic.svelte'
import WithField from '../examples/WithField.svelte'
import { Dynamic, dynamicAnatomy } from '../index'

const componentExports = Dynamic as unknown as Record<string, unknown>

describe('[dynamic] component', () => {
  it.each(dynamicAnatomy.keys())('renders and exports the %s anatomy part', async (part: string) => {
    const screen = await render(Basic)
    const dataPart = part.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)
    expect(screen.container.querySelector(`[data-scope="dynamic"][data-part="${dataPart}"]`)).toBeInTheDocument()
    const exportName = `${part.charAt(0).toUpperCase()}${part.slice(1)}`
    expect(componentExports[exportName], `Dynamic.${exportName}`).toBeDefined()
  })

  it('clears all items when the clear trigger is clicked', async () => {
    const screen = await render(Basic)
    expect(screen.container.querySelector('[data-part="input"]')).toHaveAttribute('placeholder', 'Add tag')
    await expect.element(screen.getByText('react')).toBeInTheDocument()
    await expect.element(screen.getByText('solid')).toBeInTheDocument()
    await expect.element(screen.getByText('vue')).toBeInTheDocument()

    await screen.getByText('Clear all').click()

    await expect.element(screen.getByText('react')).not.toBeInTheDocument()
    await expect.element(screen.getByText('solid')).not.toBeInTheDocument()
    await expect.element(screen.getByText('vue')).not.toBeInTheDocument()
  })
})

describe('dynamic / Field', () => {
  it('renders helper and conditional error text', async () => {
    const screen = await render(WithField, { props: { invalid: true } })
    await expect.element(screen.getByText('Additional Info')).toBeInTheDocument()
    await expect.element(screen.getByText('Error Info')).toBeInTheDocument()
  })

  it('focuses the tags input when its label is clicked', async () => {
    const screen = await render(WithField)
    await screen.getByText(/label/i).click()
    await expect.element(screen.getByRole('textbox', { name: /label/i })).toHaveFocus()
  })

  it('hides error text while valid', async () => {
    const screen = await render(WithField)
    await expect.element(screen.getByText('Error Info')).not.toBeInTheDocument()
  })
})
