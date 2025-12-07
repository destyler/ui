import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-vue'
import { page, userEvent } from 'vitest/browser'
import UseForwardPropsEmitsBasic from './fixtures/UseForwardPropsEmitsBasic.vue'
import UseForwardPropsEmitsParent from './fixtures/UseForwardPropsEmitsParent.vue'

describe('composable: useForwardPropsEmits', () => {
  it('should forward both props and emits', async () => {
    const onUpdate = vi.fn()

    render(UseForwardPropsEmitsBasic, {
      props: {
        label: 'Test Label',
        onUpdate,
      },
    })

    const element = page.getByTestId('label')
    await expect.element(element).toHaveTextContent('Test Label')

    const button = page.getByTestId('button')
    await userEvent.click(button)

    expect(onUpdate).toHaveBeenCalledWith('clicked')
  })

  it('should forward props and emits from parent to child', async () => {
    const onUpdate = vi.fn()

    render(UseForwardPropsEmitsParent, {
      props: {
        label: 'Parent Label',
        value: 'test-value',
        onUpdate,
      },
    })

    const element = page.getByTestId('child-label')
    await expect.element(element).toHaveTextContent('Parent Label')
    await expect.element(page.getByTestId('child-value')).toHaveTextContent('test-value')

    const button = page.getByTestId('child-button')
    await userEvent.click(button)

    expect(onUpdate).toHaveBeenCalled()
  })

  it('should handle props without emits', async () => {
    render(UseForwardPropsEmitsBasic, {
      props: {
        label: 'No Emit Label',
      },
    })

    const element = page.getByTestId('label')
    await expect.element(element).toHaveTextContent('No Emit Label')
  })
})
