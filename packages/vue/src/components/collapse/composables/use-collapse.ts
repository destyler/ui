import type { PropTypes } from '@destyler/vue'
import type { ComputedRef } from 'vue'
import type { RootEmits } from '../types'
import type { EmitFn, Optional } from '~/types'
import * as collapse from '@destyler/collapse'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'
import { DEFAULT_LOCALE, useEnvironmentContext, useLocaleContext } from '~/providers'
import { cleanProps } from '~/utils'

export interface UseCollapseProps extends Optional<Omit<collapse.Context, 'dir' | 'getRootNode' | 'value'>, 'id'> {
  /**
   * The collapse items that are currently expanded.
   * Use this prop to control the state of the items via v-model.
   */
  modelValue?: collapse.Context['value']
  /**
   * The initial value of the collapse that are expanded.
   * Use this when you do not need to control the state of the collapse.
   */
  defaultValue?: collapse.Context['value']
}
export interface UseCollapseReturn extends ComputedRef<collapse.Api<PropTypes>> {}

export function useCollapse(props: UseCollapseProps = {}, emit?: EmitFn<RootEmits>): UseCollapseReturn {
  const id = useId()
  const env = useEnvironmentContext()
  const locale = useLocaleContext(DEFAULT_LOCALE)

  const context = computed<collapse.Context>(() => ({
    id,
    dir: locale.value.dir,
    value: props.modelValue ?? props.defaultValue,
    getRootNode: env?.value.getRootNode,
    onFocusChange: details => emit?.('focusChange', details),
    onValueChange: (details) => {
      emit?.('valueChange', details)
      emit?.('update:modelValue', details.value)
    },
    ...cleanProps(props),
  }))
  const [state, send] = useMachine(collapse.machine(context.value), { context })

  return computed(() => collapse.connect(state.value, send, normalizeProps))
}
