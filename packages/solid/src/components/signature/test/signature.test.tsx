import { render, screen } from '@solidjs/testing-library'
import user from '@testing-library/user-event'
import { Signature, signatureAnatomy } from '../'
import { getExports, getParts } from '../../../setup-test'
import { WithField } from '../examples/WithField'
import { ComponentUnderTest } from './basic'

describe('signature / Parts & Exports', () => {
  const renderedParts = getParts(signatureAnatomy).filter(
    part => !part.includes('[data-part="segment-path"]'),
  )

  it.each(renderedParts)('should render part %s', async (part) => {
    render(() => <ComponentUnderTest />)

    expect(document.querySelector(part)).toBeInTheDocument()
  })

  it.skip.each(getExports(signatureAnatomy))('should export %s', async (part) => {
    // @ts-expect-error -- Anatomy contains two internal parts that are intentionally not public exports.
    expect(Signature[part]).toBeDefined()
  })
})

describe('signature Pad / Field', () => {
  it('should set signature pad as required', async () => {
    render(() => <WithField required />)
    expect(screen.getByRole('textbox', { hidden: true })).toBeRequired()
  })

  it('should set signature pad as disabled', async () => {
    render(() => <WithField disabled />)
    expect(screen.getByRole('application')).toHaveAttribute('aria-disabled', 'true')
  })

  it('should set signature pad as readonly', async () => {
    render(() => <WithField readOnly />)
    expect(screen.getByRole('textbox', { hidden: true })).toHaveAttribute('readonly')
  })

  it('should display helper text', async () => {
    render(() => <WithField />)
    expect(screen.getByText('Additional Info')).toBeInTheDocument()
  })

  it('should display error text when error is present', async () => {
    render(() => <WithField invalid />)
    expect(screen.getByText('Error Info')).toBeInTheDocument()
  })

  it('should focus on signature pad when label is clicked', async () => {
    render(() => <WithField />)
    await user.click(screen.getByText(/label/i))
    expect(screen.getByRole('application')).toHaveFocus()
  })

  it('should not display error text when no error is present', async () => {
    render(() => <WithField />)
    expect(screen.queryByText('Error Info')).not.toBeInTheDocument()
  })
})
