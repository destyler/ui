import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-vue'
import { page } from 'vitest/browser'
import UseForwardExposeChild from './fixtures/UseForwardExposeChild.vue'

describe('composable: useForwardExpose', () => {
  it('should forward ref from child component', async () => {
    render(UseForwardExposeChild)

    const element = page.getByTestId('child-result')
    await vi.waitFor(async () => {
      await expect.element(element).toHaveTextContent('BUTTON')
    }, { timeout: 5000 })
  })
})
