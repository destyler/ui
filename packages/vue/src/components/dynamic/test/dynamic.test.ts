import type { UseDynamicProps } from '../composables/use-dynamic'
import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import { page, userEvent } from 'vitest/browser'
import { getExports, getParts } from '../../../../../../utils/test'
import Basic from '../examples/Basic.vue'
import InitialValue from '../examples/InitialValue.vue'
import WithField from '../examples/WithField.vue'
import { Dynamic, dynamicAnatomy } from '../index'
import ValueState from './ValueState.vue'

describe('[dynamic] component', () => {
  it.each(getParts(dynamicAnatomy))('should render part %s', async (part) => {
    render(Basic)
    expect(document.querySelector(part)).toBeInTheDocument()
  })

  it.each(getExports(dynamicAnatomy))('should export %s', async (part) => {
    expect(Dynamic[part]).toBeDefined()
  })

  it('should clear all item when clear all button is clicked', async () => {
    render(Basic)

    await expect.element(page.getByText('react')).toBeInTheDocument()
    await expect.element(page.getByText('solid')).toBeInTheDocument()
    await expect.element(page.getByText('vue')).toBeInTheDocument()

    await userEvent.click(page.getByText('Clear all'))

    await expect.element(page.getByText('react')).not.toBeInTheDocument()
    await expect.element(page.getByText('solid')).not.toBeInTheDocument()
    await expect.element(page.getByText('vue')).not.toBeInTheDocument()
  })
})

it('seeds default* via InitialValue example', async () => {
  render(InitialValue)
  await expect.element(page.getByText('React')).toBeInTheDocument()
  await expect.element(page.getByText('Solid')).toBeInTheDocument()
})

describe('tagsInput / Field', () => {
  it('should display helper text', async () => {
    render(WithField)
    await expect.element(page.getByText('Additional Info')).toBeInTheDocument()
  })

  it('should display error text when error is present', async () => {
    render(WithField, { props: { invalid: true } })
    await expect.element(page.getByText('Error Info')).toBeInTheDocument()
  })

  it('should focus on tags input when label is clicked', async () => {
    render(WithField)
    await userEvent.click(page.getByText(/label/i))
    await expect.element(page.getByRole('textbox', { name: /label/i })).toHaveFocus()
  })

  it('should not display error text when no error is present', async () => {
    render(WithField)
    await expect.element(page.getByText('Error Info')).not.toBeInTheDocument()
  })
})

describe('dynamic value state', () => {
  it('keeps internal edits when unrelated props and defaultValue change', async () => {
    const screen = await render(ValueState, { props: { defaultValue: ['Initial'] } as UseDynamicProps })
    await expect.element(page.getByTestId('value')).toHaveTextContent('["Initial"]')
    await userEvent.click(page.getByRole('button', { name: 'Set value' }))
    await expect.element(page.getByTestId('value')).toHaveTextContent('["Edited"]')

    await screen.rerender({ defaultValue: ['Initial'], readOnly: true })
    await expect.element(page.getByTestId('value')).toHaveTextContent('["Edited"]')
    await screen.rerender({ defaultValue: ['Replacement'], readOnly: false })
    await expect.element(page.getByTestId('value')).toHaveTextContent('["Edited"]')
  })

  it('prefers an explicit empty value and follows live value updates', async () => {
    const screen = await render(ValueState, { props: { defaultValue: ['Initial'], modelValue: [] } as UseDynamicProps })
    await expect.element(page.getByTestId('value')).toHaveTextContent('[]')
    await screen.rerender({ modelValue: ['Updated'] })
    await expect.element(page.getByTestId('value')).toHaveTextContent('["Updated"]')
    await screen.rerender({ modelValue: [] })
    await expect.element(page.getByTestId('value')).toHaveTextContent('[]')
  })
})
