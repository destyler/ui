import { render, screen, waitFor } from '@solidjs/testing-library'
import user from '@testing-library/user-event'
import { createSignal } from 'solid-js'
import { Fieldset } from '../'
import { Field } from '../..'
import { getExports, getParts } from '../../../setup-test'
import { fieldsetAnatomy } from '../anatomy'

function ComponentUnderTest(props: Fieldset.RootProps) {
  return (
    <Fieldset.Root {...props}>
      <Fieldset.Legend>Legend</Fieldset.Legend>
      <Fieldset.HelperText>Fieldset Helper Text</Fieldset.HelperText>
      <Fieldset.ErrorText>Fieldset Error Text</Fieldset.ErrorText>
      <Field.Root>
        <Field.Label>Label</Field.Label>
        <Field.Input />
        <Field.HelperText>Field Helper Text</Field.HelperText>
        <Field.ErrorText>Field Error Text</Field.ErrorText>
      </Field.Root>
    </Fieldset.Root>
  )
}

describe('fieldset / Parts & Exports', () => {
  it.each(
    getParts(fieldsetAnatomy).filter(
      part => !part.includes('select') && !part.includes('textarea'),
    ),
  )('should render part %s', async (part) => {
    render(() => <ComponentUnderTest invalid />)

    expect(document.querySelector(part)).toBeInTheDocument()
  })

  it.each(getExports(fieldsetAnatomy))('should export %s', async (part) => {
    expect(Fieldset[part]).toBeDefined()
  })
})

describe('fieldset', () => {
  it('should set textbox as disabled', async () => {
    render(() => <ComponentUnderTest disabled />)
    expect(screen.getByRole('textbox', { name: /label/i })).toBeDisabled()
  })

  it('should display helper text', async () => {
    render(() => <ComponentUnderTest />)
    expect(screen.getByText('Fieldset Helper Text')).toBeInTheDocument()
  })

  it('should display error text when error is present', async () => {
    render(() => <ComponentUnderTest invalid />)
    expect(screen.getByText('Fieldset Error Text')).toBeInTheDocument()
  })

  it('should not display error text when no error is present', async () => {
    render(() => <ComponentUnderTest />)
    expect(screen.queryByText('Error Info')).not.toBeInTheDocument()
  })

  it('should react to disabled and invalid prop changes', async () => {
    const [disabled, setDisabled] = createSignal(false)
    const [invalid, setInvalid] = createSignal(false)
    render(() => (
      <>
        <button onClick={() => setDisabled(true)}>Disable</button>
        <button onClick={() => setInvalid(true)}>Invalidate</button>
        <ComponentUnderTest disabled={disabled()} invalid={invalid()} />
      </>
    ))

    const fieldset = document.querySelector('fieldset')!
    const fieldRoot = document.querySelector<HTMLElement>('[data-scope="field"][data-part="root"]')!
    const input = screen.getByRole('textbox', { name: /label/i })
    const helperText = screen.getByText('Fieldset Helper Text')

    await waitFor(() => expect(fieldset).toHaveAttribute('aria-describedby', helperText.id))

    await user.click(screen.getByRole('button', { name: 'Disable' }))
    expect(fieldset).toBeDisabled()
    expect(input).toBeDisabled()
    expect(input).toHaveAttribute('disabled')
    expect(fieldRoot).toHaveAttribute('data-disabled')
    expect(screen.getByText('Legend')).toHaveAttribute('data-disabled')

    await user.click(screen.getByRole('button', { name: 'Invalidate' }))
    const errorText = screen.getByText('Fieldset Error Text')
    expect(fieldset).toHaveAttribute('data-invalid')
    expect(screen.getByText('Legend')).toHaveAttribute('data-invalid')
    await waitFor(() =>
      expect(fieldset).toHaveAttribute(
        'aria-describedby',
        `${errorText.id} ${helperText.id}`,
      ),
    )
  })

  it('updates text ids and aria-describedby when id changes', async () => {
    const [id, setId] = createSignal('billing')
    render(() => <ComponentUnderTest id={id()} invalid />)

    const fieldset = document.querySelector('fieldset')!
    const helperText = screen.getByText('Fieldset Helper Text')
    const errorText = screen.getByText('Fieldset Error Text')

    await waitFor(() =>
      expect(fieldset).toHaveAttribute(
        'aria-describedby',
        'fieldset::billing::error-text fieldset::billing::helper-text',
      ),
    )
    expect(helperText).toHaveAttribute('id', 'fieldset::billing::helper-text')
    expect(errorText).toHaveAttribute('id', 'fieldset::billing::error-text')

    setId('shipping')

    await waitFor(() =>
      expect(helperText).toHaveAttribute('id', 'fieldset::shipping::helper-text'),
    )
    expect(errorText).toHaveAttribute('id', 'fieldset::shipping::error-text')
    await waitFor(() =>
      expect(fieldset).toHaveAttribute(
        'aria-describedby',
        'fieldset::shipping::error-text fieldset::shipping::helper-text',
      ),
    )
  })

  it('associates helper and error text inside a shadow root', async () => {
    const host = document.createElement('div')
    const shadowRoot = host.attachShadow({ mode: 'open' })
    const container = document.createElement('div')
    shadowRoot.append(container)
    document.body.append(host)

    try {
      render(() => <ComponentUnderTest id="shadow-fieldset" invalid />, { container })

      const fieldset = shadowRoot.querySelector('fieldset')
      const helperText = shadowRoot.getElementById('fieldset::shadow-fieldset::helper-text')
      const errorText = shadowRoot.getElementById('fieldset::shadow-fieldset::error-text')

      expect(fieldset).not.toBeNull()
      expect(helperText).not.toBeNull()
      expect(errorText).not.toBeNull()
      expect(document.getElementById(helperText!.id)).toBeNull()
      await waitFor(() =>
        expect(fieldset).toHaveAttribute(
          'aria-describedby',
          `${errorText!.id} ${helperText!.id}`,
        ),
      )
    }
    finally {
      host.remove()
    }
  })
})
