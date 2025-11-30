import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-vue'
import { page, userEvent } from 'vitest/browser'
import { ref } from 'vue'
import UseVModelBasic from './UseVModelBasic.vue'
import UseVModelCustomEvent from './UseVModelCustomEvent.vue'
import UseVModelDefaultValue from './UseVModelDefaultValue.vue'
import UseVModelPassive from './UseVModelPassive.vue'

describe('composable: useVModel', () => {
  it('should sync with v-model in non-passive mode', async () => {
    const modelValue = ref('initial')
    const onUpdate = vi.fn((value: string) => {
      modelValue.value = value
    })

    render(UseVModelBasic, {
      props: {
        "modelValue": modelValue.value,
        'onUpdate:modelValue': onUpdate,
      },
    })

    const input = page.getByTestId('input')
    await expect.element(input).toHaveValue('initial')

    await userEvent.clear(input)
    await userEvent.type(input, 'updated')

    expect(onUpdate).toHaveBeenCalledWith('updated')
  })

  it('should sync with v-model in passive mode', async () => {
    const modelValue = ref('initial')
    const onUpdate = vi.fn((value: string) => {
      modelValue.value = value
    })

    render(UseVModelPassive, {
      props: {
        "modelValue": modelValue.value,
        'onUpdate:modelValue': onUpdate,
      },
    })

    const input = page.getByTestId('input')
    await expect.element(input).toHaveValue('initial')

    await userEvent.clear(input)
    await userEvent.type(input, 'passive-update')

    await vi.waitFor(() => {
      expect(onUpdate).toHaveBeenCalled()
    })
  })

  it('should use default value when modelValue is undefined', async () => {
    render(UseVModelDefaultValue, {
      props: {
        modelValue: undefined,
      },
    })

    const input = page.getByTestId('input')
    await expect.element(input).toHaveValue('default-value')
  })

  it('should emit custom event names', async () => {
    const onCustomEvent = vi.fn()
    const onAnotherEvent = vi.fn()

    render(UseVModelCustomEvent, {
      props: {
        modelValue: 'initial',
        onCustomEvent,
        onAnotherEvent,
      },
    })

    const input = page.getByTestId('input')
    await userEvent.clear(input)
    await userEvent.type(input, 'custom')

    await vi.waitFor(() => {
      expect(onCustomEvent).toHaveBeenCalledWith('custom')
      expect(onAnotherEvent).toHaveBeenCalledWith('custom')
    })
  })

  it('should handle named key prop', async () => {
    const onUpdate = vi.fn()

    render(UseVModelBasic, {
      props: {
        "modelValue": 'test',
        'onUpdate:modelValue': onUpdate,
      },
    })

    const input = page.getByTestId('input')
    await userEvent.clear(input)
    await userEvent.type(input, 'new-value')

    expect(onUpdate).toHaveBeenCalledWith('new-value')
  })
})
