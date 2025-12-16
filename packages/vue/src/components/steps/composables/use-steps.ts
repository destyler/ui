import type { PropTypes } from '@destyler/vue'
import type { ComputedRef } from 'vue'
import type { RootEmits } from '../types'
import type { EmitFn, Optional } from '~/types'
import * as steps from '@destyler/steps'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'
import { DEFAULT_LOCALE, useEnvironmentContext, useLocaleContext } from '~/providers'
import { cleanProps } from '~/utils'

export interface UseStepsProps extends Optional<Omit<steps.Context, 'dir' | 'getRootNode' | 'step'>, 'id'> {
  /**
   * The initial value of the step
   */
  defaultStep?: number
  /**
   * The v-model value of the step
   */
  modelValue?: number
}

export interface UseStepsReturn extends ComputedRef<steps.Api<PropTypes>> {}

export function useSteps(props: UseStepsProps = {}, emit?: EmitFn<RootEmits>): UseStepsReturn {
  const env = useEnvironmentContext()
  const locale = useLocaleContext(DEFAULT_LOCALE)
  const id = useId()

  const context = computed<steps.Context>(() => ({
    id,
    dir: locale.value.dir,
    getRootNode: env?.value?.getRootNode,
    step: props.modelValue ?? props.defaultStep,
    onStepChange: (details) => {
      emit?.('stepChange', details)
      emit?.('update:modelValue', details.step)
    },
    onStepComplete: () => emit?.('stepComplete'),
    ...cleanProps(props),
  }))

  const [state, send] = useMachine(steps.machine(context.value), { context })

  return computed(() => steps.connect(state.value, send, normalizeProps))
}
