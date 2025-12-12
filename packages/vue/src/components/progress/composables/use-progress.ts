import type {PropTypes} from '@destyler/vue';
import type {ComputedRef} from 'vue';
import type { RootEmits } from '../types'
import type { EmitFn, Optional } from '~/types'
import * as progress from '@destyler/progress'
import { normalizeProps,  useMachine } from '@destyler/vue'
import { computed,  useId } from 'vue'
import { DEFAULT_LOCALE, useEnvironmentContext, useLocaleContext } from '~/providers'
import { cleanProps } from '~/utils'

export interface UseProgressProps extends Optional<Omit<progress.Context, 'dir' | 'getRootNode' | 'value'>, 'id'> {
  /**
   * The initial value of the progress when it is first rendered.
   * Use when you do not need to control the state of the progress.
   */
  defaultValue?: progress.Context['value']
  /**
   * Use this prop to control the value of the progress.
   */
  modelValue?: progress.Context['value']
}
export interface UseProgressReturn extends ComputedRef<progress.Api<PropTypes>> {}

export function useProgress(props: UseProgressProps = {}, emit?: EmitFn<RootEmits>): UseProgressReturn {
  const id = useId()
  const env = useEnvironmentContext()
  const locale = useLocaleContext(DEFAULT_LOCALE)

  const context = computed<progress.Context>(() => ({
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

  const [state, send] = useMachine(progress.machine(context.value), { context })

  return computed(() => progress.connect(state.value, send, normalizeProps))
}
