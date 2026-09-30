import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-svelte'
import { userEvent } from 'vitest/browser'
import Basic from '../examples/Basic.svelte'
import InitialValue from '../examples/InitialValue.svelte'
import WithField from '../examples/WithField.svelte'
import { Dynamic, dynamicAnatomy } from '../index'
import ValueUnderTest from './ValueUnderTest.svelte'

const componentExports = Dynamic as unknown as Record<string, unknown>

describe('[dynamic] component', () => {
  it.each<[string]>(dynamicAnatomy.keys().map((part: string) => [part] as [string]))('renders and exports the %s anatomy part', async (part) => {
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

it('seeds default* via InitialValue example', async () => {
  const screen = await render(InitialValue)
  await expect.element(screen.getByText('React')).toBeInTheDocument()
  await expect.element(screen.getByText('Solid')).toBeInTheDocument()
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

describe('dynamic / initial value', () => {
  it.each([
    { value: undefined, expected: ['Default'] },
    { value: ['Live'], expected: ['Live'] },
    { value: [], expected: [] },
  ])('prefers the supplied live value, including $value', async ({ value, expected }) => {
    const screen = await render(ValueUnderTest, { props: { defaultValue: ['Default'], value } })
    await expect.element(screen.getByTestId('value')).toHaveTextContent(JSON.stringify(expected))
  })

  it('updates live values, including an empty array', async () => {
    const screen = await render(ValueUnderTest, { props: { defaultValue: ['Default'], value: ['First'] } })

    await screen.rerender({ value: ['Second'] })
    await expect.element(screen.getByTestId('value')).toHaveTextContent('["Second"]')
    await screen.rerender({ value: [] })
    await expect.element(screen.getByTestId('value')).toHaveTextContent('[]')
  })

  it('keeps internal edits when unrelated props and defaultValue change', async () => {
    const screen = await render(ValueUnderTest, { props: { defaultValue: ['Default'] } })

    await screen.getByPlaceholder('Add tag').fill('Added')
    await userEvent.keyboard('{Enter}')
    await expect.element(screen.getByTestId('value')).toHaveTextContent('["Default","Added"]')

    await screen.rerender({ readOnly: true })
    await expect.element(screen.getByPlaceholder('Add tag')).toBeDisabled()
    await expect.element(screen.getByTestId('value')).toHaveTextContent('["Default","Added"]')
    await screen.rerender({ defaultValue: ['Replacement'] })
    await expect.element(screen.getByTestId('value')).toHaveTextContent('["Default","Added"]')

    await screen.rerender({ readOnly: false })
    await screen.getByText('Clear all').click()
    await expect.element(screen.getByTestId('value')).toHaveTextContent('[]')
    await screen.rerender({ defaultValue: ['Another default'], readOnly: true })
    await expect.element(screen.getByPlaceholder('Add tag')).toBeDisabled()
    await expect.element(screen.getByTestId('value')).toHaveTextContent('[]')
  })
})
