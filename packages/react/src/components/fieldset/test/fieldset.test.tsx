import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-react'
import { page } from 'vitest/browser'
import { getExports, getParts } from '../../../../../../utils/test'
import { Basic } from '../examples/Basic'
import { Fieldset, fieldsetAnatomy } from '../index'

describe('[fieldset] component', () => {
  it.each(getParts(fieldsetAnatomy))('should render part %s', (part) => {
    render(<Basic invalid />)
    expect(document.querySelector(part)).toBeInTheDocument()
  })

  it.each(getExports(fieldsetAnatomy))('should export %s', (part) => {
    render(<Basic invalid />)
    expect(Fieldset[part]).toBeDefined()
  })

  it('should display helper text', async () => {
    render(<Basic invalid />)
    await expect.element(page.getByText('Fieldset Helper Text')).toBeInTheDocument()
  })

  it('should display error text when invalid is present', async () => {
    render(<Basic invalid />)
    await expect.element(page.getByText('Fieldset Error Text')).toBeInTheDocument()
  })

  it('should not display error text when invalid is false', async () => {
    render(<Basic invalid={false} />)
    await expect.element(page.getByText('Fieldset Error Text')).not.toBeInTheDocument()
  })

  it('should render legend text', async () => {
    render(<Basic invalid />)
    await expect.element(page.getByText('Legend')).toBeInTheDocument()
  })
})
