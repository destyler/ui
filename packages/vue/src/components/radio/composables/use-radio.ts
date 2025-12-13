import type { PropTypes } from '@destyler/vue'
import type { ComputedRef } from 'vue'
import type { RootEmits } from '../types'
import type { EmitFn, Optional } from '~/types'
import * as radio from '@destyler/radio'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'
import { DEFAULT_LOCALE, useEnvironmentContext, useLocaleContext } from '~/providers'
import { cleanProps } from '~/utils'

export interface UseRadioProps extends Optional<Omit<radio.Context, 'dir' | 'getRootNode' | 'value'>, 'id'> {
  /**
   * The initial value of the radio when it is first rendered.
   * Use when you do not need to control the state of the radio.
   */
  defaultValue?: radio.Context['value']
  modelValue?: radio.Context['value']
}
export interface UseRadioReturn extends ComputedRef<radio.Api<PropTypes>> {}

export function useRadio(props: UseRadioProps = {}, emit?: EmitFn<RootEmits>): UseRadioReturn {
  const id = useId()
  const env = useEnvironmentContext()
  const locale = useLocaleContext(DEFAULT_LOCALE)
  const context = computed<radio.Context>(() => ({
    id,
    dir: locale.value.dir,
    value: props.modelValue ?? props.defaultValue,
    getRootNode: env?.value.getRootNode,
    onValueChange: (details) => {
      emit?.('valueChange', details)
      emit?.('update:modelValue', details.value)
    },
    ...cleanProps(props),
  }))

  const [state, send] = useMachine(radio.machine(context.value), { context })

  return computed(() => radio.connect(state.value, send, normalizeProps))
}
