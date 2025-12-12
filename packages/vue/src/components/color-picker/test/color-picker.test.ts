import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-vue'
import { page, userEvent } from 'vitest/browser'
import { getExports, getParts } from '../../../../../../utils/test'
import Basic from '../examples/Basic.vue'
import WithField from '../examples/WithField.vue'
import { ColorPicker, colorPickerAnatomy, parseColor  } from '../index'

describe('[color-picker] component', () => {
  it.each(getParts(colorPickerAnatomy))('should render part %s', async (part) => {
    render(Basic)
    expect(document.querySelector(part)).toBeInTheDocument()
  })

  it.each(getExports(colorPickerAnatomy))('should export %s', async (part) => {
    expect(ColorPicker[part]).toBeDefined()
  })

  it('should be able to lazy mount', async () => {
    render(Basic, {
      props: {
        lazyMount: true,
      },
    })

    await expect.element(page.getByTestId('positioner')).not.toBeInTheDocument()

    await userEvent.click(page.getByTestId('trigger'))
    await expect.element(page.getByTestId('positioner')).toBeInTheDocument()

    await userEvent.click(page.getByTestId('trigger'))
    await expect.element(page.getByTestId('positioner')).toBeInTheDocument()
  }, 7000)

  it('should lazy mount and unmount on exit', async () => {
    render(Basic, {
      props: {
        lazyMount: true,
        unmountOnExit: true,
      },
    })

    await expect.element(page.getByTestId('positioner')).not.toBeInTheDocument()

    await userEvent.click(page.getByTestId('trigger'))
    await expect.element(page.getByTestId('positioner')).toBeInTheDocument()

    await userEvent.click(page.getByTestId('trigger'))
    await vi.waitFor(async () =>
      await expect.element(page.getByTestId('positioner')).not.toBeInTheDocument(),
    )
  }, 7000)

  it('should render with default value', async () => {
    render(Basic, { props: { defaultValue: parseColor('#ff00ff') } })

    await expect.element(page.getByTestId('swatch-trigger')).toHaveStyle({
      backgroundColor: 'rgb(255, 0, 255)',
    })
  })
})

describe('color Picker / Field', () => {
  it('should set color picker as required', async () => {
    render(WithField, { props: { required: true } })
    await expect.element(page.getByRole('textbox', { name: /label/i })).toBeRequired()
  })

  it('should set color picker as disabled', async () => {
    render(WithField, { props: { disabled: true } })
    await expect.element(page.getByRole('textbox', { name: /label/i })).toBeDisabled()
  })

  it('should set color picker as readonly', async () => {
    render(WithField, { props: { readOnly: true } })
    await expect.element(page.getByRole('textbox', { name: /label/i })).toHaveAttribute('readonly')
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
    await expect.element(page.getByRole('textbox', { name: /hex/i })).toHaveFocus()
  })

  it('should not display error text when no error is present', async () => {
    render(WithField)
    await expect.element(page.getByTestId('Error Info')).not.toBeInTheDocument()
  })
})
