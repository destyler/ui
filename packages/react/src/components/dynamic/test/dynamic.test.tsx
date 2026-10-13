import type { UseDynamicProps } from '../hooks/use-dynamic'
import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-react'
import { page, userEvent } from 'vitest/browser'
import { getExports, getParts } from '../../../../../../utils/test'
import { Basic } from '../examples/Basic'
import { InitialValue } from '../examples/InitialValue'
import { WithField } from '../examples/WithField'
import { Dynamic, dynamicAnatomy } from '../index'

describe('[dynamic] component', () => {
  it.each(getParts(dynamicAnatomy))('should render part %s', async (part) => {
    await render(<Basic />)
    expect(document.querySelector(part)).toBeInTheDocument()
  })

  it.each(getExports(dynamicAnatomy))('should export %s', async (part) => {
    expect(Dynamic).toHaveProperty(part, expect.anything())
  })

  it('should clear all item when clear all button is clicked', async () => {
    await render(<Basic />)

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
  await render(<InitialValue />)
  await expect.element(page.getByText('React')).toBeInTheDocument()
  await expect.element(page.getByText('Solid')).toBeInTheDocument()
})

describe('tagsInput / Field', () => {
  it('should display helper text', async () => {
    await render(<WithField />)
    await expect.element(page.getByText('Additional Info')).toBeInTheDocument()
  })

  it('should display error text when error is present', async () => {
    await render(<WithField invalid />)
    await expect.element(page.getByText('Error Info')).toBeInTheDocument()
  })

  it('should focus on tags input when label is clicked', async () => {
    await render(<WithField />)
    await userEvent.click(page.getByText(/label/i))
    await expect.element(page.getByRole('textbox', { name: /label/i })).toHaveFocus()
  })

  it('should not display error text when no error is present', async () => {
    await render(<WithField />)
    await expect.element(page.getByText('Error Info')).not.toBeInTheDocument()
  })
})

function ValueState(props: UseDynamicProps) {
  return (
    <Dynamic.Root {...props}>
      <Dynamic.Context>
        {api => (
          <>
            <output data-testid="value">{JSON.stringify(api.value)}</output>
            <button type="button" onClick={() => api.setValue(['Edited'])}>Set value</button>
          </>
        )}
      </Dynamic.Context>
      <Dynamic.Input aria-label="Tag" />
      <Dynamic.HiddenInput />
    </Dynamic.Root>
  )
}

describe('dynamic value state', () => {
  it('keeps internal edits when unrelated props and defaultValue change', async () => {
    const screen = await render(<ValueState defaultValue={['Initial']} />)
    await expect.element(page.getByTestId('value')).toMatchTextContent('["Initial"]')
    await userEvent.click(page.getByRole('button', { name: 'Set value' }))
    await expect.element(page.getByTestId('value')).toMatchTextContent('["Edited"]')

    await screen.rerender(<ValueState defaultValue={['Initial']} readOnly />)
    await expect.element(page.getByTestId('value')).toMatchTextContent('["Edited"]')
    await screen.rerender(<ValueState defaultValue={['Replacement']} />)
    await expect.element(page.getByTestId('value')).toMatchTextContent('["Edited"]')
  })

  it('prefers an explicit empty value and follows live value updates', async () => {
    const screen = await render(<ValueState defaultValue={['Initial']} value={[]} />)
    await expect.element(page.getByTestId('value')).toMatchTextContent('[]')
    await screen.rerender(<ValueState defaultValue={['Initial']} value={['Updated']} />)
    await expect.element(page.getByTestId('value')).toMatchTextContent('["Updated"]')
    await screen.rerender(<ValueState defaultValue={['Initial']} value={[]} />)
    await expect.element(page.getByTestId('value')).toMatchTextContent('[]')
  })
})
