import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-vue'
import { page, userEvent } from 'vitest/browser'
import { getExports, getParts } from '../../../../../../utils/test'
import Basic from '../examples/Basic.vue'
import WithField from '../examples/WithField.vue'
import { Combobox, comboboxAnatomy } from '../index'

describe('[combobox] component', () => {
  it.each(getParts(comboboxAnatomy))('should render part %s', async (part) => {
    render(Basic)
    expect(document.querySelector(part)).toBeInTheDocument()
  })

  it.each(getExports(comboboxAnatomy))('should export %s', async (part) => {
    expect(Combobox[part]).toBeDefined()
  })

  it('should show options on click', async () => {
    render(Basic)

    await userEvent.click(page.getByText('Open'))
    await vi.waitFor(async () => await expect.element(page.getByRole('option', { name: 'React' })).toBeVisible())
  })

  it('should handle item selection', async () => {
    render(Basic)

    await userEvent.click(page.getByText('Open'))
    await vi.waitFor(async () => await expect.element(page.getByRole('option', { name: 'React' })).toBeVisible())

    await userEvent.click(page.getByRole('option', { name: 'React' }))
    await vi.waitFor(async () => await expect.element(page.getByRole('combobox')).toHaveValue('React'))
  })

  it('should call onValueChange when item is selected', async () => {
    const onValueChange = vi.fn()
    render(Basic, { props: { onValueChange } })

    await userEvent.click(page.getByText('Open'))
    await vi.waitFor(async () => await expect.element(page.getByRole('option', { name: 'React' })).toBeVisible())

    await userEvent.click(page.getByRole('option', { name: 'React' }))
    await vi.waitFor(() => expect(onValueChange).toHaveBeenCalledTimes(1))
  })

  it('should open menu when onOpenChange is called', async () => {
    const onOpenChange = vi.fn()
    render(Basic, { props: { onOpenChange } })

    await userEvent.click(page.getByText('Open'))
    await vi.waitFor(() => expect(onOpenChange).toHaveBeenCalledTimes(1))
  })

  it('should be read-only when readOnly is true', async () => {
    render(Basic, { props: { readOnly: true } })

    await userEvent.click(page.getByText('Open'))
    await vi.waitFor(async () => await expect.element(page.getByRole('option', { name: 'React' })).not.toBeInTheDocument())
  })

  it('should be able to lazy mount its items', async () => {
    render(Basic, { props: { lazyMount: true } })
    await expect.element(page.getByTestId('positioner')).not.toBeInTheDocument()

    await userEvent.click(page.getByText('Open'))
    await vi.waitFor(async () => await expect.element(page.getByTestId('positioner')).toBeVisible())
  })

  it('should be able to lazy mount and unmount its items', async () => {
    render(Basic, { props: { lazyMount: true, unmountOnExit: true } })
    await expect.element(page.getByTestId('positioner')).not.toBeInTheDocument()

    await userEvent.click(page.getByText('Open'))
    await vi.waitFor(async () => await expect.element(page.getByTestId('positioner')).toBeInTheDocument())

    await userEvent.click(page.getByText('Open'))
    await vi.waitFor(async () => await expect.element(page.getByTestId('positioner')).not.toBeInTheDocument())
  })
})

describe('combobox / Field', () => {
  it('should set combobox as required', async () => {
    render(WithField, { props: { required: true } })
    await expect.element(page.getByRole('combobox', { name: /label/i })).toBeRequired()
  })

  it('should set combobox as disabled', async () => {
    render(WithField, { props: { disabled: true } })
    await expect.element(page.getByRole('combobox', { name: /label/i })).toBeDisabled()
  })

  it('should set combobox as readonly', async () => {
    render(WithField, { props: { readOnly: true } })
    await expect.element(page.getByRole('combobox', { name: /label/i })).toHaveAttribute('readonly')
  })

  it('should display helper text', async () => {
    render(WithField)
    await expect.element(page.getByText('Additional Info')).toBeInTheDocument()
  })

  it('should display error text when error is present', async () => {
    render(WithField, { props: { invalid: true } })
    await expect.element(page.getByText('Error Info')).toBeInTheDocument()
  })

  it('should focus on combobox when label is clicked', async () => {
    render(WithField)
    await userEvent.click(page.getByText(/label/i))
    await expect.element(page.getByRole('combobox', { name: /label/i })).toHaveFocus()
  })

  it('should not display error text when no error is present', async () => {
    render(WithField)
    await expect.element(page.getByText('Error Info')).not.toBeInTheDocument()
  })
})
