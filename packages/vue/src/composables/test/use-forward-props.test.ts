import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import { page } from 'vitest/browser'
import UseForwardPropsBasic from './fixtures/UseForwardPropsBasic.vue'
import UseForwardPropsParent from './fixtures/UseForwardPropsParent.vue'

describe('composable: useForwardProps', () => {
  it('should forward props correctly', async () => {
    render(UseForwardPropsBasic, {
      props: {
        title: 'Test Title',
        disabled: true,
      },
    })

    const element = page.getByTestId('forwarded')
    await expect.element(element).toHaveTextContent('Test Title')
    await expect.element(element).toHaveAttribute('data-disabled', 'true')
  })

  it('should use default props when not provided', async () => {
    render(UseForwardPropsBasic, {
      props: {
        title: 'Custom Title',
      },
    })

    const element = page.getByTestId('forwarded')
    await expect.element(element).toHaveTextContent('Custom Title')
    await expect.element(element).toHaveAttribute('data-disabled', 'false')
  })

  it('should forward props from parent to child', async () => {
    render(UseForwardPropsParent, {
      props: {
        title: 'Parent Title',
        variant: 'primary',
      },
    })

    const element = page.getByTestId('child')
    await expect.element(element).toHaveTextContent('Parent Title')
    await expect.element(element).toHaveAttribute('data-variant', 'primary')
  })

  it('should handle camelCase and kebab-case props', async () => {
    render(UseForwardPropsBasic, {
      props: {
        'data-custom': 'value',
        'title': 'Title',
      },
    })

    const element = page.getByTestId('forwarded')
    await expect.element(element).toHaveTextContent('Title')
  })
})
