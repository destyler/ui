import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-react'
import { page, userEvent } from 'vitest/browser'
import { getExports, getParts } from '../../../../../../utils/test'
import { Basic } from '../examples/Basic'
import { WithField } from '../examples/WithField'
import { Dynamic, dynamicAnatomy } from '../index'

describe('[dynamic] component', () => {
  it.each(getParts(dynamicAnatomy))('should render part %s', async (part) => {
    render(<Basic />)
    expect(document.querySelector(part)).toBeInTheDocument()
  })

  it.each(getExports(dynamicAnatomy))('should export %s', async (part) => {
    expect(Dynamic[part]).toBeDefined()
  })

  it('should clear all item when clear all button is clicked', async () => {
    render(<Basic />)

    await expect.element(page.getByText('react')).toBeInTheDocument()
    await expect.element(page.getByText('solid')).toBeInTheDocument()
    await expect.element(page.getByText('vue')).toBeInTheDocument()

    await userEvent.click(page.getByText('Clear all'))

    await expect.element(page.getByText('react')).not.toBeInTheDocument()
    await expect.element(page.getByText('solid')).not.toBeInTheDocument()
    await expect.element(page.getByText('vue')).not.toBeInTheDocument()
  })
})

describe('tagsInput / Field', () => {
  it('should display helper text', async () => {
    render(<WithField />)
    await expect.element(page.getByText('Additional Info')).toBeInTheDocument()
  })

  it('should display error text when error is present', async () => {
    render(<WithField invalid />)
    await expect.element(page.getByText('Error Info')).toBeInTheDocument()
  })

  it('should focus on tags input when label is clicked', async () => {
    render(<WithField />)
    await userEvent.click(page.getByText(/label/i))
    await expect.element(page.getByRole('textbox', { name: /label/i })).toHaveFocus()
  })

  it('should not display error text when no error is present', async () => {
    render(<WithField />)
    await expect.element(page.getByText('Error Info')).not.toBeInTheDocument()
  })
})
