import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import { page } from 'vitest/browser'
import UnrefElementBasic from './UnrefElementBasic.vue'
import UnrefElementWithComponent from './UnrefElementWithComponent.vue'

describe('util: unrefElement', () => {
  it('should unref a template ref to HTMLElement', async () => {
    render(UnrefElementBasic)

    const element = page.getByTestId('result')
    await expect.element(element).toHaveTextContent('DIV')
  })

  it('should get $el from Vue component instance', async () => {
    render(UnrefElementWithComponent)

    const element = page.getByTestId('result')
    await expect.element(element).toHaveTextContent('BUTTON')
  })

  it('should handle null ref', async () => {
    render(UnrefElementBasic, {
      props: {
        showElement: false,
      },
    })

    const element = page.getByTestId('result')
    await expect.element(element).toHaveTextContent('null')
  })
})
