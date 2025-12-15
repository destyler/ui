import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-vue'
import { page, userEvent } from 'vitest/browser'
import { getExports, getParts } from '../../../../../../utils/test'
import Basic from '../examples/Basic.vue'
import WithField from '../examples/WithField.vue'
import { Select, selectAnatomy } from '../index'

describe('[select] component', () => {
  it.each(getParts(selectAnatomy))('should render part %s', async (part) => {
    render(Basic)
    expect(document.querySelector(part)).toBeInTheDocument()
  })

  it.each(getExports(selectAnatomy))('should export %s', async (part) => {
    expect(Select[part]).toBeDefined()
  })

  it('should handle item selection', async () => {
    render(Basic)

    const trigger = page.getByRole('combobox', { name: 'Framework' })
    await userEvent.click(trigger)

    const item = page.getByTestId('positioner').getByText('React')

    await userEvent.click(item)
    await vi.waitFor(async () => await expect.element(trigger).toHaveTextContent('React'))
  })

  it('should close on select', async () => {
    render(Basic)

    const trigger = page.getByRole('combobox', { name: 'Framework' })
    await userEvent.click(trigger)

    const item = page.getByTestId('positioner').getByText('React')

    await userEvent.click(item)
    await vi.waitFor(async () => await expect.element(page.getByText('Frameworks')).not.toBeVisible())
  })

  it('should be disabled when disabled is true', async () => {
    render(Basic, { props: { disabled: true } })

    const trigger = page.getByRole('combobox', { name: 'Framework' })

    await expect.element(trigger).toBeDisabled()
  })

  it('should handle multiple selection', async () => {
    render(Basic, { props: { multiple: true } })

    const trigger = page.getByRole('combobox', { name: 'Framework' })

    await userEvent.click(trigger)

    const positioner = page.getByTestId('positioner')
    const itemReact = positioner.getByText('React')
    const itemVue = positioner.getByText('Vue')

    await userEvent.click(itemReact)
    await userEvent.click(itemVue)
    await vi.waitFor(async () => await expect.element(trigger).toHaveTextContent('React, Vue'))
  })

  it('should call onValueChange when item is selected', async () => {
    const onValueChange = vi.fn()
    render(Basic, { props: { onValueChange } })

    const trigger = page.getByRole('combobox', { name: 'Framework' })

    await userEvent.click(trigger)

    const item = page.getByTestId('positioner').getByText('React')

    await userEvent.click(item)
    await vi.waitFor(() => expect(onValueChange).toHaveBeenCalledTimes(1))
  })

  it('should open menu when onOpenChange is called', async () => {
    const onOpenChange = vi.fn()
    render(Basic, { props: { onOpenChange } })

    const trigger = page.getByRole('combobox', { name: 'Framework' })

    await userEvent.click(trigger)
    await vi.waitFor(() => expect(onOpenChange).toHaveBeenCalledTimes(1))
  })

  it('should be read-only when readOnly is true', async () => {
    render(Basic, { props: { readOnly: true } })

    const trigger = page.getByRole('combobox', { name: 'Framework' })

    await userEvent.click(trigger)
    await vi.waitFor(async () => await expect.element(page.getByTestId('positioner')).not.toBeVisible())
  })

  it('should be able to lazy mount its items', async () => {
    render(Basic, { props: { lazyMount: true } })
    await expect.element(page.getByTestId('positioner')).not.toBeInTheDocument()

    await userEvent.click(page.getByRole('combobox', { name: 'Framework' }))
    await expect.element(page.getByTestId('positioner')).toBeInTheDocument()
  })

  it('should be able to lazy mount and unmount its items', async () => {
    render(Basic, { props: { lazyMount: true, unmountOnExit: true } })
    await expect.element(page.getByTestId('positioner')).not.toBeInTheDocument()
    await userEvent.click(page.getByRole('combobox', { name: 'Framework' }))
    await expect.element(page.getByTestId('positioner')).toBeInTheDocument()

    await userEvent.click(page.getByRole('combobox', { name: 'Framework' }))
    await vi.waitFor(async () => await expect.element(page.getByTestId('positioner')).not.toBeInTheDocument())
  })
})

describe('[select] Field', () => {
  it('should set input as disabled', async () => {
    render(WithField, { props: { disabled: true } })
    await expect.element(page.getByRole('combobox')).toBeDisabled()
  })

  it('should set input as readonly', async () => {
    render(WithField, { props: { readOnly: true } })
    await expect.element(page.getByRole('combobox')).toHaveAttribute('data-readonly')
  })

  it('should display helper text', async () => {
    render(WithField)
    await expect.element(page.getByText('Additional Info')).toBeInTheDocument()
  })

  it('should display error text when error is present', async () => {
    render(WithField, { props: { invalid: true } })
    await expect.element(page.getByText('Error Info')).toBeInTheDocument()
  })

  it('should focus on input when label is clicked', async () => {
    render(WithField)
    await userEvent.click(page.getByText(/label/i))
    await expect.element(page.getByRole('combobox', { name: /label/i })).toHaveFocus()
  })

  it('should not display error text when no error is present', async () => {
    render(WithField)
    await expect.element(page.getByText('Error Info')).not.toBeInTheDocument()
  })
})
