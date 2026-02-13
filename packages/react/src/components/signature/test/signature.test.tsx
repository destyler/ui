import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-react'
import { page, userEvent } from 'vitest/browser'
import { getExports, getParts } from '../../../../../../utils/test'
import { Basic } from '../examples/Basic'
import { ImagePreview } from '../examples/ImagePreview'
import { RootProvider } from '../examples/RootProvider'
import { WithField } from '../examples/WithField'
import { Signature, signatureAnatomy } from '../index'

describe('[signature] component', () => {
  it.each(getParts(signatureAnatomy).filter(p => !p.includes('segment-path')))('should render part %s', async (part) => {
    render(<Basic />)
    expect(document.querySelector(part)).toBeInTheDocument()
  })

  it.each(getExports(signatureAnatomy).filter(p => p !== 'SegmentPath'))('should export %s', async (part) => {
    expect(Signature[part]).toBeDefined()
  })

  it('should render signature label', async () => {
    render(<Basic />)
    await expect.element(page.getByText('Sign below')).toBeInTheDocument()
  })

  it('should render signature control with svg', async () => {
    render(<Basic />)
    const svg = document.querySelector('svg[data-part="segment"]')
    expect(svg).toBeInTheDocument()
  })

  it('should render clear button', async () => {
    render(<Basic />)
    const clearButton = document.querySelector('[data-part="clear-trigger"]')
    expect(clearButton).toBeInTheDocument()
  })

  it('should have control element ready for drawing', async () => {
    render(<Basic />)

    const control = document.querySelector('[data-part="control"]')
    expect(control).toBeInTheDocument()
    expect(control).toHaveAttribute('role', 'application')
    expect(control).toHaveAttribute('tabindex', '0')
  })

  it('should render clear button with correct attributes', async () => {
    render(<Basic />)

    const clearButton = document.querySelector('[data-part="clear-trigger"]')
    expect(clearButton).toBeInTheDocument()
    expect(clearButton).toHaveAttribute('type', 'button')
    expect(clearButton).toHaveAttribute('aria-label', 'clear signature')
  })

  it('should render guide lines', async () => {
    render(<Basic />)
    const guide = document.querySelector('[data-part="guide"]')
    expect(guide).toBeInTheDocument()
  })

  it('should render image preview component', async () => {
    render(<ImagePreview />)

    const control = document.querySelector('[data-part="control"]')
    expect(control).toBeInTheDocument()

    // Image preview should not be present until drawing
    const img = document.querySelector('img[alt="Signature preview"]')
    expect(img).not.toBeInTheDocument()
  })

  it('should support custom fill color', async () => {
    render(<ImagePreview />)

    const segment = document.querySelector('[data-part="segment"]')
    expect(segment).toBeInTheDocument()
    expect(segment).toHaveAttribute('fill', 'orange')
  })

  it('should work with RootProvider', async () => {
    render(<RootProvider />)

    // Should render external clear button
    const externalClearButton = page.getByRole('button', { name: 'Clear' }).first()
    await expect.element(externalClearButton).toBeInTheDocument()

    // Should render signature pad clear button
    const padClearButton = page.getByRole('button', { name: 'Clear' }).last()
    await expect.element(padClearButton).toBeInTheDocument()
  })

  it('should have external clear button when using RootProvider', async () => {
    render(<RootProvider />)

    const control = document.querySelector('[data-part="control"]')
    expect(control).toBeInTheDocument()

    // Click external clear button
    const externalClearButton = page.getByRole('button', { name: 'Clear' }).first()
    await userEvent.click(externalClearButton)

    // Control should still be in the document
    expect(control).toBeInTheDocument()
  })
})

describe('signature / Field', () => {
  it('should render with field wrapper', async () => {
    render(<WithField />)
    await expect.element(page.getByText('Label')).toBeInTheDocument()
  })

  it('should render hidden input', async () => {
    render(<WithField />)

    const hiddenInput = document.querySelector('input[hidden]')
    expect(hiddenInput).toBeInTheDocument()
    expect(hiddenInput).toHaveAttribute('hidden')
  })

  it('should display helper text', async () => {
    render(<WithField />)
    await expect.element(page.getByText('Additional Info')).toBeInTheDocument()
  })

  it('should display error text when invalid', async () => {
    render(<WithField invalid />)
    await expect.element(page.getByText('Error Info')).toBeInTheDocument()
  })

  it('should have hidden input for form submission', async () => {
    render(<WithField />)

    const hiddenInput = document.querySelector('input[hidden]') as HTMLInputElement
    expect(hiddenInput).toBeInTheDocument()
    // Hidden input value starts empty
    expect(hiddenInput?.value).toBe('')
  })

  it('should have clear button in field', async () => {
    render(<WithField />)

    const clearButton = document.querySelector('[data-part="clear-trigger"]')
    expect(clearButton).toBeInTheDocument()
    expect(clearButton).toHaveAttribute('type', 'button')
  })
})
