import { render, screen, waitFor } from '@solidjs/testing-library'
import user from '@testing-library/user-event'
import { createSignal } from 'solid-js'
import { Field, fieldAnatomy } from '../'
import { getExports, getParts } from '../../../setup-test'

function ComponentUnderTest(props: Field.RootProps) {
  return (
    <Field.Root {...props}>
      <Field.Label>
        Label
        <Field.RequiredIndicator />
      </Field.Label>
      <Field.Input />
      <Field.HelperText>Some additional Info</Field.HelperText>
      <Field.ErrorText>Error Info</Field.ErrorText>
    </Field.Root>
  )
}

describe('field / Parts & Exports', () => {
  it.each(
    getParts(fieldAnatomy).filter(part => !part.includes('select') && !part.includes('textarea')),
  )('should render part %s', async (part) => {
    render(() => <ComponentUnderTest invalid required />)

    expect(document.querySelector(part)).toBeInTheDocument()
  })

  it.each(getExports(fieldAnatomy))('should export %s', async (part) => {
    expect(Field[part]).toBeDefined()
  })
})

describe('field / Input', () => {
  it('should set textbox as required', async () => {
    render(() => <ComponentUnderTest required />)
    expect(screen.getByRole('textbox', { name: /label/i })).toBeRequired()
    expect(screen.getByText('*')).toBeInTheDocument()
  })

  it('should set textbox as disabled', async () => {
    render(() => <ComponentUnderTest disabled />)
    expect(screen.getByRole('textbox', { name: /label/i })).toBeDisabled()
    expect(document.querySelector('[data-part="root"]')).toHaveAttribute('data-disabled')
    expect(screen.getByText('Label')).toHaveAttribute('data-disabled')
    expect(screen.getByText('Some additional Info')).toHaveAttribute('data-disabled')
  })

  it('should set textbox as readonly', async () => {
    render(() => <ComponentUnderTest readOnly />)
    expect(screen.getByRole('textbox', { name: /label/i })).toHaveAttribute('readonly')
  })

  it('should display helper text', async () => {
    render(() => <ComponentUnderTest />)
    expect(screen.getByText('Some additional Info')).toBeInTheDocument()
  })

  it('should display error text when error is present', async () => {
    render(() => <ComponentUnderTest invalid />)
    expect(screen.getByText('Error Info')).toBeInTheDocument()
  })

  it('should focus on input when label is clicked', async () => {
    render(() => <ComponentUnderTest />)
    await user.click(screen.getByText(/label/i))
    expect(screen.getByRole('textbox', { name: /label/i })).toHaveFocus()
  })

  it('should not display error text when no error is present', async () => {
    render(() => <ComponentUnderTest />)
    expect(screen.queryByText('Error Info')).not.toBeInTheDocument()
  })

  it('should reactively associate helper and error text with the input', async () => {
    const [invalid, setInvalid] = createSignal(false)
    render(() => (
      <>
        <button onClick={() => setInvalid(value => !value)}>Toggle invalid</button>
        <ComponentUnderTest invalid={invalid()} />
      </>
    ))

    const input = screen.getByRole('textbox', { name: /label/i })
    const helperText = screen.getByText('Some additional Info')

    await waitFor(() => expect(input).toHaveAttribute('aria-describedby', helperText.id))

    await user.click(screen.getByRole('button', { name: 'Toggle invalid' }))
    const errorText = screen.getByText('Error Info')

    await waitFor(() =>
      expect(input).toHaveAttribute('aria-describedby', `${errorText.id} ${helperText.id}`),
    )
  })

  it('should apply custom root and control ids consistently', () => {
    render(() => (
      <Field.Root ids={{ root: 'custom-root', control: 'custom-control' }}>
        <Field.Label>Custom label</Field.Label>
        <Field.Input />
        <Field.Context>
          {field => (
            <span data-testid="field-ids">
              {field().ids.root}|{field().ids.control}
            </span>
          )}
        </Field.Context>
      </Field.Root>
    ))

    const root = document.querySelector('[data-scope="field"][data-part="root"]')
    const input = screen.getByRole('textbox', { name: 'Custom label' })
    const label = screen.getByText('Custom label')

    expect(root).toHaveAttribute('id', 'custom-root')
    expect(input).toHaveAttribute('id', 'custom-control')
    expect(label).toHaveAttribute('for', 'custom-control')
    expect(screen.getByTestId('field-ids')).toHaveTextContent('custom-root|custom-control')
  })
})
