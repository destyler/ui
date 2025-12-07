import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-vue'
import { page } from 'vitest/browser'
import CreateContextConsumerWithFallback from './fixtures/CreateContextConsumerWithFallback.vue'
import CreateContextProvider from './fixtures/CreateContextProvider.vue'

describe('util: createContext', () => {
  it('should use fallback value when no provider', async () => {
    render(CreateContextConsumerWithFallback)

    const element = page.getByTestId('consumer')
    await expect.element(element).toHaveTextContent('fallback-value')
  })

  it('should provide and inject context value', async () => {
    render(CreateContextProvider, {
      props: {
        value: 'test-value',
      },
    })

    const element = page.getByTestId('consumer')
    await vi.waitFor(async () => {
      await expect.element(element).toHaveTextContent('test-value')
    }, { timeout: 5000 })
  })

  it('should provide object context', async () => {
    render(CreateContextProvider, {
      props: {
        value: { name: 'test', count: 42 },
      },
    })

    const element = page.getByTestId('consumer')
    await vi.waitFor(async () => {
      await expect.element(element).toHaveTextContent('test - 42')
    }, { timeout: 5000 })
  })

  it('should override parent context with nested provider', async () => {
    render(CreateContextProvider, {
      props: {
        value: 'parent-value',
        nested: true,
        nestedValue: 'nested-value',
      },
    })

    const consumers = page.getByTestId('consumer')
    // First consumer should have parent value
    await vi.waitFor(async () => {
      await expect.element(consumers.first()).toHaveTextContent('parent-value')
    }, { timeout: 5000 })

    const nestedConsumer = page.getByTestId('nested-consumer')
    await vi.waitFor(async () => {
      await expect.element(nestedConsumer).toHaveTextContent('nested-value')
    }, { timeout: 5000 })
  })
})
