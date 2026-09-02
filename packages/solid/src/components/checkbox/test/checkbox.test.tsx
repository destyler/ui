import { fireEvent, render, screen, waitFor } from '@solidjs/testing-library'
import user from '@testing-library/user-event'
import { createSignal } from 'solid-js'
import { Checkbox, checkboxAnatomy, useCheckbox } from '../'
import { getExports, getParts } from '../../../setup-test'
import { WithField } from '../examples/WithField'
import { ComponentUnderTest } from './basic'
import { ControlledComponentUnderTest } from './controlled'

describe('checkbox', () => {
  it.each(getParts(checkboxAnatomy))('should render part %s', async (part) => {
    render(() => <ComponentUnderTest />)

    expect(document.querySelector(part)).toBeInTheDocument()
  })

  it.each(getExports(checkboxAnatomy))('should export %s', async (part) => {
    expect(Checkbox[part]).toBeDefined()
  })

  it('should handle check and unchecked', async () => {
    const onChange = vi.fn()
    render(() => <ComponentUnderTest onChange={onChange} />)
    const checkbox = screen.getByRole('checkbox')
    await user.click(checkbox)
    expect(checkbox).toBeChecked()
  })

  it('should invoke onCheckedChange', async () => {
    const onCheckedChange = vi.fn()
    render(() => <ComponentUnderTest onCheckedChange={onCheckedChange} />)

    fireEvent.click(screen.getByRole('checkbox'))
    await waitFor(() => expect(onCheckedChange).toHaveBeenCalledWith({ checked: true }))

    fireEvent.click(screen.getByRole('checkbox'))
    await waitFor(() => expect(onCheckedChange).toHaveBeenCalledWith({ checked: false }))
  })

  it('should handle indeterminate state properly', async () => {
    render(() => <ComponentUnderTest checked="indeterminate" />)
    expect(screen.getByTestId('control')).toHaveAttribute('data-state', 'indeterminate')
  })

  it('should allow controlled usage', async () => {
    render(() => <ControlledComponentUnderTest />)

    expect(screen.getByRole('checkbox')).not.toBeChecked()
    await user.click(screen.getByText('set checked'))
    await waitFor(() => expect(screen.getByRole('checkbox')).toBeChecked())
  })

  it('should preserve an uncontrolled value when reactive props change', async () => {
    const [disabled, setDisabled] = createSignal(false)
    render(() => (
      <>
        <Checkbox.Root defaultChecked disabled={disabled()}>
          <Checkbox.Label>Standalone checkbox</Checkbox.Label>
          <Checkbox.Control />
          <Checkbox.HiddenInput />
        </Checkbox.Root>
        <button type="button" onClick={() => setDisabled(true)}>
          disable
        </button>
      </>
    ))

    const checkbox = screen.getByRole('checkbox', { name: 'Standalone checkbox' })
    const control = document.querySelector<HTMLElement>('[data-scope="checkbox"][data-part="control"]')!
    expect(checkbox).toBeChecked()
    expect(control).toHaveAttribute('data-state', 'checked')

    await user.click(checkbox)
    expect(checkbox).not.toBeChecked()
    expect(control).toHaveAttribute('data-state', 'unchecked')

    await user.click(screen.getByRole('button', { name: 'disable' }))
    await waitFor(() => expect(checkbox).toBeDisabled())
    expect(checkbox).not.toBeChecked()
    expect(control).toHaveAttribute('data-state', 'unchecked')
  })

  it('should switch the API used by RootProvider when value changes', async () => {
    function SwitchableRootProvider() {
      const unchecked = useCheckbox({ checked: false })
      const checked = useCheckbox({ checked: true })
      const [useChecked, setUseChecked] = createSignal(false)

      return (
        <>
          <button type="button" onClick={() => setUseChecked(true)}>
            switch API
          </button>
          <Checkbox.RootProvider value={useChecked() ? checked : unchecked}>
            <Checkbox.Label>Provider checkbox</Checkbox.Label>
            <Checkbox.Control data-testid="provider-control" />
            <Checkbox.HiddenInput />
          </Checkbox.RootProvider>
        </>
      )
    }

    render(() => <SwitchableRootProvider />)

    const checkbox = screen.getByRole('checkbox', { name: 'Provider checkbox' })
    expect(checkbox).not.toBeChecked()
    expect(screen.getByTestId('provider-control')).toHaveAttribute('data-state', 'unchecked')

    await user.click(screen.getByRole('button', { name: 'switch API' }))

    await waitFor(() => expect(checkbox).toBeChecked())
    expect(screen.getByTestId('provider-control')).toHaveAttribute('data-state', 'checked')
  })

  it('uses the latest group value accessor and callback', async () => {
    const [useSecondState, setUseSecondState] = createSignal(false)
    const [firstValue] = createSignal(['react'])
    const [secondValue] = createSignal(['solid'])
    const firstOnValueChange = vi.fn()
    const secondOnValueChange = vi.fn()

    render(() => (
      <>
        <button type="button" onClick={() => setUseSecondState(true)}>
          switch group state
        </button>
        <Checkbox.Group
          value={useSecondState() ? secondValue : firstValue}
          onValueChange={useSecondState() ? secondOnValueChange : firstOnValueChange}
        >
          <Checkbox.Root value="react">
            <Checkbox.Label>React</Checkbox.Label>
            <Checkbox.HiddenInput />
          </Checkbox.Root>
          <Checkbox.Root value="solid">
            <Checkbox.Label>Solid</Checkbox.Label>
            <Checkbox.HiddenInput />
          </Checkbox.Root>
        </Checkbox.Group>
      </>
    ))

    const react = screen.getByRole('checkbox', { name: 'React' })
    const solid = screen.getByRole('checkbox', { name: 'Solid' })
    expect(react).toBeChecked()
    expect(solid).not.toBeChecked()

    await user.click(screen.getByRole('button', { name: 'switch group state' }))
    await waitFor(() => expect(solid).toBeChecked())
    expect(react).not.toBeChecked()

    await user.click(react)
    expect(secondOnValueChange).toHaveBeenCalledWith(['solid', 'react'])
    expect(firstOnValueChange).not.toHaveBeenCalled()
  })
})

describe('checkbox / Field', () => {
  it('should set checkbox as required', async () => {
    render(() => <WithField required />)
    expect(screen.getByRole('checkbox', { name: /label/i })).toBeRequired()
  })

  it('should set input as disabled', async () => {
    render(() => <WithField disabled />)
    expect(screen.getByRole('checkbox', { name: /label/i })).toBeDisabled()
  })

  it('should set input as readonly', async () => {
    render(() => <WithField readOnly />)
    expect(screen.getByText('Label')).toHaveAttribute('data-readonly')
  })

  it('should display helper text', async () => {
    render(() => <WithField />)
    expect(screen.getByText('Additional Info')).toBeInTheDocument()
  })

  it('should display error text when error is present', async () => {
    render(() => <WithField invalid />)
    expect(screen.getByText('Error Info')).toBeInTheDocument()
  })

  it('should focus on input when label is clicked', async () => {
    render(() => <WithField />)
    await user.click(screen.getByText(/label/i))
    expect(screen.getByRole('checkbox', { name: /label/i })).toHaveFocus()
  })

  it('should not display error text when no error is present', async () => {
    render(() => <WithField />)
    expect(screen.queryByText('Error Info')).not.toBeInTheDocument()
  })
})
