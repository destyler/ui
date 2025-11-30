import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-vue'
import { page } from 'vitest/browser'
import UseRenderStrategyBasic from './UseRenderStrategyBasic.vue'

describe('composable: useRenderStrategyProps', () => {
  it('should use default values when not provided', async () => {
    render(UseRenderStrategyBasic)

    const lazyMount = page.getByTestId('lazy-mount')
    const unmountOnExit = page.getByTestId('unmount-on-exit')

    await expect.element(lazyMount).toHaveTextContent('false')
    await expect.element(unmountOnExit).toHaveTextContent('false')
  })

  it('should provide and consume render strategy props', async () => {
    render(UseRenderStrategyBasic, {
      props: {
        lazyMount: true,
        unmountOnExit: false,
      },
    })

    const lazyMount = page.getByTestId('lazy-mount')
    const unmountOnExit = page.getByTestId('unmount-on-exit')

    await vi.waitFor(async () => {
      await expect.element(lazyMount).toHaveTextContent('true')
    }, { timeout: 5000 })
    await expect.element(unmountOnExit).toHaveTextContent('false')
  })
})
