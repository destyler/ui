import type { PropTypes } from '@destyler/vue'
import type { ComputedRef } from 'vue'
import type { RootEmits } from '../namespace'
import type { EmitFn, Optional } from '~/types'
import * as slider from '@destyler/slider'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'
import { DEFAULT_LOCALE, useEnvironmentContext, useLocaleContext } from '~/providers'
import { cleanProps } from '~/utils'

export interface UseSliderProps extends Optional<Omit<slider.Context, 'dir' | 'getRootNode' | 'value'>, 'id'> {
  /**
   * The initial value of the slider when it is first rendered.
   * Use when you do not need to control the state of the slider.
   */
  defaultValue?: slider.Context['value']
  modelValue?: slider.Context['value']
}
export interface UseSliderReturn extends ComputedRef<slider.Api<PropTypes>> {}

export function useSlider(props: UseSliderProps = {}, emit?: EmitFn<RootEmits>): UseSliderReturn {
  const id = useId()
  const env = useEnvironmentContext()
  const locale = useLocaleContext(DEFAULT_LOCALE)
  const context = computed<slider.Context>(() => ({
    id,
    dir: locale.value.dir,
    value: props.modelValue ?? props.defaultValue,
    getRootNode: env?.value.getRootNode,
    onFocusChange: details => emit?.('focusChange', details),
    onValueChangeEnd: details => emit?.('valueChangeEnd', details),
    onValueChange: (details) => {
      emit?.('valueChange', details)
      emit?.('update:modelValue', details.value)
    },
    ...cleanProps(props),
  }))

  const [state, send] = useMachine(slider.machine(context.value), { context })
  return computed(() => slider.connect(state.value, send, normalizeProps))
}
