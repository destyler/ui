import { render, screen } from '@solidjs/testing-library'
import user from '@testing-library/user-event'
import { Edit, editAnatomy } from '../'
import { getExports, getParts } from '../../../setup-test'
import { WithField } from '../examples/WithField'
import { ComponentUnderTest } from './basic'
import { ControlledComponentUnderTest } from './controlled'

describe('edit', () => {
  it.each(getParts(editAnatomy))('should render part %s', async (part) => {
    render(() => <ComponentUnderTest />)

    expect(document.querySelector(part)).toBeInTheDocument()
  })

  it.each(getExports(editAnatomy))('should export %s', async (part) => {
    expect(Edit[part]).toBeDefined()
  })

  it('should render controlled component', async () => {
    render(() => <ControlledComponentUnderTest />)
  })

  it('prefers falsy custom preview children over the machine value', () => {
    render(() => (
      <Edit.Root defaultValue="Machine value">
        <Edit.Preview data-testid="preview">{0}</Edit.Preview>
      </Edit.Root>
    ))

    expect(screen.getByTestId('preview')).toHaveTextContent('0')
    expect(screen.queryByText('Machine value')).not.toBeInTheDocument()
  })

  it('should be possible to focus the placeholder and enter a value', async () => {
    render(() => <ControlledComponentUnderTest />)
    screen.getByText('Placeholder').focus()
    await user.type(screen.getByLabelText('editable input'), 'Solid')

    expect(await screen.findByText('Solid')).toBeInTheDocument()
  })

  it('should be possible to dbl click the placeholder to enter a value', async () => {
    render(() => <ControlledComponentUnderTest activationMode="dblclick" />)
    await user.dblClick(screen.getByText('Placeholder'))

    await user.clear(screen.getByRole('textbox'))
    await user.type(screen.getByRole('textbox'), 'React', { delay: 20 })

    await screen.findByText('React')
  })

  it('should be possible to edit an existing value', async () => {
    render(() => <ControlledComponentUnderTest activationMode="dblclick" value="React" />)

    await user.dblClick(screen.getByText('React'))

    await user.clear(screen.getByRole('textbox'))

    await user.type(screen.getByRole('textbox'), 'Solid', { delay: 20 })
    await user.click(screen.getByText('Save'))

    await screen.findByText('Solid')
  })

  it('should be possible to hide input if click EditCancelTrigger ', async () => {
    render(() => <ControlledComponentUnderTest activationMode="dblclick" />)

    await user.dblClick(screen.getByText('Placeholder'))

    const input = screen.getByRole('textbox')
    expect(input).not.toHaveAttribute('hidden', '')

    const editCancelTriggerButton = screen.getByRole('button', {
      name: 'cancel',
    })

    await user.click(editCancelTriggerButton)

    expect(input).toHaveAttribute('hidden', '')
  })
})

describe('edit / Field', () => {
  it('should set edit as required', async () => {
    render(() => <WithField required />)
    expect(screen.getByRole('textbox', { hidden: true })).toBeRequired()
  })

  it('should set edit as disabled', async () => {
    render(() => <WithField disabled />)
    expect(screen.getByRole('textbox', { hidden: true })).toBeDisabled()
  })

  it('should set edit as readonly', async () => {
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

  it('should not display error text when no error is present', async () => {
    render(() => <WithField />)
    expect(screen.queryByText('Error Info')).not.toBeInTheDocument()
  })
})
