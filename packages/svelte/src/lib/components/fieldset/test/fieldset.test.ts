import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-svelte'
import Basic from '../examples/Basic.svelte'
import { Fieldset, fieldsetAnatomy } from '../index'

const componentExports = Fieldset as unknown as Record<string, unknown>

describe('[fieldset] component', () => {
  it.each(fieldsetAnatomy.keys())('renders part %s', async (part) => {
    const screen = await render(Basic, { props: { invalid: true } })
    const dataPart = part.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)
    expect(screen.container.querySelector(`[data-scope="fieldset"][data-part="${dataPart}"]`)).not.toBeNull()
  })

  it.each(fieldsetAnatomy.keys())('exports %s', (part) => {
    const exportName = `${part.charAt(0).toUpperCase()}${part.slice(1)}`
    expect(componentExports[exportName], `Fieldset.${exportName}`).toBeDefined()
  })

  it('disables descendant form controls', async () => {
    const screen = await render(Basic, { props: { disabled: true } })
    await expect.element(screen.getByRole('textbox', { name: /label/i })).toBeDisabled()
  })

  it('renders helper text and legend', async () => {
    const screen = await render(Basic)
    await expect.element(screen.getByText('Fieldset Helper Text')).toBeVisible()
    await expect.element(screen.getByText('Legend')).toBeVisible()
  })

  it('shows error text when invalid', async () => {
    const screen = await render(Basic, { props: { invalid: true } })
    await expect.element(screen.getByText('Fieldset Error Text')).toBeVisible()
  })

  it('hides error text when valid', async () => {
    const screen = await render(Basic, { props: { invalid: false } })
    await expect.element(screen.getByText('Fieldset Error Text')).not.toBeInTheDocument()
  })
})
