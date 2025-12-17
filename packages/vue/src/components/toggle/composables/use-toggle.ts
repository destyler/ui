import type { PropTypes } from '@destyler/vue'
import type { ComputedRef } from 'vue'
import type { RootEmits, RootProps } from '../types'
import type { EmitFn } from '~/types'
import { dataAttr } from '@destyler/dom'
import { computed } from 'vue'
import { useVModel } from '~/composables/use-v-model'
import { parts } from '../anatomy'

export interface UseToggleProps extends RootProps {}

export interface UseToggleReturn
  extends ComputedRef<{
    pressed: boolean
    disabled: boolean
    setPressed: (value: boolean) => void
    getRootProps: () => PropTypes['button']
    getIndicatorProps: () => PropTypes['div']
  }> {}

export function useToggle(props: UseToggleProps, emit?: EmitFn<RootEmits>): UseToggleReturn {
  const pressedState = useVModel(props, 'modelValue', emit, {
    defaultValue: !!props.defaultPressed,
    passive: (props.modelValue === undefined) as false,
    eventName: ['pressedChange', 'update:modelValue'],
  })

  const disabled = computed(() => !!props.disabled)

  return computed(() => ({
    pressed: pressedState.value,
    disabled: disabled.value,
    setPressed(value: boolean) {
      pressedState.value = value
    },
    getRootProps() {
      return {
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        ...(parts.root.attrs as any),
        'type': 'button',
        'disabled': disabled.value,
        'aria-pressed': pressedState.value,
        'data-state': pressedState.value ? 'on' : 'off',
        'data-pressed': dataAttr(pressedState.value),
        'data-disabled': dataAttr(disabled.value),
        onClick(event) {
          if (event.defaultPrevented)
            return
          if (disabled.value)
            return
          pressedState.value = !pressedState.value
        },
      }
    },

    getIndicatorProps() {
      return {
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        ...(parts.indicator.attrs as any),
        'data-disabled': dataAttr(disabled.value),
        'data-pressed': dataAttr(pressedState.value),
        'data-state': pressedState.value ? 'on' : 'off',
      }
    },
  }))
}
